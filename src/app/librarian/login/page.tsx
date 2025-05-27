'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './page.module.css';

export default function LibrarianLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Проверяем учетные данные библиотекаря
    if (formData.username === 'Библиотекарь' && formData.password === 'Библиотека') {
      // Создаем объект пользователя-библиотекаря
      const librarianData = {
        id: 'librarian-1',
        firstName: 'Библиотекарь',
        lastName: '',
        email: 'librarian@library.com',
        role: 'librarian' as const,
        libraryId: 'main-library'
      };

      login(librarianData);
      router.push('/librarian/dashboard');
    } else {
      setError('Неверное имя пользователя или пароль');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Вход для библиотекарей</h1>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.inputGroup}>
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Введите имя пользователя"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Введите пароль"
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Войти
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 