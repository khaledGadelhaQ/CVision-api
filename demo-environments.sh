#!/bin/bash

echo "🔧 CVision API Environment Configuration Demo"
echo "=============================================="
echo ""

echo "📋 Available environment files:"
ls -la .env*

echo ""
echo "🧪 Testing Development Environment:"
echo "-----------------------------------"
echo "Starting server in development mode..."

# Kill any existing processes on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start in development mode in background
NODE_ENV=development npm run start:prod:dev &
DEV_PID=$!

# Wait for server to start
sleep 3

echo "Testing development error response:"
echo "GET http://localhost:3000/api/test/error/500"
curl -s http://localhost:3000/api/test/error/500 | jq '.'

echo ""
echo "Testing development health check:"
echo "GET http://localhost:3000/api/health/detailed"
curl -s http://localhost:3000/api/health/detailed | jq '.system.memory, .environment_variables'

# Kill development server
kill $DEV_PID 2>/dev/null || true
sleep 2

echo ""
echo "🏭 Testing Production Environment:"
echo "---------------------------------"
echo "Starting server in production mode..."

# Start in production mode in background  
NODE_ENV=production npm run start:prod &
PROD_PID=$!

# Wait for server to start
sleep 3

echo "Testing production error response:"
echo "GET http://localhost:3000/api/test/error/500"
curl -s http://localhost:3000/api/test/error/500 | jq '.'

echo ""
echo "Testing production health check:"
echo "GET http://localhost:3000/api/health/detailed"
curl -s http://localhost:3000/api/health/detailed | jq '.services, .configuration'

# Kill production server
kill $PROD_PID 2>/dev/null || true

echo ""
echo "✅ Demo completed!"
echo "📝 Notice the differences in:"
echo "   - Error message detail level"
echo "   - Stack trace inclusion"
echo "   - System information exposure"
echo "   - Environment-specific configuration"
