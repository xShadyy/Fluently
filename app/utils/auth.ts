export function getToken() {

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) return token;
  
      const match = document.cookie.match(/(^| )token=([^;]+)/);
      return match ? match[2] : null;
    }
    return null;
  }
  