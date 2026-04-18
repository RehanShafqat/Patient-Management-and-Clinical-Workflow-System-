// Development environment configuration
export const environment = {
  production: false,
  
  // Base API endpoint used by all services for HTTP requests (Express service backend)
  apiUrl: 'http://localhost:4000/api',
  
  // Page size for paginated searchable dropdowns/selects
  searchableSelectPageSize: 10,
  
  // Debounce delay (milliseconds) for filter/search operations to reduce API calls
  filterDebounceMs: 300,
};
