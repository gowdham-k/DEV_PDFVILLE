
// Dynamically determine API URL based on environment
const determineApiUrl = () => {
  // Use environment variable if set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Check if we're running in a browser and determine if it's localhost
  if (typeof window !== 'undefined') {
    const isLocalhost = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1';
    
    // For localhost, assume backend runs on port 5000 over HTTP; otherwise use HTTPS dev domain
    return isLocalhost ? 'http://localhost:5000' : 'https://dev.pdfville.com';
  }
  
  // Default fallback for server-side rendering
  return 'https://dev.pdfville.com';
};

export const API_BASE_URL = determineApiUrl();