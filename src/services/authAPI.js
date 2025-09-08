// // Authentication API service
// import { apiClient, setAuthToken, clearAuthToken, handleAPIError, isMockMode } from './api.js';

// /**
//  * Authentication endpoints
//  */
// const AUTH_ENDPOINTS = {
//   LOGIN: '/api/auth/login',
//   REGISTER: '/api/auth/register',
//   LOGOUT: '/api/auth/logout',
//   REFRESH: '/api/auth/refresh',
//   PROFILE: '/api/auth/profile',
//   FORGOT_PASSWORD: '/api/auth/forgot-password',
//   RESET_PASSWORD: '/api/auth/reset-password',
//   VERIFY_EMAIL: '/api/auth/verify-email',
// };

// /**
//  * Local storage keys
//  */
// const STORAGE_KEYS = {
//   ACCESS_TOKEN: 'accessToken',
//   REFRESH_TOKEN: 'refreshToken',
//   USER_DATA: 'userData',
// };

// /**
//  * Auth validation schemas
//  */
// export const AuthSchema = {
//   login: {
//     email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
//     password: { required: true, minLength: 6 },
//   },
//   register: {
//     email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
//     password: { required: true, minLength: 6 },
//     confirmPassword: { required: true },
//     firstName: { required: true, minLength: 2 },
//     lastName: { required: true, minLength: 2 },
//   },
//   forgotPassword: {
//     email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
//   },
//   resetPassword: {
//     token: { required: true },
//     password: { required: true, minLength: 6 },
//     confirmPassword: { required: true },
//   },
// };

// /**
//  * Validate authentication data
//  */
// const validateAuthData = (data, schema) => {
//   const errors = [];
  
//   for (const [field, rules] of Object.entries(schema)) {
//     const value = data[field];
    
//     if (rules.required && (!value || value.toString().trim() === '')) {
//       errors.push(`${field} is required`);
//       continue;
//     }
    
//     if (value) {
//       if (rules.minLength && value.length < rules.minLength) {
//         errors.push(`${field} must be at least ${rules.minLength} characters`);
//       }
      
//       if (rules.pattern && !rules.pattern.test(value)) {
//         errors.push(`${field} format is invalid`);
//       }
//     }
//   }
  
//   // Check password confirmation
//   if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
//     errors.push('Passwords do not match');
//   }
  
//   if (errors.length > 0) {
//     throw new Error(`Validation failed: ${errors.join(', ')}`);
//   }
  
//   return true;
// };

// /**
//  * Mock authentication for development
//  */
// const mockAuthAPI = {
//   async login(credentials) {
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // Mock successful login
//     const mockUser = {
//       id: '1',
//       email: credentials.email,
//       firstName: 'John',
//       lastName: 'Doe',
//       isVerified: true,
//     };
    
//     const mockTokens = {
//       accessToken: 'mock-access-token-' + Date.now(),
//       refreshToken: 'mock-refresh-token-' + Date.now(),
//     };
    
//     return {
//       user: mockUser,
//       tokens: mockTokens,
//     };
//   },

//   async register(userData) {
//     await new Promise(resolve => setTimeout(resolve, 1200));
    
//     // Mock successful registration
//     const mockUser = {
//       id: Date.now().toString(),
//       email: userData.email,
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       isVerified: false,
//     };
    
//     return {
//       user: mockUser,
//       message: 'Registration successful. Please check your email to verify your account.',
//     };
//   },

//   async logout() {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return { success: true };
//   },

//   async refreshToken() {
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     return {
//       accessToken: 'mock-new-access-token-' + Date.now(),
//     };
//   },

//   async getProfile() {
//     await new Promise(resolve => setTimeout(resolve, 400));
    
//     return {
//       user: {
//         id: '1',
//         email: 'john.doe@example.com',
//         firstName: 'John',
//         lastName: 'Doe',
//         isVerified: true,
//         createdAt: '2024-01-01T00:00:00.000Z',
//       },
//     };
//   },

//   async forgotPassword(email) {
//     await new Promise(resolve => setTimeout(resolve, 800));
    
//     return {
//       message: 'Password reset email sent successfully',
//     };
//   },

//   async resetPassword(data) {
//     await new Promise(resolve => setTimeout(resolve, 700));
    
//     return {
//       message: 'Password reset successfully',
//     };
//   },
// };

// /**
//  * Authentication API Service
//  */
// export const authAPI = {
//   /**
//    * User login
//    */
//   async login(credentials) {
//     if (!credentials) {
//       throw new Error('Login credentials are required');
//     }

//     if (isMockMode()) {
//       validateAuthData(credentials, AuthSchema.login);
//       const result = await mockAuthAPI.login(credentials);
//       this.setUserSession(result.user, result.tokens);
//       return result;
//     }

//     try {
//       validateAuthData(credentials, AuthSchema.login);
//       const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
      
//       if (response.user && response.tokens) {
//         this.setUserSession(response.user, response.tokens);
//       }
      
//       return response;
//     } catch (error) {
//       const errorInfo = handleAPIError(error, 'Login failed');
//       throw errorInfo;
//     }
//   },

//   /**
//    * User registration
//    */
//   async register(userData) {
//     if (!userData) {
//       throw new Error('Registration data is required');
//     }

//     if (isMockMode()) {
//       validateAuthData(userData, AuthSchema.register);
//       return mockAuthAPI.register(userData);
//     }

//     try {
//       validateAuthData(userData, AuthSchema.register);
//       const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
//       return response;
//     } catch (error) {
//       const errorInfo = handleAPIError(error, 'Registration failed');
//       throw errorInfo;
//     }
//   },

//   /**
//    * User logout
//    */
//   async logout() {
//     if (isMockMode()) {
//       const result = await mockAuthAPI.logout();
//       this.clearUserSession();
//       return result;
//     }

//     try {
//       const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
//       this.clearUserSession();
//       return response;
//     } catch (error) {
//       // Clear session even if logout API fails
//       this.clearUserSession();
//       const errorInfo = handleAPIError(error, 'Logout failed');
//       throw errorInfo;
//     }
//   },

//   /**
//    * Refresh access token
//    */
//   async refreshToken() {
//     const refreshToken = this.getRefreshToken();
//     if (!refreshToken) {
//       throw new Error('No refresh token available');
//     }

//     if (isMockMode()) {
//       const result = await mockAuthAPI.refreshToken();
//       this.setAccessToken(result.accessToken);
//       return result;
//     }

//     try {
//       const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH, {
//         refreshToken,
//       });
      
//       if (response.accessToken) {
//         this.setAccessToken(response.accessToken);
//       }
      
//       return response;
//     } catch (error) {
//       // Clear session if refresh fails
//       this.clearUserSession();
//       const errorInfo = handleAPIError(error, 'Token refresh failed');
//       throw errorInfo;
//     }
//   },

//   /**
//    * Get user profile
//    */
//   async getProfile() {
//     if (isMockMode()) {
//       return mockAuthAPI.getProfile();
//     }

//     try {
//       const response = await apiClient.get(AUTH_ENDPOINTS.PROFILE);
//       return response;
//     } catch (error) {
//       const errorInfo = handleAPIError(error, 'Failed to fetch profile');
//       throw errorInfo;
//     }
//   },

//   /**
//    * Forgot password
//    */
//   async forgotPassword(email) {
//     if (!email) {
//       throw new Error('Email is required');
//     }

//     if (isMockMode()) {
//       validateAuthData({ email }, AuthSchema.forgotPassword);
//       return mockAuthAPI.forgotPassword();
//     }

//     try {
//       validateAuthData({ email }, AuthSchema.forgotPassword);
//       const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
//       return response;
//     } catch (error) {
//       const errorInfo = handleAPIError(error, 'Forgot password failed');
//       throw errorInfo;
//     }
//   },

//   /**
//    * Reset password
//    */
//   async resetPassword(resetData) {
//     if (!resetData) {
//       throw new Error('Reset data is required');
//     }

//     if (isMockMode()) {
//       validateAuthData(resetData, AuthSchema.resetPassword);
//       return mockAuthAPI.resetPassword();
//     }

//     try {
//       validateAuthData(resetData, AuthSchema.resetPassword);
//       const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, resetData);
//       return response;
//     } catch (error) {
//       const errorInfo = handleAPIError(error, 'Password reset failed');
//       throw errorInfo;
//     }
//   },

//   /**
//    * Set user session data
//    */
//   setUserSession(user, tokens) {
//     if (tokens.accessToken) {
//       localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
//       setAuthToken(tokens.accessToken);
//     }
    
//     if (tokens.refreshToken) {
//       localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
//     }
    
//     if (user) {
//       localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
//     }
//   },

//   /**
//    * Clear user session data
//    */
//   clearUserSession() {
//     localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
//     localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
//     localStorage.removeItem(STORAGE_KEYS.USER_DATA);
//     clearAuthToken();
//   },

//   /**
//    * Get access token from storage
//    */
//   getAccessToken() {
//     return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
//   },

//   /**
//    * Get refresh token from storage
//    */
//   getRefreshToken() {
//     return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
//   },

//   /**
//    * Get user data from storage
//    */
//   getUserData() {
//     const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
//     return userData ? JSON.parse(userData) : null;
//   },

//   /**
//    * Set access token
//    */
//   setAccessToken(token) {
//     localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
//     setAuthToken(token);
//   },

//   /**
//    * Check if user is authenticated
//    */
//   isAuthenticated() {
//     return !!this.getAccessToken();
//   },

//   /**
//    * Initialize auth state on app load
//    */
//   initializeAuth() {
//     const token = this.getAccessToken();
//     if (token) {
//       setAuthToken(token);
//     }
//   },
// };
