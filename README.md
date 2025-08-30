# CVision API

A TypeScript-based REST API built with Nest.js for AI-powered career guidance application. Provides backend services for user management, CV processing, and career roadmap generation.

## Tech Stack

- **Framework**: Nest.js with TypeScript
- **Database**: PostgreSQL (Neon) with Prisma ORM  
- **Authentication**: Firebase Auth (ID token validation)
- **Deployment**: Render.com
- **API Documentation**: Postman collection included

## Architecture

```
src/
├── auth/                    # Firebase authentication & guards
├── users/                   # User profile management
├── common/
│   ├── decorators/          # Custom decorators (@Public, @CurrentUser)
│   ├── filters/             # Global exception handling
│   └── interceptors/        # Response transformation
├── config/                  # Environment configuration
├── prisma/                  # Database service
└── health/                  # Health check endpoints
```

## Database Schema (MVP)

```sql
User          # Basic profile, Firebase integration
├── CV        # Document storage and processing
├── UserSkill # Skill tracking with levels
└── CareerRoadmap
    └── RoadmapItem  # Roadmap steps and milestones
```

## Authentication Flow

1. **Client** → Firebase ID token in `Authorization: Bearer <token>`
2. **API** → Validates token with Firebase Admin SDK
3. **Database** → Creates/updates user record automatically
4. **Request** → User data attached to request context via `@CurrentUser()` decorator

## API Endpoints

### Public Endpoints
- `GET /api/health` - System health check

### Protected Endpoints (Firebase Auth Required)
- `GET /api/users/profile` - Get user profile with skills & roadmaps
- `PUT /api/users/profile` - Update user profile  
- `GET /api/users/onboarding` - Check onboarding completion status
- `POST /api/users/onboarding/complete` - Mark onboarding as finished
- `GET /api/users/stats` - User activity statistics

## Response Format

All endpoints return consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response payload
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE", 
    "statusCode": 400
  }
}
```

## Environment Configuration

### Development
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@neon-db/cvision_dev
FIREBASE_PROJECT_ID=cvision-dev
```

### Production  
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@neon-db/cvision_prod
FIREBASE_PROJECT_ID=cvision-prod
```

## Installation & Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.development.example .env.development
# Configure Firebase credentials

# Run database migration
npx prisma migrate dev --name init

# Start development server
npm run start:dev
```

## Testing

Postman collection included in `/postman/` directory:
- Import `CVision-API.postman_collection.json`
- Import environment files for dev/prod
- Configure Firebase token in environment variables

## Key Features

## Project Structure

```
CVision/
├── src/
│   ├── auth/                # Firebase authentication
│   ├── users/               # User management endpoints  
│   ├── common/              # Shared decorators, filters, interceptors
│   ├── prisma/              # Database service
│   └── health/              # Health check endpoints
├── prisma/
│   └── schema.prisma        # Database schema
├── postman/                 # API documentation & testing
└── uploads/                 # Local file storage
    ├── profileImages/       # User profile pictures
    └── CVs/                 # CV documents
```

## Development

```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod
```

## Database

```bash
# Generate Prisma client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name migration_name

# Reset database (dev only)
npx prisma migrate reset
```

---

**API Version**: MVP v1.0  
**Framework**: Nest.js 10.x  
**Node.js**: >= 18.x  
**Database**: PostgreSQL with Prisma ORM

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
