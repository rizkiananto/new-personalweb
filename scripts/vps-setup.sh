#!/bin/bash

# VPS Deployment Script for Personal Website
# This script sets up the deployment environment on your VPS

set -e

echo "🚀 Setting up Personal Website deployment on VPS..."

# Configuration
PROJECT_NAME="personalweb"
DEPLOY_DIR="/opt/${PROJECT_NAME}"
REPO_URL="ghcr.io/your-username/new-personalweb"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create deployment directory
print_status "Creating deployment directory..."
sudo mkdir -p $DEPLOY_DIR
sudo chown $USER:$USER $DEPLOY_DIR

# Navigate to deployment directory
cd $DEPLOY_DIR

# Download docker-compose.yml and related files
print_status "Downloading deployment files..."
curl -s -o docker-compose.yml https://raw.githubusercontent.com/your-username/new-personalweb/main/docker-compose.yml
curl -s -o .env.production https://raw.githubusercontent.com/your-username/new-personalweb/main/.env.production

# Create nginx directory and download config
mkdir -p nginx
curl -s -o nginx/nginx.conf https://raw.githubusercontent.com/your-username/new-personalweb/main/nginx/nginx.conf

# Create SSL directory for future SSL certificates
mkdir -p nginx/ssl

# Set up environment variables
print_status "Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.production .env
    print_warning "Please edit .env file with your actual values before starting the application"
fi

# Create systemd service for auto-restart
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/${PROJECT_NAME}.service > /dev/null <<EOF
[Unit]
Description=Personal Website Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${DEPLOY_DIR}
ExecStart=/usr/bin/docker compose --profile prod up -d
ExecStop=/usr/bin/docker compose --profile prod down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable ${PROJECT_NAME}.service

# Create update script
print_status "Creating update script..."
cat > update.sh << 'EOF'
#!/bin/bash
set -e

echo "🔄 Updating Personal Website..."

# Pull latest images
docker compose --profile prod pull

# Stop current containers
docker compose --profile prod down

# Start new containers
docker compose --profile prod up -d

# Clean up old images
docker image prune -f

echo "✅ Update completed successfully!"
EOF

chmod +x update.sh

# Create backup script
print_status "Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash
set -e

BACKUP_DIR="/backup/personalweb"
DATE=$(date +%Y%m%d_%H%M%S)

echo "📦 Creating backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup docker-compose and config files
tar -czf $BACKUP_DIR/config_$DATE.tar.gz docker-compose.yml .env nginx/

echo "✅ Backup created: $BACKUP_DIR/config_$DATE.tar.gz"
EOF

chmod +x backup.sh

# Set up log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/${PROJECT_NAME} > /dev/null <<EOF
/var/lib/docker/containers/*/*-json.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
EOF

# Create monitoring script
print_status "Creating monitoring script..."
cat > monitor.sh << 'EOF'
#!/bin/bash

# Check if containers are running
if ! docker compose --profile prod ps | grep -q "Up"; then
    echo "⚠️  Some containers are not running!"
    docker compose --profile prod ps
    exit 1
fi

# Check if web service is responding
if ! curl -f -s http://localhost:80/health > /dev/null; then
    echo "⚠️  Health check failed!"
    exit 1
fi

echo "✅ All services are healthy"
EOF

chmod +x monitor.sh

# Set up firewall rules (if ufw is available)
if command -v ufw &> /dev/null; then
    print_status "Configuring firewall..."
    sudo ufw allow 22/tcp comment "SSH"
    sudo ufw allow 80/tcp comment "HTTP"
    sudo ufw allow 443/tcp comment "HTTPS"
    sudo ufw --force enable
fi

print_status "✅ VPS setup completed!"
print_warning "Next steps:"
echo "1. Edit .env file with your actual values"
echo "2. Update docker-compose.yml with your image repository"
echo "3. Configure your domain DNS to point to this server"
echo "4. Run: sudo systemctl start ${PROJECT_NAME}"
echo "5. For SSL setup, use certbot or place certificates in nginx/ssl/"
echo ""
echo "Useful commands:"
echo "- Start: sudo systemctl start ${PROJECT_NAME}"
echo "- Stop: sudo systemctl stop ${PROJECT_NAME}"
echo "- Update: ./update.sh"
echo "- Monitor: ./monitor.sh"
echo "- Backup: ./backup.sh"
echo "- Logs: docker compose --profile prod logs -f"