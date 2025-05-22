'use client'; // Важно для использования хуков

import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Добро пожаловать в библиотеку</h1>
        
        <div className={styles.roleSelection}>
          <Link href="/login?role=librarian" className={styles.roleCard}>
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>👨‍💼</span>
            </div>
            <h2>Библиотекарь</h2>
            <p>Вход для сотрудников библиотеки</p>
            <span className={styles.note}>Только для авторизованных сотрудников</span>
          </Link>

          <Link href="/register?role=visitor" className={styles.roleCard}>
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>👤</span>
            </div>
            <h2>Посетитель</h2>
            <p>Вход для читателей</p>
            <span className={styles.note}>Доступна регистрация новых пользователей</span>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Моя библиотека</p>
      </footer>
    </div>
  );
}