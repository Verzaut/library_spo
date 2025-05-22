'use client';

import { AuthProvider } from '../context/AuthContext';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
} 