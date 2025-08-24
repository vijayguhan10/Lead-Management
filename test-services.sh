#!/bin/bash

# Script to test all microservices for HTTP driver errors
# This script starts each service for 5 seconds to check for startup errors

SERVICES=(
    "auth-service"
    "user-service" 
    "lead-service"
    "call-service"
    "notification-service"
    "media-service"
    "Telecaller-service"
)

echo "Testing all NestJS microservices for HTTP driver errors..."
echo "============================================================"

for service in "${SERVICES[@]}"; do
    echo "Testing $service..."
    cd "/home/runner/work/Lead-Management/Lead-Management/Microservices/$service"
    
    # Start the service and capture output for 5 seconds
    timeout 5s npm run start 2>&1 | tee "/tmp/$service-test.log"
    
    # Check if HTTP driver error appears in the logs
    if grep -q "No driver (HTTP) has been selected" "/tmp/$service-test.log"; then
        echo "❌ ERROR: $service has HTTP driver error!"
        echo "   Install @nestjs/platform-express: npm install @nestjs/platform-express"
    elif grep -q "Starting Nest application" "/tmp/$service-test.log"; then
        echo "✅ SUCCESS: $service started without HTTP driver error"
    else
        echo "⚠️  WARNING: $service may have other startup issues"
    fi
    
    echo "---"
done

echo "Testing complete!"
echo "Note: Services that connect to databases may timeout but should not show HTTP driver errors."