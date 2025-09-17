#!/bin/bash

# Subdomain VPS Deployment Script for Personal Website
# This script deploys to a VPS with existing Nginx configuration

set -e

# Configuration - EDIT THESE VALUES
SUBDOMAIN="your-subdomain.your-domain.com"
APP_NAME="personalweb"
DEPLOY_DIR="/opt/${APP_NAME}"
CONTAINER_PORT="3100"
NGINX_SITES_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root for security reasons"
        print_info "Please run as a regular user with sudo privileges"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
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

    # Check if Nginx is installed and running
    if ! command -v nginx &> /dev/null; then
        print_error "Nginx is not installed. Please install Nginx first."
        exit 1
    fi

    if ! systemctl is-active --quiet nginx; then
        print_warning "Nginx is not running. Starting Nginx..."
        sudo systemctl start nginx
    fi

    print_status "✅ All prerequisites met"
}

# Create deployment directory
setup_deployment_dir() {
    print_status "Setting up deployment directory..."
    
    # Create deployment directory
    sudo mkdir -p $DEPLOY_DIR
    sudo chown $USER:$USER $DEPLOY_DIR
    
    # Navigate to deployment directory
    cd $DEPLOY_DIR
}

# Download deployment files
download_files() {
    print_status "Downloading deployment files..."
    
    # You can either clone the repository or download specific files
    # Option 1: Clone repository (recommended)
    if [ ! -d ".git" ]; then
        print_info "Cloning repository..."
        git clone https://github.com/your-username/new-personalweb.git .
    else
        print_info "Updating repository..."
        git pull origin main
    fi
    
    # Option 2: Download specific files (alternative)
    # curl -s -o docker-compose.yml https://raw.githubusercontent.com/your-username/new-personalweb/main/docker-compose.yml
    # curl -s -o Dockerfile https://raw.githubusercontent.com/your-username/new-personalweb/main/Dockerfile
    # curl -s -o .env.production https://raw.githubusercontent.com/your-username/new-personalweb/main/.env.production
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Create environment file if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.production .env
        
        # Update environment file with subdomain
        sed -i "s/your-domain.com/$SUBDOMAIN/g" .env
        
        print_warning "Please edit .env file with your actual values:"
        print_info "nano .env"
        
        read -p "Press Enter to continue after editing .env file..."
    fi
    
    # Verify environment setup
    if [ -f "scripts/verify-env.sh" ]; then
        print_status "Verifying environment configuration..."
        chmod +x scripts/verify-env.sh
        ./scripts/verify-env.sh
    fi
}

# Setup Nginx configuration
setup_nginx() {
    print_status "Setting up Nginx configuration..."
    
    # Copy Nginx configuration
    sudo cp nginx/subdomain.conf $NGINX_SITES_DIR/${APP_NAME}
    
    # Update subdomain in configuration
    sudo sed -i "s/your-subdomain.your-domain.com/$SUBDOMAIN/g" $NGINX_SITES_DIR/${APP_NAME}
    sudo sed -i "s/127.0.0.1:3100/127.0.0.1:$CONTAINER_PORT/g" $NGINX_SITES_DIR/${APP_NAME}
    
    # Enable the site
    sudo ln -sf $NGINX_SITES_DIR/${APP_NAME} $NGINX_ENABLED_DIR/
    
    # Test Nginx configuration
    if sudo nginx -t; then
        print_status "✅ Nginx configuration is valid"
    else
        print_error "❌ Nginx configuration is invalid"
        exit 1
    fi
}

# Setup SSL certificate
setup_ssl() {
    print_status "Setting up SSL certificate..."
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        print_warning "Certbot not found. Installing..."
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Check if certificate already exists
    if [ ! -d "/etc/letsencrypt/live/$SUBDOMAIN" ]; then
        print_status "Obtaining SSL certificate for $SUBDOMAIN..."
        
        # Stop nginx temporarily to obtain certificate
        sudo systemctl stop nginx
        
        # Obtain certificate
        if sudo certbot certonly --standalone -d $SUBDOMAIN --agree-tos --register-unsafely-without-email --non-interactive; then
            print_status "✅ SSL certificate obtained successfully"
        else
            print_error "❌ Failed to obtain SSL certificate"
            sudo systemctl start nginx
            exit 1
        fi
        
        # Start nginx again
        sudo systemctl start nginx
    else
        print_status "✅ SSL certificate already exists for $SUBDOMAIN"
    fi
}

# Deploy application
deploy_application() {
    print_status "Deploying application..."
    
    # Build and start the application
    docker compose --profile prod build
    docker compose --profile prod up -d
    
    # Wait for application to start
    print_status "Waiting for application to start..."
    sleep 10
    
    # Check if container is running
    if docker compose --profile prod ps | grep -q "Up"; then
        print_status "✅ Application started successfully"
        
        # Verify environment variables in production
        if [ -f "scripts/verify-env.sh" ]; then
            print_status "Verifying production environment..."
            ./scripts/verify-env.sh
        fi
    else
        print_error "❌ Application failed to start"
        docker compose --profile prod logs
        exit 1
    fi
}

# Setup systemd service
setup_systemd() {
    print_status "Setting up systemd service..."
    
    # Create systemd service file
    sudo tee /etc/systemd/system/${APP_NAME}.service > /dev/null <<EOF
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
    sudo systemctl enable ${APP_NAME}.service
}

# Create management scripts
create_scripts() {
    print_status "Creating management scripts..."
    
    # Update script
    cat > update.sh << 'EOF'
#!/bin/bash
set -e

echo "🔄 Updating Personal Website..."

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker compose --profile prod down
docker compose --profile prod build --no-cache
docker compose --profile prod up -d

# Clean up old images
docker image prune -f

echo "✅ Update completed successfully!"
EOF

    # Status script
    cat > status.sh << 'EOF'
#!/bin/bash

echo "📊 Personal Website Status"
echo "=========================="

# Check container status
echo "Container Status:"
docker compose --profile prod ps

echo ""
echo "Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "Recent Logs (last 20 lines):"
docker compose --profile prod logs --tail=20
EOF

    # Backup script
    cat > backup.sh << 'EOF'
#!/bin/bash
set -e

BACKUP_DIR="/backup/personalweb"
DATE=$(date +%Y%m%d_%H%M%S)

echo "📦 Creating backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    .

# Backup nginx configuration
sudo tar -czf $BACKUP_DIR/nginx_$DATE.tar.gz \
    /etc/nginx/sites-available/personalweb \
    /etc/nginx/sites-enabled/personalweb

echo "✅ Backup created:"
echo "   App: $BACKUP_DIR/app_$DATE.tar.gz"
echo "   Nginx: $BACKUP_DIR/nginx_$DATE.tar.gz"
EOF

    # Make scripts executable
    chmod +x update.sh status.sh backup.sh
}

# Reload Nginx
reload_nginx() {
    print_status "Reloading Nginx configuration..."
    
    if sudo nginx -t && sudo systemctl reload nginx; then
        print_status "✅ Nginx reloaded successfully"
    else
        print_error "❌ Failed to reload Nginx"
        exit 1
    fi
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Wait a bit for the application to fully start
    sleep 15
    
    # Test HTTP redirect
    if curl -s -o /dev/null -w "%{http_code}" http://$SUBDOMAIN | grep -q "301"; then
        print_status "✅ HTTP to HTTPS redirect working"
    else
        print_warning "⚠️ HTTP redirect may not be working properly"
    fi
    
    # Test HTTPS
    if curl -s -f https://$SUBDOMAIN > /dev/null; then
        print_status "✅ HTTPS endpoint is responding"
    else
        print_warning "⚠️ HTTPS endpoint may not be responding properly"
    fi
    
    # Test API endpoint
    if curl -s -f https://$SUBDOMAIN/api/v1/match-job -X POST -H "Content-Type: application/json" -d '{}' > /dev/null; then
        print_status "✅ API endpoint is responding"
    else
        print_warning "⚠️ API endpoint may not be responding properly"
    fi
}

# Main deployment function
main() {
    print_status "🚀 Starting subdomain deployment for $SUBDOMAIN..."
    
    check_root
    check_prerequisites
    setup_deployment_dir
    download_files
    setup_environment
    setup_nginx
    setup_ssl
    deploy_application
    setup_systemd
    create_scripts
    reload_nginx
    test_deployment
    
    print_status "✅ Deployment completed successfully!"
    
    echo ""
    print_info "🎉 Your application is now available at:"
    print_info "   https://$SUBDOMAIN"
    echo ""
    print_info "📋 Management commands:"
    print_info "   Update:  ./update.sh"
    print_info "   Status:  ./status.sh"
    print_info "   Backup:  ./backup.sh"
    print_info "   Logs:    docker compose --profile prod logs -f"
    print_info "   Stop:    docker compose --profile prod down"
    print_info "   Start:   docker compose --profile prod up -d"
    echo ""
    print_info "📁 Application files: $DEPLOY_DIR"
    print_info "📄 Nginx config: $NGINX_SITES_DIR/${APP_NAME}"
    print_info "🔒 SSL cert: /etc/letsencrypt/live/$SUBDOMAIN"
}

# Run the main function
main "$@"