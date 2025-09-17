#!/bin/bash

# Production Environment Verification Script
# This script helps verify that environment variables are properly set in production

set -e

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

# Check if .env file exists
check_env_file() {
    print_status "Checking environment file..."
    
    if [ -f ".env" ]; then
        print_status "✅ .env file found"
        
        # Check if required variables are set
        if grep -q "NEXT_PUBLIC_API_KEY=" .env; then
            API_KEY=$(grep "NEXT_PUBLIC_API_KEY=" .env | cut -d'=' -f2)
            if [ -n "$API_KEY" ] && [ "$API_KEY" != "your-api-key-here" ]; then
                print_status "✅ NEXT_PUBLIC_API_KEY is set"
            else
                print_error "❌ NEXT_PUBLIC_API_KEY is not properly configured"
            fi
        else
            print_error "❌ NEXT_PUBLIC_API_KEY not found in .env"
        fi
        
        if grep -q "NEXT_PUBLIC_API_BASE_URL=" .env; then
            API_URL=$(grep "NEXT_PUBLIC_API_BASE_URL=" .env | cut -d'=' -f2)
            if [ -n "$API_URL" ] && [ "$API_URL" != "https://your-subdomain.your-domain.com" ]; then
                print_status "✅ NEXT_PUBLIC_API_BASE_URL is set to: $API_URL"
            else
                print_error "❌ NEXT_PUBLIC_API_BASE_URL is not properly configured"
            fi
        else
            print_error "❌ NEXT_PUBLIC_API_BASE_URL not found in .env"
        fi
    else
        print_error "❌ .env file not found. Please create it from .env.production template"
        exit 1
    fi
}

# Check container environment
check_container_env() {
    print_status "Checking container environment variables..."
    
    if docker compose --profile prod ps | grep -q "personalweb-prod"; then
        print_status "Container is running, checking environment..."
        
        # Check environment variables in container
        API_KEY_IN_CONTAINER=$(docker compose --profile prod exec -T web-prod printenv NEXT_PUBLIC_API_KEY 2>/dev/null || echo "")
        API_URL_IN_CONTAINER=$(docker compose --profile prod exec -T web-prod printenv NEXT_PUBLIC_API_BASE_URL 2>/dev/null || echo "")
        
        if [ -n "$API_KEY_IN_CONTAINER" ]; then
            print_status "✅ NEXT_PUBLIC_API_KEY is available in container"
        else
            print_error "❌ NEXT_PUBLIC_API_KEY is not available in container"
        fi
        
        if [ -n "$API_URL_IN_CONTAINER" ]; then
            print_status "✅ NEXT_PUBLIC_API_BASE_URL is available in container: $API_URL_IN_CONTAINER"
        else
            print_error "❌ NEXT_PUBLIC_API_BASE_URL is not available in container"
        fi
    else
        print_warning "⚠️ Container is not running. Start it with: docker compose --profile prod up -d"
    fi
}

# Test API endpoint with authentication
test_api_auth() {
    print_status "Testing API authentication..."
    
    if [ -f ".env" ]; then
        source .env
        
        if [ -n "$NEXT_PUBLIC_API_BASE_URL" ] && [ -n "$NEXT_PUBLIC_API_KEY" ]; then
            print_info "Testing API endpoint: $NEXT_PUBLIC_API_BASE_URL/api/v1/match-job"
            
            # Test with API key
            HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
                -X POST "$NEXT_PUBLIC_API_BASE_URL/api/v1/match-job" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $NEXT_PUBLIC_API_KEY" \
                -d '{"job_opportunity":"test","email":"test@example.com"}' \
                2>/dev/null || echo "000")
            
            if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then
                print_status "✅ API endpoint is reachable and processing requests (HTTP $HTTP_CODE)"
            else
                print_warning "⚠️ API endpoint returned HTTP $HTTP_CODE"
            fi
        else
            print_error "❌ Cannot test API - environment variables not properly set"
        fi
    fi
}

# Main function
main() {
    print_status "🔍 Production Environment Verification"
    echo "======================================"
    
    check_env_file
    echo ""
    check_container_env
    echo ""
    test_api_auth
    
    echo ""
    print_status "✅ Verification completed"
    
    echo ""
    print_info "💡 Troubleshooting tips:"
    print_info "   1. If API key is missing, update .env file"
    print_info "   2. Rebuild container: docker compose --profile prod down && docker compose --profile prod up -d --build"
    print_info "   3. Check container logs: docker compose --profile prod logs"
    print_info "   4. Check browser network tab for Authorization header"
}

# Run the main function
main "$@"