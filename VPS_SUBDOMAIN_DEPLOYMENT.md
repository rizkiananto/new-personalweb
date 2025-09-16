# Complete VPS Deployment Guide for Subdomain Setup

This guide provides step-by-step instructions for deploying your Next.js Personal Website to a VPS with existing Nginx configuration using a subdomain.

## 🎯 Overview

Your deployment will:
- Run on a subdomain (e.g., `portfolio.yourdomain.com`)
- Use existing Nginx installation
- Run in Docker containers on port 3100
- Include SSL/TLS certificates via Let's Encrypt
- Provide automated management scripts

## 📋 Prerequisites

### VPS Requirements
- Ubuntu 18.04+ or Debian 10+ VPS
- Existing Nginx installation
- Docker and Docker Compose installed
- Subdomain DNS pointing to your VPS
- Root or sudo access

### Local Requirements
- Git repository for your project
- Access to your VPS via SSH

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)

1. **SSH into your VPS**:
   ```bash
   ssh your-user@your-vps-ip
   ```

2. **Download and run the deployment script**:
   ```bash
   # Download the script
   curl -s -o subdomain-deploy.sh https://raw.githubusercontent.com/your-username/new-personalweb/main/scripts/subdomain-deploy.sh
   
   # Make it executable
   chmod +x subdomain-deploy.sh
   
   # Edit configuration
   nano subdomain-deploy.sh
   # Update: SUBDOMAIN="your-subdomain.your-domain.com"
   
   # Run deployment
   ./subdomain-deploy.sh
   ```

### Option 2: Manual Step-by-Step Deployment

Follow the detailed steps below for manual deployment.

## 🔧 Manual Deployment Steps

### Step 1: Prepare VPS Environment

1. **Update system packages**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install required packages** (if not already installed):
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo apt install -y docker-compose
   
   # Install Git (if needed)
   sudo apt install -y git
   ```

3. **Verify installations**:
   ```bash
   docker --version
   docker-compose --version
   nginx -v
   ```

### Step 2: Setup Project Directory

1. **Create deployment directory**:
   ```bash
   sudo mkdir -p /opt/personalweb
   sudo chown $USER:$USER /opt/personalweb
   cd /opt/personalweb
   ```

2. **Clone your repository**:
   ```bash
   git clone https://github.com/your-username/new-personalweb.git .
   ```

### Step 3: Configure Environment

1. **Setup environment variables**:
   ```bash
   cp .env.production .env
   nano .env
   ```

2. **Update `.env` with your values**:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://your-subdomain.your-domain.com
   NEXT_PUBLIC_API_KEY=your-api-key-here
   ```

### Step 4: Configure Nginx

1. **Copy Nginx configuration**:
   ```bash
   sudo cp nginx/subdomain.conf /etc/nginx/sites-available/personalweb
   ```

2. **Update configuration for your subdomain**:
   ```bash
   sudo nano /etc/nginx/sites-available/personalweb
   ```
   
   Replace:
   - `your-subdomain.your-domain.com` with your actual subdomain
   - Verify port `3100` matches your docker-compose configuration

3. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/personalweb /etc/nginx/sites-enabled/
   ```

4. **Test Nginx configuration**:
   ```bash
   sudo nginx -t
   ```

### Step 5: Setup SSL Certificate

1. **Install Certbot** (if not already installed):
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Option A: Use the SSL setup script**:
   ```bash
   ./scripts/ssl-setup.sh setup your-subdomain.your-domain.com
   ```

3. **Option B: Manual SSL setup**:
   ```bash
   # Stop Nginx temporarily
   sudo systemctl stop nginx
   
   # Obtain certificate
   sudo certbot certonly --standalone -d your-subdomain.your-domain.com
   
   # Start Nginx
   sudo systemctl start nginx
   ```

### Step 6: Deploy Application

1. **Build and start containers**:
   ```bash
   docker-compose --profile prod build
   docker-compose --profile prod up -d
   ```

2. **Verify containers are running**:
   ```bash
   docker-compose --profile prod ps
   ```

3. **Check application logs**:
   ```bash
   docker-compose --profile prod logs -f
   ```

### Step 7: Reload Nginx

1. **Test and reload Nginx**:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Step 8: Setup Systemd Service

1. **Create systemd service**:
   ```bash
   sudo tee /etc/systemd/system/personalweb.service > /dev/null <<EOF
   [Unit]
   Description=Personal Website Docker Compose
   Requires=docker.service
   After=docker.service

   [Service]
   Type=oneshot
   RemainAfterExit=yes
   WorkingDirectory=/opt/personalweb
   ExecStart=/usr/bin/docker-compose --profile prod up -d
   ExecStop=/usr/bin/docker-compose --profile prod down
   TimeoutStartSec=0

   [Install]
   WantedBy=multi-user.target
   EOF
   ```

2. **Enable the service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable personalweb.service
   ```

## 🔍 Testing Your Deployment

### Basic Tests

1. **Test HTTP redirect**:
   ```bash
   curl -I http://your-subdomain.your-domain.com
   # Should return 301 redirect to HTTPS
   ```

2. **Test HTTPS**:
   ```bash
   curl -I https://your-subdomain.your-domain.com
   # Should return 200 OK
   ```

3. **Test API endpoint**:
   ```bash
   curl -X POST https://your-subdomain.your-domain.com/api/v1/match-job \
        -H "Content-Type: application/json" \
        -d '{}'
   ```

### Advanced Tests

1. **SSL certificate test**:
   ```bash
   ./scripts/ssl-setup.sh check your-subdomain.your-domain.com
   ```

2. **Check application status**:
   ```bash
   ./scripts/status.sh  # If created by deployment script
   ```

## 🛠️ Management Commands

### Application Management

```bash
# Start application
docker-compose --profile prod up -d

# Stop application
docker-compose --profile prod down

# Restart application
docker-compose --profile prod restart

# View logs
docker-compose --profile prod logs -f

# Update application
git pull origin main
docker-compose --profile prod down
docker-compose --profile prod build --no-cache
docker-compose --profile prod up -d
```

### Nginx Management

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

### SSL Management

```bash
# Check SSL status
./scripts/ssl-setup.sh check your-subdomain.your-domain.com

# Renew SSL certificate
./scripts/ssl-setup.sh renew your-subdomain.your-domain.com

# Setup auto-renewal
./scripts/ssl-setup.sh auto-renew
```

### System Service Management

```bash
# Start service
sudo systemctl start personalweb

# Stop service
sudo systemctl stop personalweb

# Check service status
sudo systemctl status personalweb

# View service logs
journalctl -u personalweb -f
```

## 🔒 Security Considerations

### Firewall Configuration

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Container Security

- Application runs as non-root user in container
- Port 3100 is only accessible locally
- Nginx handles all external connections

### SSL/TLS Security

- Strong SSL ciphers configured
- HSTS headers enabled
- Security headers configured

## 📊 Monitoring and Maintenance

### Log Management

- Application logs: `docker-compose --profile prod logs`
- Nginx logs: `/var/log/nginx/personalweb_access.log`
- System logs: `journalctl -u personalweb`

### Backup Strategy

```bash
# Create backup script
./backup.sh  # If created by deployment script

# Manual backup
tar -czf personalweb-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  /opt/personalweb
```

### Update Procedure

```bash
# Regular updates
cd /opt/personalweb
git pull origin main
docker-compose --profile prod down
docker-compose --profile prod build --no-cache
docker-compose --profile prod up -d
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check what's using port 3100
   sudo lsof -i :3100
   
   # Change port in docker-compose.yml if needed
   ```

2. **SSL certificate issues**:
   ```bash
   # Check certificate status
   ./scripts/ssl-setup.sh check your-subdomain.your-domain.com
   
   # Renew if needed
   ./scripts/ssl-setup.sh renew your-subdomain.your-domain.com
   ```

3. **Nginx configuration errors**:
   ```bash
   # Test configuration
   sudo nginx -t
   
   # Check error logs
   sudo tail -f /var/log/nginx/error.log
   ```

4. **Container startup issues**:
   ```bash
   # Check container logs
   docker-compose --profile prod logs
   
   # Check container status
   docker-compose --profile prod ps
   ```

### Log Analysis

```bash
# Check application logs
docker-compose --profile prod logs --tail=100

# Check Nginx access logs
sudo tail -f /var/log/nginx/personalweb_access.log

# Check Nginx error logs
sudo tail -f /var/log/nginx/personalweb_error.log

# Check system service logs
journalctl -u personalweb --since "1 hour ago"
```

## 📞 Support and Resources

### Useful Commands Reference

```bash
# System status overview
systemctl status nginx personalweb
docker-compose --profile prod ps
df -h
free -h

# Performance monitoring
docker stats
htop
```

### Important File Locations

- **Application**: `/opt/personalweb`
- **Nginx config**: `/etc/nginx/sites-available/personalweb`
- **SSL certificates**: `/etc/letsencrypt/live/your-subdomain.your-domain.com/`
- **Logs**: `/var/log/nginx/` and `docker-compose logs`

This guide provides everything you need to successfully deploy your Next.js application to a VPS with existing Nginx setup using a subdomain configuration.