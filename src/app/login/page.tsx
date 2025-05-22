'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import styles from './login.module.css';

type LoginData = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Здесь будет логика авторизации
    console.log('Login data:', loginData);
    // После успешной авторизации перенаправляем пользователя
    // router.push('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>
            {role === 'visitor' ? 'Вход для посетителя' : 'Вход для библиотекаря'}
          </h1>
          
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
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
                placeholder="Введите пароль"
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Войти
            </button>

            <div className={styles.registerLink}>
              Нет аккаунта?{' '}
              <Link href={`/register?role=${role}`}>
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}