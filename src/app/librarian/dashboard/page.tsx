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
  type?: string;
};

export default function LibrarianDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);
  const [recentActivities, setRecentActivities] = useState<BookActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState<Array<{ id: string; title: string; author: string }>>([]);

  useEffect(() => {
    let mounted = true;

    const initializeDashboard = async () => {
      try {
        if (!user || user.role !== 'librarian') {
          router.push('/librarian/login');
          return;
        }

        const allBooks = bookService.getAllBooks();
        if (mounted) {
          setBooks(allBooks);
          setTotalBooks(allBooks.length);
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

  const handleDeleteBook = (bookId: string) => {
    try {
      const success = bookService.deleteBook(bookId);
      if (success) {
        setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
        setTotalBooks(prev => prev - 1);
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        const deletedBook = books.find(book => book.id === bookId);
        if (deletedBook) {
          const newActivity: BookActivity = {
            id: `delete-${bookId}`,
            time: timeString,
            bookTitle: deletedBook.title,
            author: deletedBook.author,
            type: 'delete'
          };

          setRecentActivities(prev => [newActivity, ...prev].slice(0, 5));
        }
        
        alert('Книга успешно удалена!');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Произошла ошибка при удалении книги');
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
            <p>{recentActivities.filter(activity => !activity.type || activity.type === 'add').length}</p>
          </div>
        </div>

        <section className={styles.section}>
          <h2>Последние действия</h2>
          <div className={styles.activityList}>
            {recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <div key={activity.id} className={styles.activityItem}>
                  <span className={styles.activityTime}>{activity.time}</span>
                  <span className={styles.activityText}>
                    {activity.type === 'delete' 
                      ? `Удалена книга: "${activity.bookTitle}" (${activity.author})`
                      : `Добавлена книга: "${activity.bookTitle}" (${activity.author})`
                    }
                  </span>
                </div>
              ))
            ) : (
              <div className={styles.noActivities}>
                Действий пока не было
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

        <section className={styles.section}>
          <h2>Список книг</h2>
          <div className={styles.booksList}>
            {books.length > 0 ? (
              books.map(book => (
                <div key={book.id} className={styles.bookItem}>
                  <div className={styles.bookInfo}>
                    <span className={styles.bookTitle}>{book.title}</span>
                    <span className={styles.bookAuthor}>{book.author}</span>
                  </div>
                  <button
                    className={styles.deleteBookButton}
                    onClick={() => handleDeleteBook(book.id)}
                    title="Удалить книгу"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.noBooks}>
                В библиотеке пока нет книг
              </div>
            )}
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