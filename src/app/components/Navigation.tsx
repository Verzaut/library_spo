'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Если пользователь не авторизован, показываем только логотип
  if (!user) {
    return (
      <nav className={styles.navigation}>
        <Link href="/" className={styles.logo}>
          📚 Библиотека
        </Link>
      </nav>
    );
  }

  return (
    <nav className={styles.navigation}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>
          📚 Библиотека
        </Link>
        <div className={styles.navLinks}>
          <Link 
            href="/catalog" 
            className={`${styles.navLink} ${pathname === '/catalog' ? styles.active : ''}`}
          >
            Каталог
          </Link>
          <Link 
            href="/profile" 
            className={`${styles.navLink} ${pathname === '/profile' ? styles.active : ''}`}
          >
            Мой профиль
          </Link>
          {user.role === 'librarian' && (
            <Link 
              href="/admin" 
              className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}
            >
              Управление
            </Link>
          )}
        </div>
      </div>
      <div className={styles.rightSection}>
        <span className={styles.userName}>
          {user.firstName} {user.lastName}
        </span>
        <button onClick={logout} className={styles.logoutButton}>
          Выйти
        </button>
      </div>
    </nav>
  );
} 