'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './register.module.css';

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  age: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as 'visitor' | 'librarian';
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    setPasswordError('');

    // Создаем объект пользователя
    const userData = {
      id: Date.now().toString(), // В реальном приложении ID будет генерироваться на сервере
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: role,
    };

    // Сохраняем пользователя в контекст
    login(userData);

    // Перенаправляем на страницу каталога
    router.push('/catalog');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Сбрасываем ошибку при изменении любого из паролей
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>
            {role === 'visitor' ? 'Регистрация посетителя' : 'Регистрация библиотекаря'}
          </h1>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">Имя</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Введите ваше имя"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Фамилия</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Введите вашу фамилию"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">Телефон</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+7 (___) ___-__-__"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Электронная почта</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@mail.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="age">Возраст</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                max="120"
                placeholder="Введите ваш возраст"
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
                minLength={6}
                placeholder="Минимум 6 символов"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Повторите пароль"
              />
              {passwordError && (
                <span className={styles.errorText}>{passwordError}</span>
              )}
            </div>

            <button type="submit" className={styles.submitButton}>
              Зарегистрироваться
            </button>

            <div className={styles.loginLink}>
              Уже есть аккаунт?{' '}
              <Link href={`/login?role=${role}`}>
                Войти
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 