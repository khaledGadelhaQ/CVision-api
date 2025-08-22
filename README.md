# CVision API

A Nest.js API designed for AI model integration and Flutter app communication.

## Features

- ✅ **Global Exception Handling**: Comprehensive error handling with consistent response format
- ✅ **Global Validation**: Request validation with class-validator
- ✅ **Consistent Response Format**: Standardized API responses for Flutter app integration
- ✅ **Health Check Endpoints**: System health monitoring
- ✅ **CORS Enabled**: Ready for Flutter app communication
- ✅ **TypeScript**: Full TypeScript support with proper typing

## API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system information

## Response Format

All API responses follow this consistent format:

```json
{
  "status": "success" | "error",
  "statusCode": 200,
  "message": "Request successful",
  "data": {}, // Response data
  "timestamp": "2025-08-22T10:30:00.000Z",
  "path": "/api/health"
}
```

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Development

The application is structured with:

- `src/common/filters/` - Global exception filters
- `src/common/interceptors/` - Response interceptors
- `src/common/interfaces/` - TypeScript interfaces
- `src/health/` - Health check module

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)

## Architecture

This API is designed to work as a bridge between:
1. **AI Models** - For processing and inference
2. **Flutter App** - Mobile/web client application

The consistent response format ensures smooth integration with Flutter applications while maintaining robust error handling and validation.
