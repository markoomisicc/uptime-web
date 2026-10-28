export type LanguageCode = 'en' | 'de';

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  timezone: string;
  language: LanguageCode;
  email_verified: boolean;
  created_at: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  timezone: string;
  language: LanguageCode;
}