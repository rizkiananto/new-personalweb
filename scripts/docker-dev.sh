#!/bin/bash

# Local Development Script for Personal Website
# This script helps with local development using Docker

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

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  prod        Start production environment"
    echo "  build       Build Docker image"
    echo "  test        Test Docker build"
    echo "  stop        Stop all containers"
    echo "  clean       Clean up containers and images"
    echo "  logs        Show application logs"
    echo "  shell       Open shell in running container"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Start development server"
    echo "  $0 prod     # Start production server"
    echo "  $0 build    # Build Docker image"
    echo "  $0 clean    # Clean up everything"
}

# Check prerequisites
check_prerequisites() {
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

    # Check if pnpm is installed
    if ! command -v pnpm &> /dev/null; then
        print_warning "pnpm is not installed. Installing via corepack..."
        corepack enable
        corepack prepare pnpm@latest --activate
    fi
}

# Start development environment
start_dev() {
    print_status "Starting development environment..."
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        pnpm install
    fi
    
    # Start development server
    docker compose --profile dev up --build
}

# Start production environment
start_prod() {
    print_status "Starting production environment..."
    
    # Build and start production containers
    docker compose --profile prod up --build -d
    
    print_status "Production environment started!"
    print_info "Application is available at: http://localhost:3000"
    print_info "Nginx proxy is available at: http://localhost:80"
    
    # Show container status
    docker compose --profile prod ps
}

# Build Docker image
build_image() {
    print_status "Building Docker image..."
    
    # Build the image
    docker build -t personalweb:latest .
    
    print_status "Docker image built successfully!"
    docker images personalweb:latest
}

# Test Docker build
test_build() {
    print_status "Testing Docker build..."
    
    # Build the image
    build_image
    
    # Test the container
    print_status "Testing container startup..."
    docker run --rm -d --name test-personalweb -p 3001:3000 personalweb:latest
    
    # Wait for container to start
    sleep 5
    
    # Test if the application is responding
    if curl -f -s http://localhost:3001 > /dev/null; then
        print_status "✅ Container test passed!"
    else
        print_error "❌ Container test failed!"
    fi
    
    # Stop test container
    docker stop test-personalweb
}

# Stop all containers
stop_containers() {
    print_status "Stopping all containers..."
    
    docker compose --profile dev down 2>/dev/null || true
    docker compose --profile prod down 2>/dev/null || true
    
    print_status "All containers stopped!"
}

# Clean up containers and images
cleanup() {
    print_status "Cleaning up containers and images..."
    
    # Stop all containers
    stop_containers
    
    # Remove unused containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    print_status "Cleanup completed!"
}

# Show application logs
show_logs() {
    print_status "Showing application logs..."
    
    if docker compose --profile prod ps | grep -q "Up"; then
        docker compose --profile prod logs -f
    elif docker compose --profile dev ps | grep -q "Up"; then
        docker compose --profile dev logs -f
    else
        print_warning "No containers are currently running"
    fi
}

# Open shell in running container
open_shell() {
    print_status "Opening shell in running container..."
    
    if docker compose --profile prod ps | grep -q "Up"; then
        docker compose --profile prod exec web-prod sh
    elif docker compose --profile dev ps | grep -q "Up"; then
        docker compose --profile dev exec web-dev sh
    else
        print_warning "No containers are currently running"
        print_info "Starting a temporary container..."
        docker run --rm -it personalweb:latest sh
    fi
}

# Main script logic
main() {
    case "${1:-help}" in
        dev)
            check_prerequisites
            start_dev
            ;;
        prod)
            check_prerequisites
            start_prod
            ;;
        build)
            check_prerequisites
            build_image
            ;;
        test)
            check_prerequisites
            test_build
            ;;
        stop)
            stop_containers
            ;;
        clean)
            cleanup
            ;;
        logs)
            show_logs
            ;;
        shell)
            open_shell
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run the main function
main "$@"