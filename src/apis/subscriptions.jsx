import api from './auth';

// Subscriptions API functions
export const subscriptionsAPI = {
  // Get available subscription plans
  getPlans: async () => {
    try {
      const response = await api.get('/subscriptions/plans');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscription plans',
      };
    }
  },

  // Get current subscription
  getCurrentSubscription: async () => {
    try {
      const response = await api.get('/subscriptions/current');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch current subscription',
      };
    }
  },

  // Upgrade subscription
  upgradeSubscription: async (upgradeData) => {
    try {
      const response = await api.post('/subscriptions/upgrade', upgradeData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upgrade subscription',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Cancel subscription
  cancelSubscription: async (cancellationData) => {
    try {
      const response = await api.post('/subscriptions/cancel', cancellationData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel subscription',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Get usage statistics
  getUsageStats: async () => {
    try {
      const response = await api.get('/subscriptions/usage');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch usage statistics',
      };
    }
  },

  // Get billing history
  getBillingHistory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/subscriptions/billing-history?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch billing history',
      };
    }
  },

  // Update payment method
  updatePaymentMethod: async (paymentData) => {
    try {
      const response = await api.put('/subscriptions/payment-method', paymentData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update payment method',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Get subscription features
  getSubscriptionFeatures: async (planId) => {
    try {
      const response = await api.get(`/subscriptions/features/${planId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscription features',
      };
    }
  },

  // Check feature access
  checkFeatureAccess: async (feature) => {
    try {
      const response = await api.get(`/subscriptions/check-access/${feature}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check feature access',
      };
    }
  },

  // Get subscription limits
  getSubscriptionLimits: async () => {
    try {
      const response = await api.get('/subscriptions/limits');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscription limits',
      };
    }
  },

  // Pause subscription
  pauseSubscription: async (pauseData) => {
    try {
      const response = await api.post('/subscriptions/pause', pauseData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to pause subscription',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Resume subscription
  resumeSubscription: async () => {
    try {
      const response = await api.post('/subscriptions/resume');
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resume subscription',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Get subscription analytics
  getSubscriptionAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.period) queryParams.append('period', params.period);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await api.get(`/subscriptions/analytics?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscription analytics',
      };
    }
  },
};

export default subscriptionsAPI;

