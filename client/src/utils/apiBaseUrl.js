export const getApiBaseUrl = () =>
  process.env.REACT_APP_API_URL || window.location.origin;
