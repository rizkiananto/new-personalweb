#!/bin/bash

# Load environment variables from .env.production
source .env.production

# Build Docker image with build arguments
docker buildx build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL" \
  -t ghcr.io/rizkiananto/new-personalweb:latest \
  .
