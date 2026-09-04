// Centralized API Configuration
// Allows changing backend URL in one single location

export const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';

export const getApiBaseUrl = () => {
  return localStorage.getItem('CYBERGUARD_API_URL') || DEFAULT_API_BASE_URL;
};

export const setApiBaseUrl = (url) => {
  if (!url) {
    localStorage.removeItem('CYBERGUARD_API_URL');
  } else {
    localStorage.setItem('CYBERGUARD_API_URL', url.replace(/\/+$/, ''));
  }
};
