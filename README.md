# TubeGrab

YouTube downloader with real-time progress, built with Next.js 16, shadcn/ui, tRPC, and yt-dlp.

## Local Development

```bash
# prerequisites: yt-dlp and ffmpeg
brew install yt-dlp ffmpeg

pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Zimablade via Tailscale + Docker)

### GitHub Secrets required

| Secret | Description |
|--------|-------------|
| `GHCR_TOKEN` | GitHub PAT with `read:packages` (for server to pull image) |
| `TS_OAUTH_CLIENT_ID` | Tailscale OAuth client ID |
| `TS_OAUTH_CLIENT_SECRET` | Tailscale OAuth client secret |
| `DEPLOY_HOST` | Tailscale hostname or IP of the server |
| `DEPLOY_USER` | SSH username on the server |
| `DEPLOY_SSH_KEY` | Private SSH key (matching `authorized_keys` on server) |

Create a GitHub **environment** named `production` (Settings → Environments).

### Tailscale OAuth

In [Tailscale Admin → OAuth clients](https://login.tailscale.com/admin/settings/oauth), create a client with `devices:read` scope and add `tag:ci` to ACL `tagOwners`.

### Server setup (one-time)

```bash
# install Docker
curl -fsSL https://get.docker.com | sh

# create app dir
mkdir -p /opt/tubegrab && cd /opt/tubegrab

# create docker-compose.yml referencing the ghcr image
# (see docker-compose.yml in repo, set GITHUB_REPOSITORY_OWNER and TAG vars)
echo 'GITHUB_REPOSITORY_OWNER=your-github-user' > .env
echo 'TAG=main' >> .env

# login to ghcr and pull
echo YOUR_GHCR_TOKEN | docker login ghcr.io -u your-github-user --password-stdin
docker compose pull && docker compose up -d
```

### Release workflow

```bash
# develop on dev, then:
git checkout main && git merge dev
git push origin main          # triggers build + deploy

# tagged release
git tag -a v1.0.0 -m "v1.0.0"
git push origin v1.0.0
```

## Scripts

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm check        # Biome lint + format check
pnpm check:fix    # auto-fix
```
