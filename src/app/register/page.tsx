'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { libraries } from '../data/libraries';
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
  const libraryId = searchParams.get('library');
  const { login } = useAuth();

  const selectedLibrary = libraries.find(lib => lib.id === libraryId);

  useEffect(() => {
    if (!libraryId || !selectedLibrary) {
      router.push('/');
    }
  }, [libraryId, selectedLibrary, router]);

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    setPasswordError('');

    // Создаем объект пользователя
    const userData = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: 'visitor' as const,
      libraryId: libraryId as string,
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
    
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!selectedLibrary) {
    return null;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>
            Регистрация в библиотеке
          </h1>
          <h2 className={styles.subtitle}>
            {selectedLibrary.name}
          </h2>
          
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
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Минимум 6 символов"
                />
              </div>
              <label className={styles.passwordToggleLabel}>
                <input
                  type="checkbox"
                  className={styles.passwordToggleCheckbox}
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
                Показать пароль
              </label>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Повторите пароль"
                />
              </div>
              <label className={styles.passwordToggleLabel}>
                <input
                  type="checkbox"
                  className={styles.passwordToggleCheckbox}
                  checked={showConfirmPassword}
                  onChange={toggleConfirmPasswordVisibility}
                />
                Показать пароль
              </label>
              {passwordError && (
                <span className={styles.errorText}>{passwordError}</span>
              )}
            </div>

            <button type="submit" className={styles.submitButton}>
              Зарегистрироваться
            </button>

            <div className={styles.loginLink}>
              Уже есть аккаунт?{' '}
              <Link href={`/login?library=${libraryId}`}>
                Войти
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 