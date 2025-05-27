'use client';

import AddBookForm from '@/app/components/AddBookForm';
import { useAuth } from '@/app/context/AuthContext';
import { bookService } from '@/app/services/bookService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

type BookActivity = {
  id: string;
  time: string;
  bookTitle: string;
  author: string;
};

export default function LibrarianDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);
  const [recentActivities, setRecentActivities] = useState<BookActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeDashboard = async () => {
      try {
        // Проверяем, авторизован ли пользователь и является ли он библиотекарем
        if (!user || user.role !== 'librarian') {
          router.push('/librarian/login');
          return;
        }

        // Загружаем общее количество книг
        const books = bookService.getAllBooks();
        if (mounted) {
          setTotalBooks(books.length);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeDashboard();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [user, router]);

  // Если идет загрузка, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

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
    try {
      const newBook = bookService.addBook(bookData);
      if (newBook) {
        setTotalBooks(prev => prev + 1);
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        const newActivity: BookActivity = {
          id: newBook.id,
          time: timeString,
          bookTitle: bookData.title,
          author: bookData.author
        };

        setRecentActivities(prev => [newActivity, ...prev].slice(0, 5));
        setShowAddBookForm(false);
        alert('Книга успешно добавлена!');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Произошла ошибка при добавлении книги');
    }
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
            <p>{totalBooks}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Добавлено сегодня</h3>
            <p>{recentActivities.length}</p>
          </div>
        </div>

        <section className={styles.section}>
          <h2>Последние добавленные книги</h2>
          <div className={styles.activityList}>
            {recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <div key={activity.id} className={styles.activityItem}>
                  <span className={styles.activityTime}>{activity.time}</span>
                  <span className={styles.activityText}>
                    Добавлена книга: "{activity.bookTitle}" ({activity.author})
                  </span>
                </div>
              ))
            ) : (
              <div className={styles.noActivities}>
                Сегодня книги ещё не добавлялись
              </div>
            )}
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