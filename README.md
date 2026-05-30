# TubeGrab

TubeGrab is a modern client-side desktop application for downloading videos and audio from YouTube. It is built using Tauri v2, Next.js, and shadcn/ui, and bundles its own architecture-specific sidecar dependencies (yt-dlp and FFmpeg) to run completely self-contained.

## Features

- High-speed YouTube downloads for both video and audio.
- Native, platform-appropriate sidecars for yt-dlp and FFmpeg (no manual installation required).
- Real-time download progress tracker (speed, size, ETA, current phase).
- Support for selecting specific video resolutions (up to 4K) and audio formats (MP3, M4A, WAV).
- Completely local and private execution, downloading files directly to your system's Downloads folder.
- Dynamic, responsive user interface styled with shadcn/ui and custom CSS.

## Prerequisites for Development

Before setting up local development, make sure you have the following installed:

- Node.js (version 22 or higher)
- pnpm (version 10 or higher)
- Rust (stable toolchain)
- Platform build tools:
  - macOS: Xcode Command Line Tools (`xcode-select --install`)
  - Windows: C++ build tools from Visual Studio

## Local Development

Follow these steps to run the application locally in development mode:

1. Clone the repository and navigate to the project directory:
   ```bash
   cd downloader_tool
   ```

2. Install the frontend dependencies:
   ```bash
   pnpm install
   ```

3. Download the sidecar binaries for your platform:
   - For macOS: Ensure `yt-dlp` and `ffmpeg` binaries matching your architecture (aarch64/arm64 or x86_64) are placed in `src-tauri/binaries/` named as `yt-dlp-[arch]-apple-darwin` and `ffmpeg-[arch]-apple-darwin`.
   - For Windows: Place `yt-dlp-x86_64-pc-windows-msvc.exe` and `ffmpeg-x86_64-pc-windows-msvc.exe` in `src-tauri/binaries/`.

4. Start the application in development mode:
   ```bash
   pnpm tauri dev
   ```

## Production Build

To compile a production-ready package locally:

```bash
pnpm tauri build
```

This will output the installers in `src-tauri/target/release/bundle/`.

## Automated Releases via GitHub Actions

Releases are fully automated. Every time you push a tag starting with `v` (e.g. `v0.2.11`), GitHub Actions triggers a build:

1. It checks out the code, setups Node.js and Rust.
2. It fetches the latest appropriate static binaries for both macOS and Windows.
3. It compiles the applications, renaming and bundling the sidecars inside the final packages.
4. It creates a GitHub Release and attaches the compiled installers (`.dmg` for macOS, `.msi` and `.exe` for Windows) directly under the Releases section of the repository.

To release a new version:
1. Update the version inside `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml`.
2. Commit and push the changes to the `main` branch.
3. Tag and push the new version:
   ```bash
   git tag v0.2.11
   git push origin v0.2.11
   ```

## Scripts

The following scripts are defined in the project:

- `pnpm dev`: Start Next.js development server.
- `pnpm build`: Generate static production export for the frontend.
- `pnpm check`: Run Biome syntax check and linter.
- `pnpm check:fix`: Automatically fix lints and format using Biome.
- `pnpm format`: Format all frontend code.
