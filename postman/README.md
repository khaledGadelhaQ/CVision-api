# CVision API - Postman Collection

This folder contains the complete Postman collection for the CVision API with organized endpoints, environments, and comprehensive examples.

## 📁 Files Structure

```
postman/
├── CVision-API.postman_collection.json     # Main API collection
├── Development.postman_environment.json    # Development environment
├── Production.postman_environment.json     # Production environment
└── README.md                               # This documentation
```

## 🚀 Quick Setup

### 1. Import Collection & Environments
1. Open Postman
2. Click **Import** → **Files**
3. Import all JSON files from this folder:
   - `CVision-API.postman_collection.json`
   - `Development.postman_environment.json`
   - `Production.postman_environment.json`

### 2. Set Environment
- Select **CVision API - Development** for local testing
- Select **CVision API - Production** for production testing

### 3. Configure Firebase Token
1. Get Firebase ID token from your app or Firebase console
2. In Postman, go to **Environments** → Select your environment
3. Set the `firebase_token` variable with your token
4. **Important**: Never commit real production tokens!

## 📚 Collection Organization

### 🏥 Health Check
**Folder**: `Health Check`
- **GET** `/api/health` - Check API health status
- **Public endpoint** - No authentication required

### 👤 User Management  
**Folder**: `User Management`
- **GET** `/api/users/profile` - Get user profile
- **PUT** `/api/users/profile` - Update user profile
- **GET** `/api/users/onboarding` - Get onboarding status
- **POST** `/api/users/onboarding/complete` - Complete onboarding
- **GET** `/api/users/stats` - Get user statistics

## 🔐 Authentication

### Firebase Authentication
Most endpoints require Firebase ID tokens:

```
Authorization: Bearer <firebase_id_token>
```

### Getting Firebase Tokens

**For Development:**
```javascript
// In your Firebase app
firebase.auth().currentUser.getIdToken(true)
  .then(token => console.log(token));
```

**For Testing:**
1. Use Firebase Console → Authentication → Users
2. Or use Firebase CLI: `firebase auth:test`

## 🌍 Environments

### Development Environment
- **Base URL**: `http://localhost:3000`
- **API Prefix**: `api`
- **Purpose**: Local development and testing

### Production Environment  
- **Base URL**: `https://cvision-api.onrender.com`
- **API Prefix**: `api`
- **Purpose**: Production deployment testing

## 📝 Example Requests

### 1. Health Check (Public)
```http
GET http://localhost:3000/api/health
```

### 2. Get User Profile (Authenticated)
```http
GET http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

### 3. Update Profile (Authenticated)
```http
PUT http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "university": "MIT",
  "major": "Computer Science",
  "careerGoals": "Become a senior full-stack developer"
}
```

## 🧪 Response Examples

### Success Response Format
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response Format
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

## 🔍 Testing Features

### Pre-request Scripts
- Automatic timestamp setting
- Environment validation

### Test Scripts
- Response time validation (< 2000ms)
- Standard response structure validation
- Status code verification

### Global Variables
- `request_timestamp` - Set automatically
- `collection_version` - Collection version tracking

## 📋 Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200  | OK | Request successful |
| 400  | Bad Request | Invalid request data |
| 401  | Unauthorized | Missing/invalid authentication |
| 404  | Not Found | Resource not found |
| 500  | Internal Server Error | Server error |
| 503  | Service Unavailable | Service down (e.g., database) |

## 🛡️ Security Notes

### Development
- Use test Firebase projects
- Test tokens can be shared in team
- Local environment is safe for testing

### Production
- **Never commit real Firebase tokens**
- Use environment variables
- Rotate tokens regularly
- Monitor API usage

## 🚨 Common Issues

### 1. 401 Unauthorized
- Check Firebase token is set in environment
- Ensure token is not expired (1 hour default)
- Verify token format: `Bearer <token>`

### 2. 503 Service Unavailable  
- Check if API server is running
- Verify database connection
- Check health endpoint first

### 3. CORS Issues
- Only affects browser requests
- API has CORS enabled for development

## 📞 Support

For API issues:
1. Check health endpoint first
2. Verify authentication setup
3. Review error response details
4. Check server logs in development

---

**Collection Version**: 1.0.0  
**Last Updated**: August 30, 2025  
**API Version**: Development MVP
