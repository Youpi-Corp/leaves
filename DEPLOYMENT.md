# Deployment Setup

This document explains the deployment setup for the Brainforest frontend application.

## Overview

The application has two deployment environments running on the same VM:

- **Production**: `https://brain-forest.works` (deploys from `main` branch)
- **Development**: `https://dev.brain-forest.works` (deploys from `dev` branch)

## Deployment Workflows

### 1. Production Deployment (`deploy.yml`)

- **Trigger**: Push to `main` branch
- **URL**: https://brain-forest.works
- **Directory**: `/var/www/brainforest`
- **Process**:
  1. Run tests and linting
  2. Build application with production API URL
  3. Deploy to VM via SSH
  4. Configure Nginx with SSL certificates
  5. Verify deployment

### 2. Development Deployment (`deploy-dev.yml`)

- **Trigger**: Push to `dev` branch
- **URL**: https://dev.brain-forest.works
- **Directory**: `/var/www/brainforest-dev`
- **Process**:
  1. Run tests and linting
  2. Build application with development API URL
  3. Deploy to VM via SSH
  4. Configure Nginx for dev subdomain
  5. Verify deployment

### 3. PR Testing (`build.yml`)

- **Trigger**: Pull requests to `dev` or `main` branches
- **Purpose**: Run tests and builds across multiple Node.js versions
- **Does not deploy**

## Required Secrets

The following GitHub secrets need to be configured:

### Production Environment

- `PRODUCTION_HOST`: VM hostname/IP
- `PRODUCTION_USERNAME`: SSH username for VM
- `SSH_PRIVATE_KEY`: SSH private key for VM access
- `BASE_API_URL`: Production API base URL

### Development Environment

- `DEV_HOST`: Development VM hostname/IP (can be same as production)
- `DEV_USERNAME`: SSH username for development VM
- `DEV_SSH_PRIVATE_KEY`: SSH private key for development VM access
- `DEV_API_BASE_URL`: Development API base URL

## VM Configuration

Both deployments use the same VM with different Nginx configurations:

### Production Site (`/etc/nginx/sites-available/brainforest`)

```nginx
server {
    listen 443 ssl;
    server_name brain-forest.works www.brain-forest.works;
    root /var/www/brainforest;
    # ... SSL and other configurations
}
```

### Development Site (`/etc/nginx/sites-available/brainforest-dev`)

```nginx
server {
    listen 443 ssl;
    server_name dev.brain-forest.works;
    root /var/www/brainforest-dev;
    # ... SSL and other configurations
    # Additional dev-specific headers
}
```

## SSL Certificates

Both sites use Let's Encrypt certificates managed by Certbot:

- Production: `brain-forest.works` and `www.brain-forest.works`
- Development: `dev.brain-forest.works`

## DNS Configuration Required

To use the development deployment, you'll need to configure DNS:

1. Add an A record for `dev.brain-forest.works` pointing to your VM's IP address
2. The deployment workflow will automatically attempt to obtain SSL certificates

## Branch Strategy

- `main` branch: Stable production code
- `dev` branch: Development code that gets deployed to dev environment
- Feature branches: Create PRs to `dev` for testing before merging

## Monitoring

Both deployments include verification steps that check:

- Nginx service status
- File deployment success
- HTTP/HTTPS response codes
- SSL certificate status

## Rollback Strategy

If a deployment fails:

1. Check the GitHub Actions logs for errors
2. Previous deployments remain in place until new ones succeed
3. Manual rollback can be done by re-running a previous successful workflow

## Development Workflow

1. Create feature branch from `dev`
2. Make changes and push (triggers PR testing)
3. Create PR to `dev` branch
4. Merge PR (triggers dev deployment)
5. Test on `https://dev.brain-forest.works`
6. When ready, create PR from `dev` to `main`
7. Merge to `main` (triggers production deployment)
