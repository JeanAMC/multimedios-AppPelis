import api from './axios';

export async function login(email: string, password: string) {
  const response = await api.post('/api/login', { email, password });
  const data = response.data;

  localStorage.setItem('auth_token', data.token);
  api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;


  return data; 
}

export async function register(name: string, email: string, password: string, password_confirmation: string) {
  const response = await api.post('/api/register', {
    name,
    email,
    password,
    password_confirmation,
  });
  const data = response.data;

  localStorage.setItem('auth_token', data.token);
  api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

  return data;
}

export async function logout() {
    await api.post('/api/logout');
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
}


export async function getUser() {
    const response = await api.get('/api/user');
    return response.data;
}

