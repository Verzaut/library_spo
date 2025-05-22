'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Определяем, куда ведет ссылка логотипа
  const homeLink = user ? '/catalog' : '/';

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href={homeLink} className={styles.logo}>
          Библиотека
        </Link>
        
        {user && (
          <div className={styles.links}>
            <Link
              href="/catalog"
              className={`${styles.link} ${pathname === '/catalog' ? styles.activeLink : ''}`}
            >
              Каталог
            </Link>
            <Link
              href="/profile"
              className={`${styles.link} ${pathname === '/profile' ? styles.activeLink : ''}`}
            >
              Профиль
            </Link>
            <button 
              onClick={logout} 
              className={`${styles.link} ${styles.logoutButton}`}
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </nav>
  );
} 