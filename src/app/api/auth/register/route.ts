import pool from '@/app/config/database';
import { UserRegistrationData } from '@/app/types/user';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body: UserRegistrationData = await request.json();
    
    // Проверка существования пользователя
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [body.email]
    );

    if (userExists.rows.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Создание пользователя
    const result = await pool.query(
      `INSERT INTO users (
        email, password_hash, role, first_name, last_name, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, email, role, first_name, last_name`,
      [body.email, hashedPassword, body.role, body.firstName, body.lastName]
    );

    const user = result.rows[0];

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
} 