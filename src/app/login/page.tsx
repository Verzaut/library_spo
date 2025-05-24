'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { libraries } from '../data/libraries';
import styles from './login.module.css';

type LoginData = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const libraryId = searchParams.get('library');

  const selectedLibrary = libraries.find(lib => lib.id === libraryId);

  useEffect(() => {
    if (!libraryId || !selectedLibrary) {
      router.push('/');
    }
  }, [libraryId, selectedLibrary, router]);

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Здесь будет логика авторизации
    console.log('Login data:', loginData);
    // После успешной авторизации перенаправляем пользователя
    // router.push('/catalog');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!selectedLibrary) {
    return null;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>
            Вход в библиотеку
          </h1>
          <h2 className={styles.subtitle}>
            {selectedLibrary.name}
          </h2>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Электронная почта</label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
                placeholder="example@mail.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                  placeholder="Введите пароль"
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

            <button type="submit" className={styles.submitButton}>
              Войти
            </button>

            <div className={styles.registerLink}>
              Нет аккаунта?{' '}
              <Link href={`/register?library=${libraryId}`}>
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
