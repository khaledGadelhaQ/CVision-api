# CVision API - Nest.js Project

This project is a Nest.js API designed for AI model integration and Flutter app communication.

## Project Structure
- `src/common/filters/` - Global exception filters
- `src/common/interceptors/` - Response interceptors  
- `src/common/interfaces/` - TypeScript interfaces
- `src/health/` - Health check module

## Key Features
- Global exception handling with consistent error responses
- Request validation using ValidationPipe
- Standardized response format for Flutter app integration
- Health check endpoints for system monitoring
- CORS enabled for cross-origin requests

## Development
- Uses npm for package management
- TypeScript configuration optimized for Nest.js
- Development server runs on http://localhost:3000/api
- Health check available at /api/health
