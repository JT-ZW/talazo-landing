#!/bin/bash

# Talazo Backend Deployment Script
# This script sets up the Talazo intelligence backend for deployment

set -e

echo "🚀 Starting Talazo Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on supported OS
check_os() {
    print_status "Checking operating system..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        print_success "Linux detected"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        print_success "macOS detected"
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
        DOCKER_VERSION=$(docker --version)
        print_status "Docker version: $DOCKER_VERSION"
    else
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed"
    else
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Check if Python is installed
check_python() {
    print_status "Checking Python installation..."
    
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python is installed: $PYTHON_VERSION"
    else
        print_error "Python 3 is not installed. Please install Python 3.11+ first."
        exit 1
    fi
}

# Install system dependencies
install_system_deps() {
    print_status "Installing system dependencies..."
    
    if [[ "$OS" == "linux" ]]; then
        # Ubuntu/Debian
        if command -v apt-get &> /dev/null; then
            print_status "Installing GDAL and geospatial libraries..."
            sudo apt-get update
            sudo apt-get install -y \
                gdal-bin \
                libgdal-dev \
                python3-gdal \
                libproj-dev \
                proj-data \
                proj-bin \
                libgeos-dev \
                libspatialindex-dev \
                build-essential \
                python3-dev
                
        # RHEL/CentOS/Fedora
        elif command -v yum &> /dev/null; then
            print_status "Installing GDAL and geospatial libraries..."
            sudo yum install -y \
                gdal \
                gdal-devel \
                python3-gdal \
                proj \
                proj-devel \
                geos \
                geos-devel \
                spatialindex \
                spatialindex-devel \
                gcc \
                gcc-c++ \
                python3-devel
        fi
        
    elif [[ "$OS" == "macos" ]]; then
        if command -v brew &> /dev/null; then
            print_status "Installing GDAL and geospatial libraries..."
            brew install gdal proj geos spatialindex
        else
            print_warning "Homebrew not found. Please install geospatial dependencies manually."
        fi
    fi
    
    print_success "System dependencies installed"
}

# Setup virtual environment
setup_virtualenv() {
    print_status "Setting up Python virtual environment..."
    
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_success "Virtual environment created"
    else
        print_warning "Virtual environment already exists"
    fi
    
    source venv/bin/activate
    print_success "Virtual environment activated"
    
    # Upgrade pip
    pip install --upgrade pip
    print_success "Pip upgraded"
}

# Install Python dependencies
install_python_deps() {
    print_status "Installing Python dependencies..."
    
    source venv/bin/activate
    
    # Install requirements
    pip install -r requirements.txt
    
    print_success "Python dependencies installed"
}

# Setup environment file
setup_env() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_warning "Environment file created from example"
        print_warning "Please edit .env file with your actual configuration values"
    else
        print_warning "Environment file already exists"
    fi
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    if [ -f "database_schema.sql" ]; then
        print_status "Database schema file found"
        print_warning "Please run the SQL schema file against your Supabase database"
        print_status "You can do this through the Supabase dashboard SQL editor"
    else
        print_warning "Database schema file not found"
    fi
}

# Build Docker images
build_docker() {
    print_status "Building Docker images..."
    
    if [ -f "docker-compose.yml" ]; then
        docker-compose build
        print_success "Docker images built successfully"
    else
        print_error "docker-compose.yml not found"
        exit 1
    fi
}

# Start services
start_services() {
    print_status "Starting services..."
    
    docker-compose up -d
    
    print_success "Services started successfully"
    print_status "Backend API will be available at: http://localhost:8000"
    print_status "API documentation at: http://localhost:8000/docs"
}

# Health check
health_check() {
    print_status "Running health check..."
    
    sleep 10  # Wait for services to start
    
    if curl -f http://localhost:8000/health &> /dev/null; then
        print_success "Backend is healthy and responding"
    else
        print_warning "Backend health check failed - may still be starting up"
        print_status "Check logs with: docker-compose logs backend"
    fi
}

# Print deployment summary
print_summary() {
    echo ""
    echo "=========================================="
    echo "🎉 Talazo Backend Deployment Complete!"
    echo "=========================================="
    echo ""
    echo "📊 API Documentation: http://localhost:8000/docs"
    echo "🔍 Health Check: http://localhost:8000/health"
    echo "📝 View Logs: docker-compose logs -f backend"
    echo "🛑 Stop Services: docker-compose down"
    echo ""
    echo "⚠️  Next Steps:"
    echo "1. Edit .env file with your actual configuration"
    echo "2. Run database_schema.sql in your Supabase database"
    echo "3. Test the API endpoints"
    echo "4. Set up your frontend to connect to this backend"
    echo ""
    echo "🆘 For support, visit: https://github.com/your-repo/talazo"
    echo ""
}

# Main deployment flow
main() {
    echo "=========================================="
    echo "🌱 Talazo Intelligence Backend Setup"
    echo "=========================================="
    echo ""
    
    check_os
    check_docker
    check_python
    
    print_status "Starting deployment process..."
    
    # Option 1: Docker deployment (recommended)
    read -p "Do you want to use Docker deployment? (y/n): " use_docker
    
    if [[ $use_docker == "y" || $use_docker == "Y" ]]; then
        setup_env
        run_migrations
        build_docker
        start_services
        health_check
    else
        # Option 2: Local development setup
        print_status "Setting up for local development..."
        install_system_deps
        setup_virtualenv
        install_python_deps
        setup_env
        run_migrations
        
        print_status "Local development setup complete"
        print_status "To start the server: source venv/bin/activate && uvicorn app.main:app --reload"
    fi
    
    print_summary
}

# Handle errors
trap 'print_error "Deployment failed! Check the error messages above."' ERR

# Run main function
main "$@"