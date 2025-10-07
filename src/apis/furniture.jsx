import api from './auth';

// Furniture API functions
export const furnitureAPI = {
  // Get furniture catalog
  getFurniture: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.subcategory) queryParams.append('subcategory', params.subcategory);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.brand) queryParams.append('brand', params.brand);
      if (params.style) queryParams.append('style', params.style);
      if (params.inStock !== undefined) queryParams.append('inStock', params.inStock);
      if (params.featured !== undefined) queryParams.append('featured', params.featured);
      if (params.tags) queryParams.append('tags', params.tags);
      if (params.materials) queryParams.append('materials', params.materials);
      if (params.colors) queryParams.append('colors', params.colors);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.search) queryParams.append('search', params.search);

      const response = await api.get(`/furniture?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch furniture',
      };
    }
  },

  // Get single furniture item
  getFurnitureItem: async (furnitureId) => {
    try {
      const response = await api.get(`/furniture/${furnitureId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch furniture item',
      };
    }
  },

  // Get furniture categories
  getCategories: async () => {
    try {
      const response = await api.get('/furniture/categories');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch categories',
      };
    }
  },

  // Get featured furniture
  getFeaturedFurniture: async (limit = 10) => {
    try {
      const response = await api.get(`/furniture/featured?limit=${limit}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch featured furniture',
      };
    }
  },

  // Get furniture by category
  getFurnitureByCategory: async (category, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/furniture/category/${category}?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch furniture by category',
      };
    }
  },

  // Search furniture
  searchFurniture: async (query, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append('q', query);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/furniture/search?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search furniture',
      };
    }
  },

  // Rate furniture item
  rateFurniture: async (furnitureId, rating) => {
    try {
      const response = await api.post(`/furniture/${furnitureId}/rate`, { rating });
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to rate furniture',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Get trending furniture
  getTrendingFurniture: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.period) queryParams.append('period', params.period);

      const response = await api.get(`/furniture/trending?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch trending furniture',
      };
    }
  },

  // Get furniture filters
  getFurnitureFilters: async () => {
    try {
      const response = await api.get('/furniture');
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.filters,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch furniture filters',
      };
    }
  },

  // Get similar furniture
  getSimilarFurniture: async (furnitureId) => {
    try {
      const response = await api.get(`/furniture/${furnitureId}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.similar,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch similar furniture',
      };
    }
  },
};

export default furnitureAPI;

