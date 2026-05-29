# Changelog

All notable changes to TubeGrab will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

## [0.1.0] - 2026-05-30

### Added
- YouTube video info fetching via yt-dlp `--dump-json`
- Real-time download progress via Server-Sent Events (SSE)
- Video formats: MP4, WebM, MKV
- Video quality selection: Best, 4K, 2K, 1080p, 720p, 480p, 360p, 240p
- Audio-only download: MP3, AAC, M4A, FLAC, WAV, OGG, OPUS
- Audio quality selection: Best, 320 / 256 / 192 / 128 / 96 kbps
- Advanced options: embed thumbnail, metadata, subtitles
- Circular SVG progress indicator with phase labels
- Dark YouTube-inspired UI (Space Grotesk + DM Sans)
- Decorative background orbs ("supercerchi")
- shadcn/ui components, Tailwind v4, Biome linting
- tRPC v11 + React Query v5 + Zod v4
- Multi-stage Dockerfile with yt-dlp + ffmpeg on Alpine
- docker-compose.yml with tmpfs-backed volume
- `dev` and `main` git branches

[Unreleased]: https://github.com/fapakslapa/downloader_tool/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/fapakslapa/downloader_tool/releases/tag/v0.1.0
