const API_BASE_URL = "https://warehouse-vlad.ngrok.io";

export const api = {
  async request(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };
    const options = {
      method,
      headers,
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Сетевой ответ был не в порядке');
      }
      return await response.json();
    } catch (error) {
      console.error(`Ошибка при запросе к ${endpoint}:`, error);
      throw error;
    }
  },

  fetchAppData: (userId) => api.request(`/data/${userId}`),
  saveAppData: (userId, data) => api.request(`/data/${userId}`, 'POST', data),
  fetchUsers: () => api.request('/users'),
  loginUser: (credentials) => api.request('/login', 'POST', credentials),
  registerUser: (userData) => api.request('/register', 'POST', userData),
  updateUser: (userData) => api.request(`/users/${userData.id}`, 'PUT', userData),
  deleteUser: (userId) => api.request(`/users/${userId}`, 'DELETE'),
};