'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { user, logout } = useAuth();

  // Не показываем навигацию для библиотекаря
  

  return (
    <nav className={styles.navigation}>
      <Link href="/libraries" className={styles.logo}>
        Библиотека
      </Link>
      <div className={styles.navLinks}>
        <Link href="/catalog" className={styles.navLink}>
          Каталог
        </Link>
        <Link href="/profile" className={styles.navLink}>
          Профиль
        </Link>
        <button onClick={logout} className={styles.logoutButton}>
          Выйти
        </button>
      </div>
    </nav>
  );
} 