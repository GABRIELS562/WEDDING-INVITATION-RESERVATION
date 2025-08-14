#!/bin/bash

# 🎉 Dale & Kirsten's Wedding RSVP - Production Deployment Script
# Bulletproof deployment with comprehensive checks and rollback capability

set -euo pipefail  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$PROJECT_DIR/deployments/backup_$TIMESTAMP"
LOG_FILE="$PROJECT_DIR/deployment_$TIMESTAMP.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Deployment configuration
VERCEL_PROJECT_NAME="dale-kirsten-wedding-rsvp"
PRODUCTION_DOMAIN="daleandkirsten.com"
STAGING_DOMAIN="staging-daleandkirsten.com"
HEALTH_CHECK_URL="https://$PRODUCTION_DOMAIN/api/health"
MAX_HEALTH_CHECKS=5
HEALTH_CHECK_INTERVAL=10

# Function to log messages
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $message" | tee -a "$LOG_FILE"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} $message" | tee -a "$LOG_FILE"
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING]${NC} $message" | tee -a "$LOG_FILE"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message" | tee -a "$LOG_FILE"
            ;;
    esac
}

# Function to check prerequisites
check_prerequisites() {
    log "INFO" "Checking deployment prerequisites..."
    
    # Check if required tools are installed
    local required_tools=("vercel" "npm" "git" "curl" "jq")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log "ERROR" "Required tool '$tool' is not installed"
            exit 1
        fi
    done
    
    # Check if we're in the right directory
    if [[ ! -f "$PROJECT_DIR/package.json" ]]; then
        log "ERROR" "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    # Check if we're on the correct branch
    local current_branch=$(git branch --show-current)
    if [[ "$current_branch" != "main" ]]; then
        log "WARNING" "You're not on the main branch. Current branch: $current_branch"
        read -p "Do you want to continue? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "INFO" "Deployment cancelled by user"
            exit 0
        fi
    fi
    
    # Check if working directory is clean
    if [[ -n $(git status --porcelain) ]]; then
        log "WARNING" "Working directory is not clean"
        git status --short
        read -p "Do you want to continue? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "INFO" "Deployment cancelled by user"
            exit 0
        fi
    fi
    
    log "SUCCESS" "Prerequisites check completed"
}

# Function to run pre-deployment tests
run_pre_deployment_tests() {
    log "INFO" "Running pre-deployment tests..."
    
    cd "$PROJECT_DIR"
    
    # Install dependencies
    log "INFO" "Installing dependencies..."
    npm ci
    
    # Run type checking
    log "INFO" "Running TypeScript type checking..."
    if ! npm run type-check; then
        log "ERROR" "TypeScript type checking failed"
        exit 1
    fi
    
    # Run linting
    log "INFO" "Running ESLint..."
    if ! npm run lint; then
        log "ERROR" "Linting failed"
        exit 1
    fi
    
    # Run unit tests if they exist
    if npm run test --silent 2>/dev/null; then
        log "INFO" "Running unit tests..."
        if ! npm run test; then
            log "ERROR" "Unit tests failed"
            exit 1
        fi
    fi
    
    # Build the project
    log "INFO" "Building the project..."
    if ! npm run build; then
        log "ERROR" "Build failed"
        exit 1
    fi
    
    # Validate environment variables
    log "INFO" "Validating environment configuration..."
    if [[ -f "$PROJECT_DIR/scripts/validate-env.js" ]]; then
        if ! node "$PROJECT_DIR/scripts/validate-env.js"; then
            log "ERROR" "Environment validation failed"
            exit 1
        fi
    fi
    
    log "SUCCESS" "Pre-deployment tests completed"
}

# Function to backup current deployment
backup_current_deployment() {
    log "INFO" "Creating backup of current deployment..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup current Vercel deployment info
    if vercel ls "$VERCEL_PROJECT_NAME" --scope team > /dev/null 2>&1; then
        vercel ls "$VERCEL_PROJECT_NAME" --scope team > "$BACKUP_DIR/current_deployments.txt" 2>/dev/null || true
    fi
    
    # Backup current git commit
    git rev-parse HEAD > "$BACKUP_DIR/current_commit.txt"
    git log -1 --pretty=format:"%H %s %an %ad" > "$BACKUP_DIR/current_commit_info.txt"
    
    # Backup environment variables (excluding secrets)
    if [[ -f "$PROJECT_DIR/.env.production" ]]; then
        grep -v "SECRET\|PASSWORD\|KEY\|TOKEN" "$PROJECT_DIR/.env.production" > "$BACKUP_DIR/env_backup.txt" 2>/dev/null || true
    fi
    
    # Create rollback script
    cat > "$BACKUP_DIR/rollback.sh" << EOF
#!/bin/bash
# Rollback script for deployment $TIMESTAMP

echo "Rolling back to commit: \$(cat "$BACKUP_DIR/current_commit.txt")"
git checkout \$(cat "$BACKUP_DIR/current_commit.txt")

echo "Redeploying previous version..."
vercel --prod --yes

echo "Rollback completed!"
EOF
    chmod +x "$BACKUP_DIR/rollback.sh"
    
    log "SUCCESS" "Backup created at $BACKUP_DIR"
}

# Function to deploy to staging first
deploy_to_staging() {
    log "INFO" "Deploying to staging environment..."
    
    # Deploy to staging
    if ! vercel --yes; then
        log "ERROR" "Staging deployment failed"
        exit 1
    fi
    
    # Get staging URL
    local staging_url=$(vercel ls "$VERCEL_PROJECT_NAME" --scope team | head -n 2 | tail -n 1 | awk '{print $2}')
    
    if [[ -n "$staging_url" ]]; then
        log "INFO" "Staging URL: https://$staging_url"
        
        # Wait for staging to be ready
        sleep 10
        
        # Test staging deployment
        if curl -f "https://$staging_url/api/health" > /dev/null 2>&1; then
            log "SUCCESS" "Staging deployment health check passed"
        else
            log "ERROR" "Staging deployment health check failed"
            exit 1
        fi
    fi
    
    log "SUCCESS" "Staging deployment completed"
}

# Function to deploy to production
deploy_to_production() {
    log "INFO" "Deploying to production..."
    
    # Deploy to production
    if ! vercel --prod --yes; then
        log "ERROR" "Production deployment failed"
        exit 1
    fi
    
    log "SUCCESS" "Production deployment completed"
}

# Function to run post-deployment health checks
run_health_checks() {
    log "INFO" "Running post-deployment health checks..."
    
    local health_check_count=0
    local max_attempts=$MAX_HEALTH_CHECKS
    
    while [[ $health_check_count -lt $max_attempts ]]; do
        log "INFO" "Health check attempt $((health_check_count + 1))/$max_attempts"
        
        if curl -f "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
            log "SUCCESS" "Health check passed"
            break
        else
            log "WARNING" "Health check failed, retrying in $HEALTH_CHECK_INTERVAL seconds..."
            sleep $HEALTH_CHECK_INTERVAL
            ((health_check_count++))
        fi
    done
    
    if [[ $health_check_count -eq $max_attempts ]]; then
        log "ERROR" "All health checks failed. Deployment may have issues."
        return 1
    fi
    
    # Test specific endpoints
    log "INFO" "Testing critical endpoints..."
    
    local critical_endpoints=(
        "/"
        "/api/health"
        "/rsvp?token=test"
    )
    
    for endpoint in "${critical_endpoints[@]}"; do
        local url="https://$PRODUCTION_DOMAIN$endpoint"
        if curl -f "$url" > /dev/null 2>&1; then
            log "SUCCESS" "Endpoint $endpoint is accessible"
        else
            log "ERROR" "Endpoint $endpoint is not accessible"
            return 1
        fi
    done
    
    log "SUCCESS" "All health checks completed successfully"
}

# Function to run smoke tests
run_smoke_tests() {
    log "INFO" "Running smoke tests..."
    
    # Test RSVP form rendering
    local rsvp_test_url="https://$PRODUCTION_DOMAIN/rsvp?token=test-token"
    if curl -s "$rsvp_test_url" | grep -q "form"; then
        log "SUCCESS" "RSVP form renders correctly"
    else
        log "ERROR" "RSVP form is not rendering"
        return 1
    fi
    
    # Test API endpoint
    local api_response=$(curl -s "$HEALTH_CHECK_URL")
    if echo "$api_response" | jq -e '.status == "healthy"' > /dev/null 2>&1; then
        log "SUCCESS" "API health endpoint returns healthy status"
    else
        log "ERROR" "API health endpoint is not healthy"
        return 1
    fi
    
    log "SUCCESS" "Smoke tests completed"
}

# Function to notify stakeholders
notify_deployment_success() {
    log "INFO" "Notifying stakeholders of successful deployment..."
    
    local deployment_info=$(cat << EOF
🎉 Wedding RSVP Deployment Successful!

📅 Timestamp: $(date)
🌐 Domain: https://$PRODUCTION_DOMAIN
📊 Health Status: Healthy
🔗 Admin: https://$PRODUCTION_DOMAIN/admin

✅ All systems operational for Dale & Kirsten's wedding!
EOF
)
    
    # Send to Slack webhook if configured
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$deployment_info\"}" \
            "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 || true
    fi
    
    # Log deployment success
    echo "$deployment_info" | tee -a "$LOG_FILE"
    
    log "SUCCESS" "Deployment notification sent"
}

# Function to handle deployment failure
handle_deployment_failure() {
    log "ERROR" "Deployment failed! Initiating rollback..."
    
    # Run rollback if backup exists
    if [[ -f "$BACKUP_DIR/rollback.sh" ]]; then
        log "INFO" "Running automatic rollback..."
        bash "$BACKUP_DIR/rollback.sh"
    fi
    
    # Notify of failure
    local failure_info="🚨 Wedding RSVP Deployment Failed! Manual intervention required. Check logs: $LOG_FILE"
    
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$failure_info\"}" \
            "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 || true
    fi
    
    log "ERROR" "Deployment failed. Check logs for details: $LOG_FILE"
    exit 1
}

# Main deployment function
main() {
    log "INFO" "Starting deployment process for Dale & Kirsten's Wedding RSVP..."
    log "INFO" "Timestamp: $TIMESTAMP"
    
    # Set up error handling
    trap handle_deployment_failure ERR
    
    # Run deployment steps
    check_prerequisites
    run_pre_deployment_tests
    backup_current_deployment
    deploy_to_staging
    
    # Confirmation before production
    echo
    log "WARNING" "Ready to deploy to production. This will make changes live!"
    read -p "Continue with production deployment? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "INFO" "Production deployment cancelled by user"
        exit 0
    fi
    
    deploy_to_production
    
    # Post-deployment validation
    if run_health_checks && run_smoke_tests; then
        notify_deployment_success
        log "SUCCESS" "🎉 Deployment completed successfully!"
        log "INFO" "Website is ready for Dale & Kirsten's wedding: https://$PRODUCTION_DOMAIN"
    else
        log "ERROR" "Post-deployment validation failed"
        handle_deployment_failure
    fi
    
    # Cleanup
    log "INFO" "Deployment logs saved to: $LOG_FILE"
    log "INFO" "Backup created at: $BACKUP_DIR"
    
    echo
    echo "🎊 Dale & Kirsten's Wedding RSVP is now live! 🎊"
    echo "🌐 https://$PRODUCTION_DOMAIN"
    echo "📊 Monitor at: https://$PRODUCTION_DOMAIN/api/health"
}

# Run the deployment
main "$@"