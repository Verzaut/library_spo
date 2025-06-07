import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, libraryId } = await request.json();

    // Check if librarian already exists
    const existingLibrarian = await prisma.librarian.findUnique({
      where: {
        email,
      },
    });

    if (existingLibrarian) {
      return NextResponse.json(
        { error: 'Библиотекарь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new librarian
    const librarian = await prisma.librarian.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        libraryId,
        role: 'librarian',
      },
    });

    // Return librarian data without password
    const { password: _, ...librarianData } = librarian;
    return NextResponse.json(librarianData);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
} 