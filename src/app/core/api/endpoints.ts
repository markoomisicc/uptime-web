const BASE = '/api';

const AUTH = `${BASE}/auth`;

export const API = {
  auth: {
    register: `${AUTH}/register`,
    login: `${AUTH}/login`,
    logout: `${AUTH}/logout`,
    me: `${AUTH}/me`,
    verifyEmail: `${AUTH}/verify-email`,
    resendVerification: `${AUTH}/verify-email/resend`,
  },
} as const;