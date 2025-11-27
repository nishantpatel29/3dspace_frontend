import axios from 'axios';
// Create axios instance with base configuration
// Ensure baseURL always ends with /api
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // Remove trailing slash if present
  const cleanURL = envURL.replace(/\/$/, '');
  // Add /api if not already present
  return cleanURL.endsWith('/api') ? cleanURL : `${cleanURL}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
}); 

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // For backend routes expecting x-auth-token
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        agreeToTerms: userData.agreeToTerms.toString(),
      });

      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;
        
        // Store tokens and user data
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        // Notify app about auth change
        window.dispatchEvent(new Event('auth-changed'));
        
        return {
          success: true,
          user,
          message: response.data.message,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      });

      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;
        
        // Store tokens and user data
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        // Notify app about auth change
        window.dispatchEvent(new Event('auth-changed'));
        
        return {
          success: true,
          user,
          message: response.data.message,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Notify app about auth change
      window.dispatchEvent(new Event('auth-changed'));
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return {
          success: true,
          user,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user data',
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return {
          success: true,
          user,
          message: response.data.message,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset request failed',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token: resetData.token,
        newPassword: resetData.newPassword,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      
      if (response.data.success) {
        const { token, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        return {
          success: true,
          token,
          refreshToken: newRefreshToken,
        };
      }
    } catch (error) {
      // Clear tokens on refresh failure
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: false,
        message: error.response?.data?.message || 'Token refresh failed',
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem('token');
  },

  // Clear all auth data
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Check subscription status
  hasSubscription: (requiredPlan = 'free') => {
    const user = authAPI.getStoredUser();
    if (!user) return false;

    const planHierarchy = { free: 1, pro: 2, enterprise: 3 };
    const userPlan = user.subscription?.plan || 'free';
    
    return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
  },

  // Check if user has Pro subscription
  isProUser: () => {
    return authAPI.hasSubscription('pro');
  },

  // Check if user has Enterprise subscription
  isEnterpriseUser: () => {
    return authAPI.hasSubscription('enterprise');
  },

  // Get user subscription info
  getSubscriptionInfo: () => {
    const user = authAPI.getStoredUser();
    return user?.subscription || null;
  },
};

// Utility functions for form validation
export const authValidation = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  // Name validation
  isValidName: (name) => {
    return name && name.trim().length >= 1 && name.trim().length <= 50;
  },

  // Form validation for registration
  validateRegistrationForm: (formData) => {
    const errors = {};

    if (!authValidation.isValidName(formData.firstName)) {
      errors.firstName = 'First name is required and must be less than 50 characters';
    }

    if (!authValidation.isValidName(formData.lastName)) {
      errors.lastName = 'Last name is required and must be less than 50 characters';
    }

    if (!authValidation.isValidEmail(formData.email)) {
      errors.email = 'Please provide a valid email address';
    }

    if (!authValidation.isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Form validation for login
  validateLoginForm: (formData) => {
    const errors = {};

    if (!authValidation.isValidEmail(formData.email)) {
      errors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Form validation for password change
  validatePasswordChangeForm: (formData) => {
    const errors = {};

    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!authValidation.isValidPassword(formData.newPassword)) {
      errors.newPassword = 'New password must be at least 6 characters long';
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      errors.confirmNewPassword = 'New passwords do not match';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

// React hooks for authentication (if using React)
export const useAuth = () => {
  const [user, setUser] = useState(authAPI.getStoredUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const result = await authAPI.login(credentials);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const result = await authAPI.register(userData);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const result = await authAPI.updateProfile(profileData);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setIsLoading(true);
    try {
      const result = await authAPI.changePassword(passwordData);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const result = await authAPI.getCurrentUser();
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    hasSubscription: authAPI.hasSubscription,
    isProUser: authAPI.isProUser,
    isEnterpriseUser: authAPI.isEnterpriseUser,
    getSubscriptionInfo: authAPI.getSubscriptionInfo,
  };
};

// Export the API instance for other API calls
export default api;

