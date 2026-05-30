use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use serde::{Serialize, Deserialize};
use std::sync::OnceLock;
use regex::Regex;

static PROGRESS_RE: OnceLock<Regex> = OnceLock::new();

fn parse_progress(line: &str) -> Option<(f64, String, String, String)> {
    let re = PROGRESS_RE.get_or_init(|| {
        Regex::new(r"\[download\]\s+([\d.]+)%\s+of\s+(?:~?\s*)([\d.]+\s*\S+)\s+at\s+([\d.]+\s*\S+/s)\s+ETA\s+(\S+)").unwrap()
    });

    if let Some(caps) = re.captures(line) {
        let percent = caps.get(1)?.as_str().parse::<f64>().ok()?;
        let size = caps.get(2)?.as_str().to_string();
        let speed = caps.get(3)?.as_str().to_string();
        let eta = caps.get(4)?.as_str().to_string();
        Some((percent, size, speed, eta))
    } else {
        None
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct VideoInfo {
    id: String,
    title: String,
    thumbnail: String,
    duration: u64,
    channel: String,
    channelUrl: Option<String>,
    viewCount: Option<u64>,
    likeCount: Option<u64>,
    uploadDate: Option<String>,
    url: String,
    isLive: bool,
    availableHeights: Vec<u32>,
    hasSubtitles: bool,
}

#[derive(Serialize, Deserialize, Debug)]
struct YtRawThumbnail {
    url: String,
    width: Option<u32>,
}

#[derive(Serialize, Deserialize, Debug)]
struct YtRawFormat {
    height: Option<u32>,
    ext: Option<String>,
    vcodec: Option<String>,
    acodec: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct YtRaw {
    id: String,
    title: String,
    thumbnail: String,
    thumbnails: Option<Vec<YtRawThumbnail>>,
    duration: Option<f64>,
    channel: Option<String>,
    uploader: Option<String>,
    channel_url: Option<String>,
    view_count: Option<u64>,
    like_count: Option<u64>,
    upload_date: Option<String>,
    webpage_url: String,
    formats: Vec<YtRawFormat>,
    is_live: Option<bool>,
    live_status: Option<String>,
    subtitles: Option<serde_json::Value>,
    automatic_captions: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct DownloadProgressPayload {
    r#type: String,
    percent: Option<f64>,
    size: Option<String>,
    speed: Option<String>,
    eta: Option<String>,
    phase: u32,
    message: Option<String>,
    filename: Option<String>,
}

#[tauri::command]
async fn get_video_info(app: AppHandle, url: String) -> Result<VideoInfo, String> {
    let url = url.trim();
    if !url.contains("youtube.com") && !url.contains("youtu.be") {
        return Err("URL non valido. Inserisci un link YouTube.".to_string());
    }

    let args = vec!["--dump-json", "--no-warnings", "--no-call-home", url];

    let command = match app.shell().sidecar("yt-dlp") {
        Ok(cmd) => cmd.args(args),
        Err(_) => tauri_plugin_shell::process::Command::new("yt-dlp").args(args),
    };

    let output = command.output()
        .map_err(|e| format!("Impossibile eseguire yt-dlp: {}", e))?;

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr);
        if err.contains("unavailable") || err.contains("Private") {
            return Err("Video non disponibile o privato.".to_string());
        }
        return Err(format!("Errore da yt-dlp: {}", err));
    }

    let raw: YtRaw = serde_json::from_slice(&output.stdout)
        .map_err(|e| format!("Errore nel parsing delle informazioni: {}", e))?;

    let video_formats: Vec<&YtRawFormat> = raw.formats.iter().filter(|f| {
        f.vcodec.as_deref().unwrap_or("none") != "none"
            && f.height.is_some()
            && !vec![Some("mhtml".to_string()), Some("sb".to_string())].contains(&f.ext)
    }).collect();

    let mut heights: Vec<u32> = video_formats.iter().map(|f| f.height.unwrap()).collect();
    heights.sort_by(|a, b| b.cmp(a));
    heights.dedup();

    let best_thumbnail = raw.thumbnails.as_ref()
        .and_then(|t_list| {
            let mut list = t_list.clone();
            list.sort_by_key(|t| t.width.unwrap_or(0));
            list.last().map(|t| t.url.clone())
        })
        .unwrap_or(raw.thumbnail);

    let has_subs = raw.subtitles.as_ref()
        .map(|s| s.as_object().map(|obj| obj.keys().any(|k| k != "live_chat")).unwrap_or(false))
        .unwrap_or(false)
        || raw.automatic_captions.as_ref()
        .map(|s| s.as_object().map(|obj| obj.keys().any(|k| k != "live_chat")).unwrap_or(false))
        .unwrap_or(false);

    Ok(VideoInfo {
        id: raw.id,
        title: raw.title,
        thumbnail: best_thumbnail,
        duration: raw.duration.unwrap_or(0.0) as u64,
        channel: raw.channel.or(raw.uploader).unwrap_or_else(|| "Unknown".to_string()),
        channelUrl: raw.channel_url,
        viewCount: raw.view_count,
        likeCount: raw.like_count,
        uploadDate: raw.upload_date,
        url: raw.webpage_url,
        isLive: raw.is_live.unwrap_or(false) || raw.live_status.as_deref() == Some("is_live"),
        availableHeights: heights,
        hasSubtitles: has_subs,
    })
}

#[tauri::command]
async fn download_video(
    app: AppHandle,
    url: String,
    download_type: String,
    video_format: String,
    video_quality: String,
    audio_format: String,
    audio_quality: String,
    embed_subs: bool,
    embed_thumbnail: bool,
    embed_metadata: bool,
) -> Result<String, String> {
    let download_dir = app.path().download_dir()
        .map_err(|e| format!("Impossibile trovare la cartella Download: {}", e))?;

    let output_template = download_dir.join("%(title)s.%(ext)s");
    let output_str = output_template.to_str().ok_or("Errore nel percorso di download")?;

    let mut args = vec![
        url.clone(),
        "-o".to_string(),
        output_str.to_string(),
        "--no-warnings".to_string(),
        "--no-call-home".to_string(),
        "--newline".to_string(),
        "--progress".to_string(),
    ];

    if download_type == "audio" {
        args.push("-x".to_string());
        args.push("--audio-format".to_string());
        args.push(audio_format);
        if audio_quality != "best" {
            args.push("--audio-quality".to_string());
            args.push(format!("{}K", audio_quality));
        }
    } else {
        let format_str = if video_quality == "best" {
            "bestvideo+bestaudio/best".to_string()
        } else {
            format!("bestvideo[height<={}]+bestaudio/best", video_quality)
        };
        args.push("-f".to_string());
        args.push(format_str);
        args.push("--merge-output-format".to_string());
        args.push(video_format);
    }

    if embed_subs {
        args.push("--all-subs".to_string());
        args.push("--embed-subs".to_string());
    }
    if embed_thumbnail {
        args.push("--embed-thumbnail".to_string());
    }
    if embed_metadata {
        args.push("--add-metadata".to_string());
    }

    let mut command = match app.shell().sidecar("yt-dlp") {
        Ok(cmd) => cmd.args(args),
        Err(_) => tauri_plugin_shell::process::Command::new("yt-dlp").args(args),
    };

    let (mut rx, _child) = command.spawn()
        .map_err(|e| format!("Impossibile avviare yt-dlp: {}", e))?;

    let mut phase = 0;
    let mut err_buf = String::new();

    while let Some(event) = rx.recv().await {
        match event {
            CommandEvent::Stdout(bytes) => {
                let line = String::from_utf8_lossy(&bytes);
                for l in line.lines() {
                    if l.contains("[download] Destination:") {
                        phase += 1;
                        let _ = app.emit("download-progress", DownloadProgressPayload {
                            r#type: "phase".to_string(),
                            percent: None,
                            size: None,
                            speed: None,
                            eta: None,
                            phase,
                            message: None,
                            filename: None,
                        });
                    } else if l.contains("[Merger]") || l.contains("[ffmpeg]") {
                        let _ = app.emit("download-progress", DownloadProgressPayload {
                            r#type: "merging".to_string(),
                            percent: Some(100.0),
                            size: None,
                            speed: None,
                            eta: None,
                            phase,
                            message: None,
                            filename: None,
                        });
                    } else if let Some((percent, size, speed, eta)) = parse_progress(l) {
                        let _ = app.emit("download-progress", DownloadProgressPayload {
                            r#type: "progress".to_string(),
                            percent: Some(percent),
                            size: Some(size),
                            speed: Some(speed),
                            eta: Some(eta),
                            phase,
                            message: None,
                            filename: None,
                        });
                    } else if l.contains("ERROR:") {
                        err_buf.push_str(l);
                        err_buf.push('\n');
                    }
                }
            }
            CommandEvent::Stderr(bytes) => {
                let line = String::from_utf8_lossy(&bytes);
                for l in line.lines() {
                    if l.contains("ERROR:") {
                        err_buf.push_str(l);
                        err_buf.push('\n');
                    }
                }
            }
            CommandEvent::Terminated(payload) => {
                if payload.code == Some(0) {
                    let _ = app.emit("download-progress", DownloadProgressPayload {
                        r#type: "complete".to_string(),
                        percent: Some(100.0),
                        size: None,
                        speed: None,
                        eta: None,
                        phase,
                        message: None,
                        filename: Some("Video scaricato con successo nella cartella Download".to_string()),
                    });
                } else {
                    let err_msg = if err_buf.is_empty() {
                        format!("Download fallito con codice {:?}", payload.code)
                    } else {
                        err_buf.clone()
                    };
                    let _ = app.emit("download-progress", DownloadProgressPayload {
                        r#type: "error".to_string(),
                        percent: None,
                        size: None,
                        speed: None,
                        eta: None,
                        phase,
                        message: Some(err_msg),
                        filename: None,
                    });
                }
            }
            _ => {}
        }
    }

    Ok("Terminato".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_video_info, download_video])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
