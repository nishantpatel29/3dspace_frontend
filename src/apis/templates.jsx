import api from './auth';

// Templates API functions
export const templatesAPI = {
  // Get templates
  getTemplates: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.style) queryParams.append('style', params.style);
      if (params.roomType) queryParams.append('roomType', params.roomType);
      if (params.isPremium !== undefined) queryParams.append('isPremium', params.isPremium);
      if (params.featured !== undefined) queryParams.append('featured', params.featured);
      if (params.tags) queryParams.append('tags', params.tags);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.search) queryParams.append('search', params.search);

      const response = await api.get(`/templates?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch templates',
      };
    }
  },

  // Get single template
  getTemplate: async (templateId) => {
    try {
      const response = await api.get(`/templates/${templateId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch template',
      };
    }
  },

  // Use template (create design from template)
  useTemplate: async (templateId, designData) => {
    try {
      const response = await api.post(`/templates/${templateId}/use`, designData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to use template',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Get template categories
  getCategories: async () => {
    try {
      const response = await api.get('/templates/categories');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch template categories',
      };
    }
  },

  // Get featured templates
  getFeaturedTemplates: async (limit = 10) => {
    try {
      const response = await api.get(`/templates/featured?limit=${limit}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch featured templates',
      };
    }
  },

  // Get templates by category
  getTemplatesByCategory: async (category, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/templates/category/${category}?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch templates by category',
      };
    }
  },

  // Get templates by style
  getTemplatesByStyle: async (style, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/templates/style/${style}?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch templates by style',
      };
    }
  },

  // Rate template
  rateTemplate: async (templateId, rating) => {
    try {
      const response = await api.post(`/templates/${templateId}/rate`, { rating });
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to rate template',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Search templates
  searchTemplates: async (query, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append('q', query);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/templates/search?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search templates',
      };
    }
  },

  // Get template filters
  getTemplateFilters: async () => {
    try {
      const response = await api.get('/templates');
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.filters,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch template filters',
      };
    }
  },

  // Get similar templates
  getSimilarTemplates: async (templateId) => {
    try {
      const response = await api.get(`/templates/${templateId}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.similar,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch similar templates',
      };
    }
  },
};

export default templatesAPI;

