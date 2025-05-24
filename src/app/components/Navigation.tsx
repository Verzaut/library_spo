'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Библиотека
        </Link>

        <div className={styles.links}>
          {user ? (
            <>
              <Link
                href="/catalog"
                className={`${styles.link} ${isActive('/catalog') ? styles.activeLink : ''}`}
              >
                Каталог
              </Link>
              <Link
                href="/profile"
                className={`${styles.link} ${isActive('/profile') ? styles.activeLink : ''}`}
              >
                Профиль
              </Link>
              <Link
                href="/"
                className={`${styles.link} ${isActive('/') ? styles.activeLink : ''}`}
              >
                Выбор библиотеки
              </Link>
              <button onClick={logout} className={styles.logoutButton}>
                Выйти
              </button>
            </>
          ) : (
            <Link
              href="/"
              className={`${styles.link} ${isActive('/') ? styles.activeLink : ''}`}
            >
              Выбор библиотеки
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 