# Services Architecture

This directory contains all API service modules that handle communication between the frontend and backend. The services follow best practices for code organization, error handling, and reusability.

## Structure

```
services/
├── index.js              # Main export point for all services
├── api.js               # Generic API request handler and configuration
├── authService.js       # Authentication-related API calls
├── tokenService.js      # Token storage and management
└── userService.js       # User profile and user data API calls
```

## Modules

### `api.js`
Central API configuration and request handler.

**Exports:**
- `apiRequest(endpoint, options)` - Generic fetch wrapper with error handling
- `API_BASE_URL` - Base URL for all API calls

**Usage:**
```javascript
import { apiRequest } from '../services';

const data = await apiRequest('/endpoint', {
  method: 'GET',
  headers: { /* custom headers */ }
});
```

### `authService.js`
Handles all authentication-related operations.

**Exports:**
- `registerUser(userData)` - Register new user
- `loginUser(emailOrUsername, password)` - Login user
- `checkUsername(username)` - Check username availability
- `checkEmail(email)` - Check email availability
- `verifyToken(token)` - Verify JWT token validity

**Usage:**
```javascript
import { loginUser, registerUser } from '../services';

// Login
const result = await loginUser('user@example.com', 'password123');

// Register
const newUser = await registerUser({
  email: 'new@example.com',
  username: 'newuser',
  password: 'SecurePass123!',
  gender: 'male'
});
```

### `tokenService.js`
Manages JWT token storage and retrieval.

**Exports:**
- `setToken(token)` - Store token in localStorage
- `getToken()` - Retrieve token from localStorage
- `removeToken()` - Delete token from localStorage
- `isAuthenticated()` - Check if user is authenticated
- `logout()` - Clear all authentication data

**Usage:**
```javascript
import { getToken, setToken, isAuthenticated, logout } from '../services';

// Store token
setToken(jwtToken);

// Check authentication
if (isAuthenticated()) {
  // User is logged in
}

// Logout
logout();
```

### `userService.js`
Handles user profile and user-related data operations.

**Exports:**
- `getCurrentUser()` - Fetch current user profile
- `updateUserProfile(userData)` - Update user profile
- `getUserByUsername(username)` - Fetch public user profile

**Usage:**
```javascript
import { getCurrentUser, updateUserProfile } from '../services';

// Get user profile
const profile = await getCurrentUser();

// Update profile
const updated = await updateUserProfile({
  bio: 'New bio here',
  avatar: 'avatar-url'
});
```

### `index.js`
Central export point for all services, simplifying imports.

**Usage:**
```javascript
// Instead of importing from individual files:
import { loginUser } from '../services/authService';
import { getToken } from '../services/tokenService';

// You can now do:
import { loginUser, getToken } from '../services';
```

## Error Handling

All services implement consistent error handling:

```javascript
try {
  const result = await loginUser(email, password);
} catch (error) {
  console.error(error.message);
  // error.status contains HTTP status code
  // error.data contains error response data
}
```

## Best Practices Applied

1. **Separation of Concerns** - Each service handles a specific domain
2. **Centralized Configuration** - API base URL and settings in one place
3. **Reusable API Handler** - `apiRequest()` reduces code duplication
4. **Error Propagation** - Meaningful error messages and status codes
5. **Token Management** - Secure token storage and retrieval
6. **JSDoc Documentation** - Clear function documentation and usage
7. **Consistent Naming** - Clear and descriptive function names
8. **Async/Await Pattern** - Modern JavaScript async patterns

## Configuration

API settings can be configured via environment variables:

```bash
# .env
REACT_APP_API_URL=http://localhost:5000/api
```

If not set, defaults to `http://localhost:5000/api`

## Adding New Services

To add a new service:

1. Create a new file (e.g., `postService.js`)
2. Import `apiRequest` from `api.js`
3. Define functions following the pattern
4. Export functions from `index.js`

Example:
```javascript
// postService.js
import { apiRequest } from './api';
import { getToken } from './tokenService';

export const getPosts = async () => {
  return await apiRequest('/posts', { method: 'GET' });
};

export const createPost = async (postData) => {
  const token = getToken();
  return await apiRequest('/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(postData),
  });
};
```

Then add to `index.js`:
```javascript
export * from './postService';
```

## Security Considerations

- Tokens are stored in localStorage (consider upgrading to httpOnly cookies for production)
- All authenticated requests include Authorization header
- Token verification on protected routes
- Error messages don't expose sensitive information
