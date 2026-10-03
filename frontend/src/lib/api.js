const BASE = '/api';

let _token = null;
try {
  _token = localStorage.getItem('token');
} catch {
  // blocked storage
}

export function getToken() {
  return _token;
}

export function setToken(t) {
  _token = t;
  try {
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  } catch {
    // blocked storage
  }
}

async function request(path, options = {}) {
  const headers = { ...options.headers };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 204) return { data: null, error: null };

  let data;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    data = await res.json();
  } else if (ct.includes('application/pdf')) {
    data = await res.blob();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    return { data: null, error: { status: res.status, detail: data?.detail || res.statusText } };
  }
  return { data, error: null };
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),

  login: async (email, password) => {
    const form = new URLSearchParams();
    form.set('username', email);
    form.set('password', password);
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: { status: res.status, detail: data.detail } };
    setToken(data.access_token);
    return { data, error: null };
  },

  register: async (payload) => {
    const { data, error } = await request('/auth/register', {
      method: 'POST',
      body: payload,
    });
    if (data?.access_token) setToken(data.access_token);
    return { data, error };
  },

  logout: () => {
    setToken(null);
  },
};
