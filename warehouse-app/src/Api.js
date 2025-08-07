// api.js
const API_BASE_URL = "https://warehouse-vlad.ngrok.io";

const request = async (endpoint, method = 'GET', body = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json' };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Ошибка сети');
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при запросе к ${endpoint}:`, error);
    throw error;
  }
};

export const api = {
  fetchAppData: (userId) => request(`/data/${userId}`),
  saveAppData: (userId, data) => request(`/data/${userId}`, 'POST', data),
  fetchUsers: () => request('/users'),
  loginUser: (credentials) => request('/login', 'POST', credentials),
  registerUser: (userData) => request('/register', 'POST', userData),
  updateUser: (userData) => request(`/users/${userData.id}`, 'PUT', userData),
  deleteUser: (userId) => request(`/users/${userId}`, 'DELETE')
};
