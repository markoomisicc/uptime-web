const BASE = '/api';
const AUTH = `${BASE}/auth`;

export const API = {
  auth: {
    register: `${AUTH}/register`,
    login: `${AUTH}/login`,
    logout: `${AUTH}/logout`,
    me: `${AUTH}/me`,
  },
} as const;