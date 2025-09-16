#!/bin/bash

# SSL Setup Script for Personal Website Subdomain
# This script handles SSL certificate setup for existing Nginx installations

set -e

# Configuration - EDIT THESE VALUES
SUBDOMAIN="your-subdomain.your-domain.com"
EMAIL="your-email@domain.com"  # Optional: for Let's Encrypt notifications

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

# Show usage
show_usage() {
    echo "SSL Setup Script for Personal Website"
    echo "Usage: $0 [COMMAND] [SUBDOMAIN]"
    echo ""
    echo "Commands:"
    echo "  setup           Setup SSL certificate for subdomain"
    echo "  renew           Renew existing SSL certificate"
    echo "  check           Check SSL certificate status"
    echo "  auto-renew      Setup automatic renewal"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup blog.yourdomain.com"
    echo "  $0 renew blog.yourdomain.com"
    echo "  $0 check blog.yourdomain.com"
}

# Check if Certbot is installed
check_certbot() {
    if ! command -v certbot &> /dev/null; then
        print_warning "Certbot not found. Installing..."
        
        # Update package list
        sudo apt update
        
        # Install certbot and nginx plugin
        sudo apt install -y certbot python3-certbot-nginx
        
        print_status "✅ Certbot installed successfully"
    else
        print_status "✅ Certbot is already installed"
    fi
}

# Setup SSL certificate
setup_ssl() {
    local domain=$1
    
    if [ -z "$domain" ]; then
        print_error "Domain not specified"
        show_usage
        exit 1
    fi
    
    print_status "Setting up SSL certificate for $domain..."
    
    # Check if certificate already exists
    if [ -d "/etc/letsencrypt/live/$domain" ]; then
        print_warning "SSL certificate already exists for $domain"
        read -p "Do you want to renew it? (y/N): " -r
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            renew_ssl "$domain"
        fi
        return
    fi
    
    # Method 1: Using Certbot with Nginx (recommended if Nginx config is ready)
    print_info "Attempting to use Certbot with Nginx plugin..."
    
    if [ -n "$EMAIL" ] && [ "$EMAIL" != "your-email@domain.com" ]; then
        EMAIL_FLAG="--email $EMAIL"
    else
        EMAIL_FLAG="--register-unsafely-without-email"
    fi
    
    if sudo certbot --nginx -d "$domain" $EMAIL_FLAG --agree-tos --non-interactive; then
        print_status "✅ SSL certificate setup completed using Nginx plugin"
        return
    fi
    
    print_warning "Nginx plugin failed, trying standalone method..."
    
    # Method 2: Standalone method (requires stopping Nginx temporarily)
    print_info "Using standalone method (will temporarily stop Nginx)..."
    
    # Stop Nginx temporarily
    print_status "Stopping Nginx temporarily..."
    sudo systemctl stop nginx
    
    # Obtain certificate using standalone method
    if sudo certbot certonly --standalone -d "$domain" $EMAIL_FLAG --agree-tos --non-interactive; then
        print_status "✅ SSL certificate obtained successfully"
        
        # Start Nginx again
        sudo systemctl start nginx
        
        # Test Nginx configuration
        if sudo nginx -t; then
            sudo systemctl reload nginx
            print_status "✅ Nginx configuration reloaded"
        else
            print_error "❌ Nginx configuration test failed"
        fi
    else
        print_error "❌ Failed to obtain SSL certificate"
        sudo systemctl start nginx
        exit 1
    fi
}

# Renew SSL certificate
renew_ssl() {
    local domain=$1
    
    if [ -z "$domain" ]; then
        print_error "Domain not specified"
        show_usage
        exit 1
    fi
    
    print_status "Renewing SSL certificate for $domain..."
    
    if sudo certbot renew --nginx; then
        print_status "✅ SSL certificate renewed successfully"
        sudo systemctl reload nginx
    else
        print_error "❌ Failed to renew SSL certificate"
        exit 1
    fi
}

# Check SSL certificate status
check_ssl() {
    local domain=$1
    
    if [ -z "$domain" ]; then
        print_error "Domain not specified"
        show_usage
        exit 1
    fi
    
    print_status "Checking SSL certificate for $domain..."
    
    if [ -d "/etc/letsencrypt/live/$domain" ]; then
        print_status "✅ Certificate exists"
        
        # Get certificate expiry date
        local expiry_date=$(sudo openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$domain/cert.pem" | cut -d= -f2)
        print_info "Certificate expires: $expiry_date"
        
        # Check if certificate expires in next 30 days
        local expiry_timestamp=$(date -d "$expiry_date" +%s)
        local current_timestamp=$(date +%s)
        local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [ $days_until_expiry -lt 30 ]; then
            print_warning "⚠️ Certificate expires in $days_until_expiry days - consider renewing"
        else
            print_status "✅ Certificate is valid for $days_until_expiry more days"
        fi
        
        # Test HTTPS connection
        if curl -s -f "https://$domain" > /dev/null; then
            print_status "✅ HTTPS connection is working"
        else
            print_warning "⚠️ HTTPS connection test failed"
        fi
    else
        print_error "❌ No certificate found for $domain"
        exit 1
    fi
}

# Setup automatic renewal
setup_auto_renew() {
    print_status "Setting up automatic SSL certificate renewal..."
    
    # Check if cron job already exists
    if crontab -l 2>/dev/null | grep -q "certbot renew"; then
        print_status "✅ Automatic renewal is already configured"
        return
    fi
    
    # Add cron job for automatic renewal
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --nginx && /usr/bin/systemctl reload nginx") | crontab -
    
    print_status "✅ Automatic renewal configured"
    print_info "Certificates will be checked for renewal daily at 12:00 PM"
}

# Test SSL configuration
test_ssl() {
    local domain=$1
    
    if [ -z "$domain" ]; then
        print_error "Domain not specified"
        show_usage
        exit 1
    fi
    
    print_status "Testing SSL configuration for $domain..."
    
    # Test SSL certificate
    if openssl s_client -connect "$domain:443" -servername "$domain" < /dev/null 2>/dev/null | openssl x509 -noout -text | grep -q "Subject:"; then
        print_status "✅ SSL certificate is valid"
    else
        print_error "❌ SSL certificate test failed"
    fi
    
    # Test SSL Labs rating (requires external service)
    print_info "💡 For detailed SSL analysis, visit: https://www.ssllabs.com/ssltest/analyze.html?d=$domain"
}

# Main script logic
main() {
    local command=${1:-help}
    local domain=${2:-$SUBDOMAIN}
    
    case "$command" in
        setup)
            check_certbot
            setup_ssl "$domain"
            setup_auto_renew
            test_ssl "$domain"
            ;;
        renew)
            renew_ssl "$domain"
            ;;
        check)
            check_ssl "$domain"
            ;;
        auto-renew)
            setup_auto_renew
            ;;
        test)
            test_ssl "$domain"
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run the main function
main "$@"