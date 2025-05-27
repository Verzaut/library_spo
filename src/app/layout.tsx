import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import "./globals.css";

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: "Библиотека",
  description: "Онлайн библиотека с возможностью бронирования книг",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
