# Personal Website Docker Deployment Guide

This guide provides comprehensive instructions for deploying the Personal Website application using Docker and GitHub Container Registry (GHCR).

## 📋 Prerequisites

### Local Development
- Docker and Docker Compose
- Node.js 20+ and pnpm
- Git

### VPS Deployment
- Ubuntu/Debian VPS with root access
- Docker and Docker Compose installed
- Domain name (optional, for SSL)

## 🚀 Quick Start

### Local Development

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd new-personalweb
   chmod +x scripts/docker-dev.sh
   ```

2. **Start development environment**:
   ```bash
   ./scripts/docker-dev.sh dev
   ```

3. **Start production environment locally**:
   ```bash
   ./scripts/docker-dev.sh prod
   ```

### VPS Deployment

1. **Run setup script on VPS**:
   ```bash
   curl -s https://raw.githubusercontent.com/your-username/new-personalweb/main/scripts/vps-setup.sh | bash
   ```

2. **Configure environment**:
   ```bash
   cd /opt/personalweb
   nano .env  # Edit with your values
   ```

3. **Start the application**:
   ```bash
   sudo systemctl start personalweb
   ```

## 🏗️ Architecture

### Docker Setup
- **Multi-stage Dockerfile** optimized for Next.js
- **Development and Production** profiles in docker-compose
- **Nginx reverse proxy** with security headers and caching
- **GHCR integration** for automated deployments

### Services
- `web-dev`: Development server with hot reload
- `web-prod`: Production Next.js application
- `nginx`: Reverse proxy with SSL termination

## 📁 File Structure

```
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Development and production services
├── .dockerignore             # Docker build context exclusions
├── nginx/
│   └── nginx.conf            # Nginx configuration
├── scripts/
│   ├── docker-dev.sh         # Local development helper
│   └── vps-setup.sh          # VPS deployment script
├── .github/workflows/
│   └── deploy.yml            # CI/CD pipeline
└── .env.*                    # Environment configurations
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` for development:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_KEY=
```

Update `.env.production` for production:
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
NEXT_PUBLIC_API_KEY=your-api-key-here
```

### Docker Compose Profiles

- **Development**: `docker compose --profile dev up`
- **Production**: `docker compose --profile prod up`

## 🚀 Deployment Options

### Option 1: GitHub Actions (Recommended)

1. **Setup Repository Secrets**:
   - `VPS_HOST`: Your VPS IP address
   - `VPS_USERNAME`: SSH username
   - `VPS_SSH_KEY`: Private SSH key
   - `VPS_PORT`: SSH port (default: 22)

2. **Enable GHCR**:
   - Go to repository Settings → Actions → General
   - Enable "Read and write permissions" for GITHUB_TOKEN

3. **Deploy**:
   - Push to `main` branch triggers automatic deployment

### Option 2: Manual Deployment

1. **Build and push image**:
   ```bash
   docker build -t ghcr.io/your-username/new-personalweb:latest .
   docker push ghcr.io/your-username/new-personalweb:latest
   ```

2. **Deploy on VPS**:
   ```bash
   cd /opt/personalweb
   ./update.sh
   ```

## 🛠️ Development Commands

### Using Docker Development Script

```bash
# Start development environment
./scripts/docker-dev.sh dev

# Start production environment
./scripts/docker-dev.sh prod

# Build Docker image
./scripts/docker-dev.sh build

# Test Docker build
./scripts/docker-dev.sh test

# Stop all containers
./scripts/docker-dev.sh stop

# Clean up containers and images
./scripts/docker-dev.sh clean

# Show logs
./scripts/docker-dev.sh logs

# Open shell in container
./scripts/docker-dev.sh shell
```

### Manual Docker Commands

```bash
# Development
docker compose --profile dev up --build

# Production
docker compose --profile prod up --build -d

# View logs
docker compose --profile prod logs -f

# Stop services
docker compose --profile prod down
```

## 🔍 Monitoring and Maintenance

### Health Checks
- Application: `http://your-domain/health`
- Container status: `docker compose --profile prod ps`

### Log Management
- Application logs: `docker compose --profile prod logs -f`
- Nginx logs: `docker compose --profile prod logs nginx`
- Automatic log rotation configured via logrotate

### Updates
```bash
# Automated update
./update.sh

# Manual update
docker compose --profile prod pull
docker compose --profile prod up -d
```

### Backups
```bash
# Create backup
./backup.sh

# Backup includes:
# - Docker compose configuration
# - Environment files
# - Nginx configuration
```

## 🔒 Security

### Firewall Configuration
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### SSL Setup (Optional)
1. **Using Certbot**:
   ```bash
   sudo apt install certbot
   sudo certbot certonly --standalone -d your-domain.com
   ```

2. **Copy certificates**:
   ```bash
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/personalweb/nginx/ssl/cert.pem
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/personalweb/nginx/ssl/key.pem
   ```

3. **Update Nginx config** and restart

### Security Headers
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer-when-downgrade
- Content-Security-Policy: Configured

## 🐛 Troubleshooting

### Common Issues

1. **Container won't start**:
   ```bash
   docker compose --profile prod logs
   ```

2. **Port already in use**:
   ```bash
   sudo lsof -i :80
   sudo kill -9 <PID>
   ```

3. **Permission denied**:
   ```bash
   sudo chown -R $USER:$USER /opt/personalweb
   ```

4. **Out of disk space**:
   ```bash
   docker system prune -a
   ```

### Performance Tuning
- Adjust Nginx worker processes based on CPU cores
- Configure appropriate memory limits for containers
- Monitor container resource usage with `docker stats`

## 📊 Monitoring Setup

### System Service Status
```bash
sudo systemctl status personalweb
```

### Container Health
```bash
./monitor.sh
```

### Resource Usage
```bash
docker stats
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow automatically:
1. Builds and tests the application
2. Creates Docker image with semantic versioning
3. Pushes to GitHub Container Registry
4. Deploys to VPS via SSH
5. Performs health checks

### Workflow Triggers
- Push to `main` or `master` branch
- Git tags matching `v*` pattern
- Pull requests (build only)

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Check container status and resource usage
4. Verify environment configuration