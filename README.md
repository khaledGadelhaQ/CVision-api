# CVision API

A Nest.js API designed for AI model integration and Flutter app communication.

## Features

- ✅ **Environment Configuration**: Separate dev/prod configurations using @nestjs/config
- ✅ **Global Exception Handling**: Environment-aware error responses
- ✅ **Global Validation**: Request validation with class-validator
- ✅ **Consistent Response Format**: Standardized API responses for Flutter app integration
- ✅ **Health Check Endpoints**: Environment-aware system health monitoring
- ✅ **CORS Enabled**: Ready for Flutter app communication
- ✅ **TypeScript**: Full TypeScript support with proper typing

## Environment Configuration

The application uses different configuration files based on the environment:

- **Development**: `.env.development`
- **Production**: `.env.production`
- **Fallback**: `.env`

### Environment Variables

| Variable | Description | Dev Default | Prod Default |
|----------|-------------|-------------|--------------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `PORT` | Server port | `3000` | `3000` |
| `LOG_LEVEL` | Logging level | `debug` | `error` |
| `ENABLE_REQUEST_LOGGING` | Request logging | `true` | `false` |
| `JWT_SECRET` | JWT secret key | dev-secret | secure-prod-secret |
| `AI_MODEL_API_URL` | AI service URL | localhost:8000 | prod-ai-url |

## API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Environment-aware detailed system information

### Test Endpoints (Development only)
- `GET /api/test/error/400` - Bad Request error
- `GET /api/test/error/404` - Not Found error  
- `GET /api/test/error/500` - Internal Server error
- `GET /api/test/error/custom` - Custom error with details

## Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Request successful",
  "data": {},
  "timestamp": "2025-08-22T04:35:47.000Z",
  "path": "/api/health"
}
```

### Error Response (Development)
```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Detailed error message",
  "stack": "Error stack trace...",
  "details": {},
  "environment": "development",
  "requestId": "req_1692692147000_abc123def",
  "timestamp": "2025-08-22T04:35:47.000Z",
  "path": "/api/test/error/500"
}
```

### Error Response (Production)
```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Internal server error",
  "requestId": "req_1692692147000_abc123def",
  "timestamp": "2025-08-22T04:35:47.000Z",
  "path": "/api/endpoint"
}
```

## Installation

```bash
npm install
```

## Running the app

```bash
# development mode
npm run start:dev

# debug mode  
npm run start:debug

# production mode (after build)
npm run build
npm run start:prod

# production mode with development config
npm run start:prod:dev
```

## Development

The application is structured with:

- `src/config/` - Environment configuration management
- `src/common/filters/` - Environment-aware global exception filters
- `src/common/interceptors/` - Response interceptors
- `src/common/interfaces/` - TypeScript interfaces
- `src/health/` - Health check module
- `src/test/` - Test endpoints (development only)

## Architecture

This API is designed to work as a bridge between:
1. **AI Models** - For processing and inference
2. **Flutter App** - Mobile/web client application

The environment-aware configuration ensures:
- **Development**: Detailed error messages, full stack traces, system information
- **Production**: Secure error messages, minimal information disclosure, enhanced logging
