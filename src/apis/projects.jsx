import api from './auth';

// Projects API functions
export const projectsAPI = {
  // Get user's projects
  getProjects: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.tags) queryParams.append('tags', params.tags);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`/projects?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch projects',
      };
    }
  },

  // Get single project
  getProject: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch project',
      };
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create project',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Update project
  updateProject: async (projectId, updateData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, updateData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update project',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/projects/${projectId}`);
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete project',
      };
    }
  },

  // Add collaborator to project
  addCollaborator: async (projectId, collaboratorData) => {
    try {
      const response = await api.post(`/projects/${projectId}/collaborators`, collaboratorData);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add collaborator',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Update collaborator role
  updateCollaboratorRole: async (projectId, userId, role) => {
    try {
      const response = await api.put(`/projects/${projectId}/collaborators/${userId}`, { role });
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update collaborator role',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Remove collaborator from project
  removeCollaborator: async (projectId, userId) => {
    try {
      const response = await api.delete(`/projects/${projectId}/collaborators/${userId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove collaborator',
      };
    }
  },

  // Duplicate project
  duplicateProject: async (projectId, name) => {
    try {
      const response = await api.post(`/projects/${projectId}/duplicate`, { name });
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to duplicate project',
      };
    }
  },

  // Get public projects
  getPublicProjects: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`/projects/public?${queryParams.toString()}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch public projects',
      };
    }
  },
};

export default projectsAPI;

