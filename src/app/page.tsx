'use client'; // Важно для использования хуков

import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Добро пожаловать в библиотечную систему</h1>
        
        <div className={styles.roleSelection}>
          <Link href="/libraries?role=reader" className={styles.roleCard}>
            <div className={styles.roleIcon}>👤</div>
            <h2>Читатель</h2>
            <p>Поиск и бронирование книг, управление заказами</p>
          </Link>
          
          <Link href="/libraries?role=librarian" className={styles.roleCard}>
            <div className={styles.roleIcon}>👨‍💼</div>
            <h2>Библиотекарь</h2>
            <p>Управление библиотекой, каталогом и читателями</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Моя библиотека</p>
      </footer>
    </div>
  );
}