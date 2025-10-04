// Export all API modules
export { authAPI, authValidation, useAuth } from './auth';
export { default as api } from './auth';
export { default as projectsAPI } from './projects';
export { default as designsAPI } from './designs';
export { default as furnitureAPI } from './furniture';
export { default as templatesAPI } from './templates';
export { default as aiToolsAPI } from './aiTools';
export { default as subscriptionsAPI } from './subscriptions';
export { default as exportAPI } from './export';
export { default as uploadAPI } from './upload';

// Re-export everything for convenience
export * from './auth';
export * from './projects';
export * from './designs';
export * from './furniture';
export * from './templates';
export * from './aiTools';
export * from './subscriptions';
export * from './export';
export * from './upload';
