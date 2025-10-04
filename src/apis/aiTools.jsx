import api from './auth';

// AI Tools API functions
export const aiToolsAPI = {
  // Smart Wizard - Generate room layout
  smartWizard: async (wizardData) => {
    try {
      const response = await api.post('/ai-tools/smart-wizard', wizardData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate room layout',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Design Generator - Get AI design suggestions
  designGenerator: async (designData) => {
    try {
      const response = await api.post('/ai-tools/design-generator', designData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate design suggestions',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Room Scan - Convert photo to 3D model
  roomScan: async (imageData) => {
    try {
      const response = await api.post('/ai-tools/room-scan', imageData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process room scan',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Color Palette Generator
  generateColorPalette: async (paletteData) => {
    try {
      const response = await api.post('/ai-tools/color-palette', paletteData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate color palette',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Furniture Suggestions
  getFurnitureSuggestions: async (suggestionData) => {
    try {
      const response = await api.post('/ai-tools/furniture-suggestions', suggestionData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get furniture suggestions',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Get AI usage statistics
  getUsageStats: async () => {
    try {
      const response = await api.get('/ai-tools/usage-stats');
      
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

  // Style Transfer
  styleTransfer: async (styleData) => {
    try {
      const response = await api.post('/ai-tools/style-transfer', styleData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to apply style transfer',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Room Optimization
  optimizeRoom: async (optimizationData) => {
    try {
      const response = await api.post('/ai-tools/room-optimization', optimizationData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to optimize room',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Lighting Suggestions
  getLightingSuggestions: async (lightingData) => {
    try {
      const response = await api.post('/ai-tools/lighting-suggestions', lightingData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get lighting suggestions',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Material Suggestions
  getMaterialSuggestions: async (materialData) => {
    try {
      const response = await api.post('/ai-tools/material-suggestions', materialData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get material suggestions',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Get AI tool status
  getToolStatus: async (toolName) => {
    try {
      const response = await api.get(`/ai-tools/status/${toolName}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get tool status',
      };
    }
  },
};

export default aiToolsAPI;
