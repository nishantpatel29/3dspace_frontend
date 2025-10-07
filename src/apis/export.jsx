import api from './auth';

// Export API functions
export const exportAPI = {
  // Export design as GLTF/GLB
  exportGLTF: async (designId, exportOptions = {}) => {
    try {
      const response = await api.post(`/export/gltf/${designId}`, exportOptions);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to export GLTF',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Export design as image
  exportImage: async (designId, exportOptions = {}) => {
    try {
      const response = await api.post(`/export/image/${designId}`, exportOptions);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to export image',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Export design as PDF
  exportPDF: async (designId, exportOptions = {}) => {
    try {
      const response = await api.post(`/export/pdf/${designId}`, exportOptions);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to export PDF',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Get export history
  getExportHistory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      if (params.status) queryParams.append('status', params.status);

      const response = await api.get(`/export/history?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch export history',
      };
    }
  },

  // Get export status
  getExportStatus: async (exportId) => {
    try {
      const response = await api.get(`/export/status/${exportId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch export status',
      };
    }
  },

  // Download exported file
  downloadExport: async (exportId) => {
    try {
      const response = await api.get(`/export/download/${exportId}`, {
        responseType: 'blob',
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to download export',
      };
    }
  },

  // Cancel export
  cancelExport: async (exportId) => {
    try {
      const response = await api.post(`/export/cancel/${exportId}`);
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel export',
      };
    }
  },

  // Get export formats
  getExportFormats: async () => {
    try {
      const response = await api.get('/export/formats');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch export formats',
      };
    }
  },

  // Get export settings
  getExportSettings: async (designId) => {
    try {
      const response = await api.get(`/export/settings/${designId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch export settings',
      };
    }
  },

  // Update export settings
  updateExportSettings: async (designId, settings) => {
    try {
      const response = await api.put(`/export/settings/${designId}`, settings);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update export settings',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Batch export
  batchExport: async (designIds, exportOptions = {}) => {
    try {
      const response = await api.post('/export/batch', {
        designIds,
        ...exportOptions,
      });
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to batch export',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Get export templates
  getExportTemplates: async () => {
    try {
      const response = await api.get('/export/templates');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch export templates',
      };
    }
  },

  // Create export template
  createExportTemplate: async (templateData) => {
    try {
      const response = await api.post('/export/templates', templateData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create export template',
        errors: error.response?.data?.errors || [],
      };
    }
  },
};

export default exportAPI;

