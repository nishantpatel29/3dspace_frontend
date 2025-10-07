import api from './auth';

// Upload API functions
export const uploadAPI = {
  // Upload image
  uploadImage: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      if (options.folder) formData.append('folder', options.folder);
      if (options.publicId) formData.append('publicId', options.publicId);
      if (options.tags) formData.append('tags', options.tags);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options.onProgress,
      });
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload image',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Upload 3D model
  uploadModel: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('model', file);
      
      if (options.folder) formData.append('folder', options.folder);
      if (options.publicId) formData.append('publicId', options.publicId);
      if (options.tags) formData.append('tags', options.tags);

      const response = await api.post('/upload/model', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options.onProgress,
      });
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload 3D model',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Upload multiple files
  uploadMultiple: async (files, options = {}) => {
    try {
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      if (options.folder) formData.append('folder', options.folder);
      if (options.tags) formData.append('tags', options.tags);

      const response = await api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options.onProgress,
      });
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload files',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Delete uploaded file
  deleteFile: async (publicId) => {
    try {
      const response = await api.delete(`/upload/${publicId}`);
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete file',
      };
    }
  },

  // Get upload history
  getUploadHistory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);

      const response = await api.get(`/upload/history?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch upload history',
      };
    }
  },

  // Get upload statistics
  getUploadStats: async () => {
    try {
      const response = await api.get('/upload/stats');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch upload statistics',
      };
    }
  },

  // Get file info
  getFileInfo: async (publicId) => {
    try {
      const response = await api.get(`/upload/info/${publicId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch file info',
      };
    }
  },

  // Update file metadata
  updateFileMetadata: async (publicId, metadata) => {
    try {
      const response = await api.put(`/upload/metadata/${publicId}`, metadata);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update file metadata',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Get upload limits
  getUploadLimits: async () => {
    try {
      const response = await api.get('/upload/limits');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch upload limits',
      };
    }
  },

  // Check file type
  checkFileType: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/check-type', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check file type',
      };
    }
  },

  // Get supported file types
  getSupportedFileTypes: async () => {
    try {
      const response = await api.get('/upload/supported-types');
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch supported file types',
      };
    }
  },
};

export default uploadAPI;

