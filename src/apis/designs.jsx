import api from './auth';

// Designs API functions
export const designsAPI = {
  // Get user's designs
  getDesigns: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.projectId) queryParams.append('projectId', params.projectId);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`/designs?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch designs',
      };
    }
  },

  // Get single design
  getDesign: async (designId) => {
    try {
      const response = await api.get(`/designs/${designId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch design',
      };
    }
  },

  // Create new design
  createDesign: async (designData) => {
    try {
      const response = await api.post('/designs', designData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create design',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Update design
  updateDesign: async (designId, updateData) => {
    try {
      const response = await api.put(`/designs/${designId}`, updateData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update design',
      };
    }
  },

  // Delete design
  deleteDesign: async (designId) => {
    try {
      const response = await api.delete(`/designs/${designId}`);
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete design',
      };
    }
  },

  // Add furniture to design
  addFurniture: async (designId, furnitureData) => {
    try {
      const response = await api.post(`/designs/${designId}/furniture`, furnitureData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add furniture',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Update furniture in design
  updateFurniture: async (designId, furnitureId, updateData) => {
    try {
      const response = await api.put(`/designs/${designId}/furniture/${furnitureId}`, updateData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update furniture',
      };
    }
  },

  // Remove furniture from design
  removeFurniture: async (designId, furnitureId) => {
    try {
      const response = await api.delete(`/designs/${designId}/furniture/${furnitureId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove furniture',
      };
    }
  },

  // Duplicate design
  duplicateDesign: async (designId, name) => {
    try {
      const response = await api.post(`/designs/${designId}/duplicate`, { name });
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to duplicate design',
      };
    }
  },

  // Get public designs
  getPublicDesigns: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`/designs/public?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch public designs',
      };
    }
  },

  // Save design state (auto-save functionality)
  saveDesignState: async (designId, designState) => {
    try {
      const response = await api.put(`/designs/${designId}`, {
        elements: designState.elements,
        furniture: designState.furniture,
        layers: designState.layers,
        camera: designState.camera,
        environment: designState.environment,
        settings: designState.settings,
      });
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save design state',
      };
    }
  },

  // Load design state
  loadDesignState: async (designId) => {
    try {
      const response = await api.get(`/designs/${designId}`);
      
      if (response.data.success) {
        const design = response.data.data.design;
        return {
          success: true,
          data: {
            elements: design.elements,
            furniture: design.furniture,
            layers: design.layers,
            camera: design.camera,
            environment: design.environment,
            settings: design.settings,
            metadata: design.metadata,
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load design state',
      };
    }
  },
};

export default designsAPI;

