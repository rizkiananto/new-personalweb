# Fix for Missing Authorization Header in Production

## Problem
The authorization header is present in local development but missing entirely in production VPS, even when environment variables are properly set in the `.env` file.

## Root Cause
Next.js applications using the `standalone` output mode require `NEXT_PUBLIC_*` environment variables to be available at **build time**, not just runtime. In Docker builds, these variables need to be passed as build arguments to be embedded into the application bundle.

## Solution

### 1. Updated Dockerfile
Added build arguments for environment variables:

```dockerfile
# Build arguments for environment variables
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_KEY

# Set environment variables for build
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_KEY=$NEXT_PUBLIC_API_KEY
```

### 2. Updated Docker Compose
Added build arguments to pass environment variables during build:

```yaml
web-prod:
  build:
    context: .
    dockerfile: Dockerfile
    target: runner
    args:
      NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL:-https://your-subdomain.your-domain.com}
      NEXT_PUBLIC_API_KEY: ${NEXT_PUBLIC_API_KEY:-}
```

### 3. Enhanced API Configuration
Added debugging and better error handling to `getApiHeaders()` function:

```typescript
// Debug logging to help diagnose environment variable issues
if (process.env.NODE_ENV !== 'production') {
  console.log('🔧 API Debug Info:', {
    hasProvidedToken: !!authToken,
    hasEnvToken: !!process.env.NEXT_PUBLIC_API_KEY,
    envToken: process.env.NEXT_PUBLIC_API_KEY ? `${process.env.NEXT_PUBLIC_API_KEY.substring(0, 10)}...` : 'undefined',
    finalToken: token ? `${token.substring(0, 10)}...` : 'undefined'
  });
}
```

### 4. Environment Verification Script
Created `scripts/verify-env.sh` to help diagnose environment variable issues in production:

- Checks if `.env` file exists and is properly configured
- Verifies environment variables are available in Docker container
- Tests API endpoint with authentication
- Provides troubleshooting tips

### 5. Updated Deployment Process
Enhanced deployment script to include environment verification steps.

## Deployment Instructions

### For VPS Deployment:

1. **Update your VPS environment**:
   ```bash
   cd /opt/personalweb
   git pull origin main
   ```

2. **Ensure `.env` file is properly configured**:
   ```bash
   # Copy and update the production environment template
   cp .env.production .env
   nano .env
   ```

3. **Rebuild and redeploy with build arguments**:
   ```bash
   # Stop current container
   docker compose --profile prod down
   
   # Rebuild with build arguments (this is crucial!)
   docker compose --profile prod build --no-cache
   
   # Start the new container
   docker compose --profile prod up -d
   ```

4. **Verify the fix**:
   ```bash
   # Run the verification script
   ./scripts/verify-env.sh
   
   # Check container logs
   docker compose --profile prod logs
   ```

### Verification Steps:

1. **Check environment variables in container**:
   ```bash
   docker compose --profile prod exec web-prod printenv | grep NEXT_PUBLIC
   ```

2. **Test API endpoint**:
   ```bash
   curl -X POST https://your-subdomain.com/api/v1/match-job \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer your-api-key" \
        -d '{"job_opportunity":"test","email":"test@example.com"}'
   ```

3. **Check browser network tab**:
   - Open browser developer tools
   - Navigate to Network tab
   - Make an API request through your application
   - Verify that `Authorization: Bearer your-api-key` header is present

## Key Points

1. **Build-time vs Runtime**: `NEXT_PUBLIC_*` variables must be available during Docker build, not just when the container runs.

2. **Build Arguments**: Docker build arguments are necessary to pass environment variables into the build context.

3. **No-cache Build**: When changing environment variables, use `--no-cache` to ensure a fresh build.

4. **Environment File**: Ensure your VPS has a properly configured `.env` file with actual values (not placeholders).

## Troubleshooting

If the authorization header is still missing:

1. **Check build logs**:
   ```bash
   docker compose --profile prod build --no-cache
   ```

2. **Verify environment variables**:
   ```bash
   ./scripts/verify-env.sh
   ```

3. **Check if variables are embedded in build**:
   ```bash
   docker compose --profile prod exec web-prod printenv | grep NEXT_PUBLIC
   ```

4. **Common issues**:
   - `.env` file not present or has placeholder values
   - Container wasn't rebuilt after environment changes
   - Build arguments not properly passed in docker-compose.yml
   - Environment variables contain special characters that need escaping

## Files Modified

- `Dockerfile`: Added build arguments for environment variables
- `docker-compose.yml`: Added build args to production service
- `src/lib/api-config.ts`: Enhanced debugging and error handling
- `.env.production`: Template for production environment
- `scripts/verify-env.sh`: New verification script
- `scripts/subdomain-deploy.sh`: Enhanced with verification steps