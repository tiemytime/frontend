# API Services Documentation

This directory contains all API services for backend integration with a clean, scalable architecture following best practices.

## 📁 Structure

```
src/services/
├── api.js              # Base HTTP client and core API functionality
├── prayerAPI.js        # Prayer-specific API endpoints
├── authAPI.js          # Authentication API endpoints
├── newsAPI.js ### Service Health Check

Check if API services are available:

```javascript
import { checkServiceHealth } from './services';

const serviceStatus = await checkServiceHealth();
console.log(serviceStatus);
// {
//   prayer: true,
//   news: true,
//   events: true,    // NEW: Events service status
//   auth: false
// }
``` API endpoints
├── eventAPI.js         # Event/Globe markers API endpoints
├── aiPrayerAPI.js      # AI-powered prayer generation service
├── globeAPI.js         # Globe-specific data orchestration
├── userSessionAPI.js   # User session and journey management
├── workflowAPI.js      # Application workflow orchestration
├── errorHandler.js     # Centralized error handling
├── environment.js      # Environment configuration
└── index.js           # Main export file
```

## 🚀 Quick Start

### 1. Initialize API Services

```javascript
import { initializeAPI } from './services';

// Call this when your app starts (e.g., in main.jsx)
initializeAPI();
```

### 2. Basic Usage

```javascript
import { 
  prayerAPI, 
  authAPI, 
  newsAPI, 
  eventAPI, 
  aiPrayerAPI, 
  globeAPI, 
  workflowAPI,
  userSessionAPI 
} from './services';

// Get all prayers
const prayers = await prayerAPI.getAllPrayers();

// Login user
const result = await authAPI.login({ email, password });

// Get latest news
const news = await newsAPI.getLatestNews();

// Get globe events
const events = await eventAPI.getEventMarkers();

// Generate AI prayer
const aiPrayer = await aiPrayerAPI.generatePrayer({
  eventTitle: 'Natural Disaster Relief',
  eventDescription: 'Supporting communities affected by flooding',
  eventCategory: 'Environment'
});

// Get globe prayer summary
const globeSummary = await globeAPI.getGlobePrayerSummary();

// Start user journey workflow
const journey = await workflowAPI.initializeGlobeView();
```

## 📋 API Services

### Prayer API (`prayerAPI`)

```javascript
// Get all prayers with pagination and filtering
await prayerAPI.getAllPrayers({
  page: 1,
  limit: 18,
  category: 'Health',
  search: 'healing'
});

// Get specific prayer
await prayerAPI.getPrayerById('prayer-id');

// Create new prayer
await prayerAPI.createPrayer({
  title: 'Prayer Title',
  message: 'Prayer message...',
  category: 'Health',
  isAnonymous: false
});

// Update prayer
await prayerAPI.updatePrayer('prayer-id', { title: 'Updated Title' });

// Delete prayer
await prayerAPI.deletePrayer('prayer-id');

// Search prayers
await prayerAPI.searchPrayers('healing', { page: 1 });

// Filter prayers
await prayerAPI.filterPrayers({ category: 'Health' });

// Get prayers count
await prayerAPI.getPrayersCount();
```

### Authentication API (`authAPI`)

```javascript
// Login
await authAPI.login({ email: 'user@example.com', password: 'password' });

// Register
await authAPI.register({
  email: 'user@example.com',
  password: 'password',
  confirmPassword: 'password',
  firstName: 'John',
  lastName: 'Doe'
});

// Logout
await authAPI.logout();

// Get user profile
await authAPI.getProfile();

// Refresh token
await authAPI.refreshToken();

// Forgot password
await authAPI.forgotPassword('user@example.com');

// Reset password
await authAPI.resetPassword({
  token: 'reset-token',
  password: 'newpassword',
  confirmPassword: 'newpassword'
});

// Check authentication status
const isLoggedIn = authAPI.isAuthenticated();

// Get stored user data
const userData = authAPI.getUserData();
```

### News API (`newsAPI`)

```javascript
// Get all news
await newsAPI.getAllNews({ page: 1, limit: 10 });

// Get specific news item
await newsAPI.getNewsById('news-id');

// Search news
await newsAPI.searchNews('climate change');

// Get latest news
await newsAPI.getLatestNews(5);

// Get news categories
await newsAPI.getNewsCategories();

// Filter by category
await newsAPI.filterNewsByCategory('Environment');
```

### Event API (`eventAPI`)

```javascript
// Get event markers for globe display
await eventAPI.getEventMarkers({ active: true, category: 'Environment' });

// Get specific event details
await eventAPI.getEventById('event-id');

// Get most relevant current event
await eventAPI.getMostRelevantEvent();

// Get event categories
await eventAPI.getEventCategories();

// Get prayers for specific event
await eventAPI.getEventPrayers('event-id', { page: 1, limit: 10 });

// Submit prayer for event
await eventAPI.submitEventPrayer('event-id', {
  userName: 'John Doe',
  email: 'john@example.com',
  prayerText: 'Sending thoughts and prayers...',
  isAnonymous: false
});
```

### AI Prayer API (`aiPrayerAPI`)

```javascript
// Generate full prayer with AI
await aiPrayerAPI.generatePrayer({
  eventTitle: 'Natural Disaster Relief',
  eventDescription: 'Communities affected by flooding need support',
  eventCategory: 'Environment',
  prayerType: 'healing',    // 'healing', 'peace', 'hope', 'strength'
  tone: 'compassionate'     // 'compassionate', 'hopeful', 'peaceful'
});

// Generate short prayer for globe display
await aiPrayerAPI.generateShortPrayer({
  eventTitle: 'Natural Disaster Relief',
  eventCategory: 'Environment'
});

// Get prayer suggestions based on event
await aiPrayerAPI.getPrayerSuggestions('event-id');

// Get prayer templates by category
await aiPrayerAPI.getPrayerTemplates('Environment');

// Validate user details for prayer submission
await aiPrayerAPI.validateUserDetails({
  userName: 'John Doe',
  email: 'john@example.com',
  age: 30,
  location: 'New York, USA'
});
```

### Globe API (`globeAPI`)

```javascript
// Get complete globe prayer summary (event + prayer)
await globeAPI.getGlobePrayerSummary();

// Get formatted globe display data
await globeAPI.getGlobeDisplayData();
```

### User Session API (`userSessionAPI`)

```javascript
// Initialize user session
userSessionAPI.initializeSession();

// Update journey state
userSessionAPI.updateJourneyState('GLOBE_VIEWING');
// Available states: 'GLOBE_VIEWING', 'EVENT_SELECTED', 'PRAYER_GENERATION', 
//                   'PRAYER_SUBMISSION', 'WALL_VIEWING'

// Get current journey state
const currentState = userSessionAPI.getCurrentJourneyState();

// Track user interaction
userSessionAPI.trackInteraction('GLOBE_MARKER_CLICKED', { eventId: 'event-123' });

// Get session analytics
const analytics = userSessionAPI.getSessionAnalytics();

// Clear session data
userSessionAPI.clearSession();
```

### Workflow API (`workflowAPI`)

```javascript
// Step 1: Initialize Globe view
const globeData = await workflowAPI.initializeGlobeView();

// Step 2: Handle event selection on globe
const eventDetails = await workflowAPI.handleEventSelection('event-id');

// Step 3: Generate prayer for selected event
const generatedPrayer = await workflowAPI.generateEventPrayer({
  eventId: 'event-id',
  userDetails: {
    userName: 'John Doe',
    email: 'john@example.com',
    age: 30,
    location: 'New York, USA'
  },
  prayerType: 'healing',
  tone: 'compassionate'
});

// Step 4: Submit prayer and navigate to wall
const submissionResult = await workflowAPI.submitPrayerAndNavigate({
  eventId: 'event-id',
  prayerText: 'Generated prayer text...',
  userDetails: { /* user details */ }
});

// Step 5: Initialize Wall of Prayers view
const wallData = await workflowAPI.initializeWallView({
  page: 1,
  category: 'Environment',
  search: ''
});

// Get complete user journey progress
const journeyProgress = await workflowAPI.getJourneyProgress();
```

## 🔧 Configuration

### Environment Variables

Required environment variables (set in `.env` files):

```bash
# API Configuration
VITE_API_BASE_URL="http://localhost:3000"    # Backend API URL
VITE_ENABLE_MOCK_DATA=true                   # Enable/disable mock data
VITE_PAGINATION_SIZE=18                      # Default pagination size
VITE_ENVIRONMENT="development"               # Environment type
```

### Mock Data Toggle

The API services automatically switch between real API calls and mock data based on the `VITE_ENABLE_MOCK_DATA` environment variable:

- **Development**: `VITE_ENABLE_MOCK_DATA=true` (uses mock data)
- **Production**: `VITE_ENABLE_MOCK_DATA=false` (uses real API)

## 🛡️ Error Handling

### Automatic Error Handling

All API calls include automatic error handling with:

- Network error detection
- HTTP status code handling
- Retry mechanism for transient errors
- User-friendly error messages
- Logging in development mode

### Using Error Handling

```javascript
import { prayerAPI, ERROR_TYPES } from './services';

try {
  const prayers = await prayerAPI.getAllPrayers();
} catch (error) {
  // Error is automatically processed and contains:
  console.log(error.message);    // User-friendly message
  console.log(error.type);       // Error type (e.g., 'NETWORK_ERROR')
  console.log(error.status);     // HTTP status code
  console.log(error.data);       // Additional error data
}
```

### Error Types

```javascript
import { ERROR_TYPES } from './services';

ERROR_TYPES.NETWORK_ERROR         // Network connectivity issues
ERROR_TYPES.API_ERROR             // Server-side errors
ERROR_TYPES.VALIDATION_ERROR      // Data validation errors
ERROR_TYPES.AUTHENTICATION_ERROR  // Login/auth errors
ERROR_TYPES.AUTHORIZATION_ERROR   // Permission errors
ERROR_TYPES.NOT_FOUND_ERROR      // Resource not found
ERROR_TYPES.TIMEOUT_ERROR        // Request timeout
ERROR_TYPES.UNKNOWN_ERROR        // Unexpected errors
```

## 🔄 Retry Mechanism

For transient errors (timeouts, server errors), the API includes automatic retry with exponential backoff:

```javascript
import { RetryHandler } from './services';

const retryHandler = new RetryHandler(3, 1000); // 3 retries, 1s base delay

const result = await retryHandler.execute(
  prayerAPI.getAllPrayers,
  { page: 1 }
);
```

## 📊 Service Health Check

Check if API services are available:

```javascript
import { checkServiceHealth } from './services';

const serviceStatus = await checkServiceHealth();
console.log(serviceStatus);
// {
//   prayer: true,
//   news: true,
//   auth: false
// }
```

## 🔐 Authentication Flow

### Automatic Token Management

The authentication system automatically handles:

- Token storage in localStorage
- Adding Authorization headers to requests
- Token refresh when expired
- Session cleanup on logout

### Integration Example

```javascript
import { authAPI, setAuthToken } from './services';

// Login flow
const loginResult = await authAPI.login({ email, password });
// Token is automatically stored and added to future requests

// Check if user is logged in (e.g., on app start)
if (authAPI.isAuthenticated()) {
  const userData = authAPI.getUserData();
  // User is logged in, token is already set
}

// Logout flow
await authAPI.logout();
// Token is automatically cleared
```

## 📈 Best Practices

### 1. Always Handle Errors

```javascript
try {
  const result = await prayerAPI.getAllPrayers();
  // Handle success
} catch (error) {
  // Handle error - show user notification, etc.
  console.error('Failed to load prayers:', error.message);
}
```

### 2. Use Loading States

```javascript
const [loading, setLoading] = useState(false);

const loadPrayers = async () => {
  setLoading(true);
  try {
    const result = await prayerAPI.getAllPrayers();
    // Handle result
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

### 3. Validate Data Before API Calls

The API includes built-in validation, but validate on the frontend too:

```javascript
const createPrayer = async (prayerData) => {
  // Frontend validation
  if (!prayerData.title?.trim()) {
    throw new Error('Title is required');
  }
  
  // API call with built-in validation
  return await prayerAPI.createPrayer(prayerData);
};
```

## 🚦 Production Deployment

### 1. Update Environment Variables

```bash
# .env.production
VITE_API_BASE_URL="https://api.yourdomain.com"
VITE_ENABLE_MOCK_DATA=false
VITE_ENVIRONMENT="production"
```

### 2. Backend API Requirements

Your backend API should implement these endpoints:

#### Prayer Endpoints
- `GET /api/prayers` - Get all prayers
- `GET /api/prayers/:id` - Get prayer by ID
- `POST /api/prayers` - Create prayer
- `PUT /api/prayers/:id` - Update prayer
- `DELETE /api/prayers/:id` - Delete prayer
- `GET /api/prayers/search` - Search prayers
- `GET /api/prayers/filter` - Filter prayers
- `GET /api/prayers/count` - Get prayers count

#### Auth Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

#### News Endpoints
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get news by ID
- `GET /api/news/search` - Search news
- `GET /api/news/latest` - Get latest news
- `GET /api/news/categories` - Get news categories

#### Event Endpoints (NEW)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/markers` - Get event markers for globe
- `GET /api/events/most-relevant` - Get most relevant current event
- `GET /api/events/categories` - Get event categories
- `GET /api/events/:id/prayers` - Get prayers for specific event
- `POST /api/events/:id/prayers` - Submit prayer for event

#### AI Prayer Endpoints (NEW)
- `POST /api/ai/generate-prayer` - Generate full prayer with AI
- `POST /api/ai/generate-short-prayer` - Generate short prayer for globe
- `GET /api/ai/prayer-suggestions/:eventId` - Get prayer suggestions
- `GET /api/ai/prayer-templates/:category` - Get prayer templates
- `POST /api/ai/validate-user-details` - Validate user details

### 3. Expected Response Format

All API responses should follow this format:

```javascript
// Success Response
{
  "data": { /* response data */ },
  "pagination": { /* pagination info (for list endpoints) */ }
}

// Error Response
{
  "message": "Error message",
  "error": "ERROR_CODE",
  "details": { /* additional error details */ }
}
```

## 🌟 Complete User Journey Workflow

The application provides a guided user journey through several states:

### Journey States

```javascript
import { JOURNEY_STATES } from './services';

JOURNEY_STATES.GLOBE_VIEWING     // User viewing the globe
JOURNEY_STATES.EVENT_SELECTED    // User selected an event
JOURNEY_STATES.PRAYER_GENERATION // AI generating prayer
JOURNEY_STATES.PRAYER_SUBMISSION // User on submission page
JOURNEY_STATES.WALL_VIEWING      // User viewing wall of prayers
```

### Complete Workflow Example

```javascript
import { workflowAPI, userSessionAPI } from './services';

// 1. User starts at Globe
const globeData = await workflowAPI.initializeGlobeView();
// State: GLOBE_VIEWING

// 2. User clicks on event marker
const eventData = await workflowAPI.handleEventSelection('event-123');
// State: EVENT_SELECTED

// 3. User fills prayer form and generates AI prayer
const prayerData = await workflowAPI.generateEventPrayer({
  eventId: 'event-123',
  userDetails: {
    userName: 'John Doe',
    email: 'john@example.com',
    age: 30,
    location: 'New York, USA'
  },
  prayerType: 'healing',
  tone: 'compassionate'
});
// State: PRAYER_GENERATION → PRAYER_SUBMISSION

// 4. User submits prayer and goes to wall
const result = await workflowAPI.submitPrayerAndNavigate({
  eventId: 'event-123',
  prayerText: prayerData.generatedPrayer,
  userDetails: prayerData.userDetails
});
// State: WALL_VIEWING

// 5. Track user journey analytics
const analytics = userSessionAPI.getSessionAnalytics();
console.log(analytics);
// {
//   sessionDuration: 300000,
//   statesVisited: ['GLOBE_VIEWING', 'EVENT_SELECTED', 'PRAYER_GENERATION', 'PRAYER_SUBMISSION', 'WALL_VIEWING'],
//   interactions: [
//     { type: 'GLOBE_MARKER_CLICKED', timestamp: 1694192400000, data: { eventId: 'event-123' } },
//     { type: 'PRAYER_GENERATED', timestamp: 1694192450000, data: { eventId: 'event-123' } },
//     { type: 'PRAYER_SUBMITTED', timestamp: 1694192500000, data: { eventId: 'event-123' } }
//   ]
// }
```

## 🎯 AI Prayer Generation Options

### Prayer Types
- `healing` - For disasters, tragedies, health crises
- `peace` - For conflicts, social unrest
- `hope` - For general difficult situations
- `strength` - For challenges requiring resilience
- `gratitude` - For positive events, celebrations

### Prayer Tones
- `compassionate` - Warm, empathetic approach
- `hopeful` - Optimistic, forward-looking
- `peaceful` - Calming, serene approach
- `uplifting` - Encouraging, inspiring
- `reflective` - Thoughtful, contemplative

### Usage Example

```javascript
import { aiPrayerAPI, PRAYER_OPTIONS } from './services';

const prayer = await aiPrayerAPI.generatePrayer({
  eventTitle: 'Hurricane Relief Efforts',
  eventDescription: 'Communities in Florida are recovering from hurricane damage',
  eventCategory: 'Environment',
  prayerType: PRAYER_OPTIONS.TYPES.HEALING,
  tone: PRAYER_OPTIONS.TONES.COMPASSIONATE
});
```

## 🎉 Conclusion

This comprehensive API service layer is production-ready and provides a complete foundation for the One Prayer One World application with:

- **Prayer Management** - Full CRUD operations for prayers
- **AI-Powered Prayer Generation** - OpenAI integration for contextual prayers  
- **Event/Globe Integration** - Real-time event markers and data
- **User Journey Tracking** - Complete workflow orchestration
- **Session Management** - User state and analytics
- **Robust Error Handling** - Retry mechanisms and user-friendly errors
- **Development/Production Support** - Mock data and environment switching

The API layer supports the complete user journey from globe viewing to prayer submission and wall display, with proper error handling, retry mechanisms, and development/production environment support.

---

**Last Updated**: September 8, 2025  
**API Version**: 2.0.0  
**Services**: 12 API modules covering complete application functionality
