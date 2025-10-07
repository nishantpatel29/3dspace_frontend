# Frontend API Integration

This directory contains all the API integration files for connecting your React frontend to the DesignSpace 3D backend.

## Files Overview

- **`auth.jsx`** - Authentication API functions and React hooks
- **`projects.jsx`** - Project management API functions
- **`designs.jsx`** - Design management API functions
- **`furniture.jsx`** - Furniture catalog API functions
- **`templates.jsx`** - Template management API functions
- **`aiTools.jsx`** - AI tools API functions
- **`subscriptions.jsx`** - Subscription management API functions
- **`export.jsx`** - Export functionality API functions
- **`upload.jsx`** - File upload API functions
- **`index.jsx`** - Main export file for all APIs

## Quick Start

### 1. Install Dependencies

Make sure you have axios installed:

```bash
npm install axios
```

### 2. Environment Variables

Create a `.env` file in your frontend root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Basic Usage

```jsx
import { authAPI, projectsAPI, designsAPI } from './apis';

// Authentication
const loginResult = await authAPI.login({
  email: 'user@example.com',
  password: 'password123'
});

// Projects
const projects = await projectsAPI.getProjects();

// Designs
const designs = await designsAPI.getDesigns();
```

## Authentication API

### Features

- User registration and login
- JWT token management with automatic refresh
- Password reset functionality
- Profile management
- Email verification
- React hooks for easy integration

### Usage Examples

#### Using the useAuth Hook

```jsx
import { useAuth } from './apis/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (result.success) {
      console.log('Login successful!');
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.firstName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

#### Direct API Usage

```jsx
import { authAPI } from './apis/auth';

// Register user
const registerResult = await authAPI.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  agreeToTerms: true
});

// Login user
const loginResult = await authAPI.login({
  email: 'john@example.com',
  password: 'password123'
});

// Check authentication
if (authAPI.isAuthenticated()) {
  const user = authAPI.getStoredUser();
  console.log('Current user:', user);
}
```

## Projects API

### Usage Examples

```jsx
import { projectsAPI } from './apis/projects';

// Get user's projects
const projects = await projectsAPI.getProjects({
  page: 1,
  limit: 10,
  search: 'living room'
});

// Create new project
const newProject = await projectsAPI.createProject({
  name: 'My Living Room',
  description: 'A cozy living room design',
  tags: ['modern', 'cozy']
});

// Update project
const updatedProject = await projectsAPI.updateProject(projectId, {
  name: 'Updated Project Name'
});
```

## Designs API

### Usage Examples

```jsx
import { designsAPI } from './apis/designs';

// Get designs for a project
const designs = await designsAPI.getDesigns({
  projectId: 'project123'
});

// Create new design
const newDesign = await designsAPI.createDesign({
  projectId: 'project123',
  name: 'Living Room Design',
  elements: [...],
  furniture: [...]
});

// Save design state (auto-save)
const saveResult = await designsAPI.saveDesignState(designId, {
  elements: currentElements,
  furniture: currentFurniture,
  camera: cameraPosition
});
```

## Furniture API

### Usage Examples

```jsx
import { furnitureAPI } from './apis/furniture';

// Get furniture catalog
const furniture = await furnitureAPI.getFurniture({
  category: 'seating',
  minPrice: 100,
  maxPrice: 1000
});

// Search furniture
const searchResults = await furnitureAPI.searchFurniture('sofa');

// Get featured furniture
const featured = await furnitureAPI.getFeaturedFurniture(10);
```

## Templates API

### Usage Examples

```jsx
import { templatesAPI } from './apis/templates';

// Get templates
const templates = await templatesAPI.getTemplates({
  category: 'living-room',
  style: 'modern'
});

// Use template
const newDesign = await templatesAPI.useTemplate(templateId, {
  projectId: 'project123',
  name: 'My Design from Template'
});
```

## AI Tools API

### Usage Examples

```jsx
import { aiToolsAPI } from './apis/aiTools';

// Smart wizard
const layout = await aiToolsAPI.smartWizard({
  roomType: 'living-room',
  dimensions: { width: 4, height: 3, depth: 5 },
  preferences: ['modern', 'cozy']
});

// Design generator
const suggestions = await aiToolsAPI.designGenerator({
  currentDesign: designData,
  style: 'modern'
});
```

## File Upload API

### Usage Examples

```jsx
import { uploadAPI } from './apis/upload';

// Upload image
const uploadResult = await uploadAPI.uploadImage(file, {
  folder: 'designs',
  onProgress: (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
});

// Upload 3D model
const modelResult = await uploadAPI.uploadModel(file, {
  folder: 'models'
});
```

## Error Handling

All API functions return a consistent response format:

```jsx
{
  success: boolean,
  data?: any,
  message?: string,
  errors?: array
}
```

### Example Error Handling

```jsx
const result = await authAPI.login(credentials);

if (result.success) {
  // Handle success
  console.log('Login successful:', result.data);
} else {
  // Handle error
  console.error('Login failed:', result.message);
  if (result.errors) {
    result.errors.forEach(error => {
      console.error('Validation error:', error.msg);
    });
  }
}
```

## Authentication Flow

1. **Login/Register** - User provides credentials
2. **Token Storage** - JWT tokens are stored in localStorage
3. **Automatic Refresh** - Tokens are automatically refreshed when needed
4. **Request Interceptor** - Auth token is automatically added to requests
5. **Response Interceptor** - Handles token refresh and logout on 401 errors

## Subscription Management

```jsx
import { subscriptionsAPI } from './apis/subscriptions';

// Check subscription status
const subscription = await subscriptionsAPI.getCurrentSubscription();

// Upgrade subscription
const upgradeResult = await subscriptionsAPI.upgradeSubscription({
  planId: 'pro',
  paymentMethodId: 'pm_123'
});
```

## Export Functionality

```jsx
import { exportAPI } from './apis/export';

// Export as GLTF
const gltfResult = await exportAPI.exportGLTF(designId, {
  format: 'glb',
  includeTextures: true
});

// Export as image
const imageResult = await exportAPI.exportImage(designId, {
  resolution: '4K',
  format: 'png'
});
```

## Best Practices

1. **Always handle errors** - Check the `success` field in API responses
2. **Use the useAuth hook** - For authentication state management
3. **Implement loading states** - Show loading indicators during API calls
4. **Validate forms** - Use the provided validation functions
5. **Handle token expiration** - The API automatically handles token refresh
6. **Use TypeScript** - Consider adding type definitions for better development experience

## Environment Configuration

Make sure your backend is running on the correct port and your frontend environment variables are set:

```env
# Frontend .env
REACT_APP_API_URL=http://localhost:5000/api

# Backend .env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## Troubleshooting

### Common Issues

1. **CORS Errors** - Make sure your backend CORS configuration includes your frontend URL
2. **Token Issues** - Check that JWT_SECRET is set in your backend environment
3. **Network Errors** - Verify that your backend is running and accessible
4. **Validation Errors** - Check that your form data matches the expected format

### Debug Mode

Enable debug logging by setting:

```env
REACT_APP_DEBUG=true
```

This will log all API requests and responses to the console.

## Contributing

When adding new API functions:

1. Follow the existing naming conventions
2. Include proper error handling
3. Add JSDoc comments for better documentation
4. Update this README with usage examples
5. Test with the actual backend endpoints

