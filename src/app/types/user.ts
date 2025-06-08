export type UserRole = 'reader' | 'librarian' | 'admin';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface UserLoginData {
  email: string;
  password: string;
} 