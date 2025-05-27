'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddBookForm from '../../components/AddBookForm';
import { useAuth } from '../../context/AuthContext';
import styles from './page.module.css';

export default function LibrarianDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showAddBookForm, setShowAddBookForm] = useState(false);

  useEffect(() => {
    // Проверяем, авторизован ли пользователь и является ли он библиотекарем
    if (!user || user.role !== 'librarian') {
      router.push('/librarian/login');
    }
  }, [user, router]);

  // Если пользователь не авторизован или не является библиотекарем, не показываем содержимое
  if (!user || user.role !== 'librarian') {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleAddBook = (bookData: {
    title: string;
    author: string;
    year: number;
    genre: string;
    description: string;
  }) => {
    // Здесь будет логика добавления книги в базу данных
    console.log('Новая книга:', bookData);
    alert('Книга успешно добавлена!');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Панель управления библиотекаря</h1>
        <div className={styles.userInfo}>
          <span>{user.firstName}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Всего книг</h3>
            <p>150</p>
          </div>
          <div className={styles.statCard}>
            <h3>Активные брони</h3>
            <p>25</p>
          </div>
          <div className={styles.statCard}>
            <h3>Просроченные</h3>
            <p>3</p>
          </div>
          <div className={styles.statCard}>
            <h3>Читателей</h3>
            <p>45</p>
          </div>
        </div>

        <section className={styles.section}>
          <h2>Последние действия</h2>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <span className={styles.activityTime}>14:30</span>
              <span className={styles.activityText}>Иван Петров забронировал "Война и мир"</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityTime}>13:15</span>
              <span className={styles.activityText}>Анна Сидорова отменила бронь "Мастер и Маргарита"</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityTime}>12:45</span>
              <span className={styles.activityText}>Новая регистрация: Петр Иванов</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Управление каталогом</h2>
          <div className={styles.actionButtons}>
            <button 
              className={styles.actionButton}
              onClick={() => setShowAddBookForm(true)}
            >
              Добавить книгу
            </button>
            <button className={styles.actionButton}>
              Управление читателями
            </button>
            <button className={styles.actionButton}>
              Отчеты
            </button>
          </div>
        </section>
      </main>

      {showAddBookForm && (
        <AddBookForm
          onClose={() => setShowAddBookForm(false)}
          onSubmit={handleAddBook}
        />
      )}
    </div>
  );
} 