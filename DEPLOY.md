# Deploy Guide — TubeGrab on Zimablade via Tailscale

## Overview

The CI/CD pipeline:
1. Push to `main` (or a `v*` tag) → GitHub Actions builds a Docker image
2. Image is pushed to **GitHub Container Registry** (`ghcr.io`)
3. Actions SSHes into the Zimablade **over Tailscale** and pulls + restarts the container

---

## 1. GitHub Repository Setup

1. Create the repository on GitHub (public or private)
2. Push both branches:
   ```bash
   git remote add origin git@github.com:YOUR_USER/tubegrab.git
   git push -u origin main
   git push -u origin dev
   ```

---

## 2. GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|--------|-------|
| `GHCR_TOKEN` | A GitHub Personal Access Token with `read:packages` scope (used by the server to pull the image) |
| `TS_OAUTH_CLIENT_ID` | Tailscale OAuth client ID (see step 3) |
| `TS_OAUTH_CLIENT_SECRET` | Tailscale OAuth client secret |
| `DEPLOY_HOST` | Tailscale hostname or IP of the Zimablade (e.g. `zimablade` or `100.x.x.x`) |
| `DEPLOY_USER` | SSH username on the server (e.g. `root` or `ubuntu`) |
| `DEPLOY_SSH_KEY` | Private SSH key (the one whose public key is in `~/.ssh/authorized_keys` on the server) |

Also create a **GitHub environment** named `production` (Settings → Environments) for the deploy job.

---

## 3. Tailscale OAuth Client

1. Go to [Tailscale Admin → Settings → OAuth clients](https://login.tailscale.com/admin/settings/oauth)
2. Create a new client with scope `devices:read`
3. Add a tag ACL rule so the CI runner can join:
   ```json
   "tagOwners": {
     "tag:ci": ["autogroup:admin"]
   }
   ```
4. Copy the **Client ID** and **Client Secret** into GitHub Secrets

---

## 4. Zimablade Server Setup

### Install Docker
```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER
```

### Create the app directory
```bash
mkdir -p /opt/tubegrab
cd /opt/tubeglade
```

### Create `docker-compose.yml` on the server
```yaml
services:
  tubegrab:
    image: ghcr.io/YOUR_GITHUB_USER/tubegrab:main
    container_name: tubegrab
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - YT_DLP_BIN=/usr/local/bin/yt-dlp
      - FFMPEG_BIN=/usr/bin/ffmpeg
    volumes:
      - ytdl_tmp:/tmp/ytdl

volumes:
  ytdl_tmp:
```

Replace `YOUR_GITHUB_USER` with your GitHub username.

### Pre-login to GHCR (one-time)
```bash
echo YOUR_GHCR_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USER --password-stdin
```

### First manual deploy
```bash
cd /opt/tubegrab
docker compose pull
docker compose up -d
```

---

## 5. How to Deploy

### Automatic (CI/CD)
```bash
git checkout main
git merge dev
git push origin main          # triggers the workflow
```

### Tagged release
```bash
git tag -a v1.0.0 -m "v1.0.0"
git push origin v1.0.0        # builds image tagged v1.0.0 AND deploys
```

### Manual trigger
GitHub → Actions → "Build and Deploy" → Run workflow

---

## 6. Update yt-dlp on the Server

yt-dlp is baked into the Docker image. To update it, just rebuild:
```bash
git commit --allow-empty -m "chore: rebuild image to update yt-dlp"
git push origin main
```

Or locally:
```bash
docker compose build --no-cache
docker compose push
```

---

## 7. Logs & Monitoring

```bash
docker logs tubegrab -f          # follow logs
docker compose ps                 # container status
docker exec -it tubegrab yt-dlp --version
```
