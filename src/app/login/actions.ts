'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, SESSION_VALUE } from '@/lib/auth';

const TOKEN = 'SuperPippo69@@';

export async function loginAction(formData: FormData) {
  const token = formData.get('token') as string;

  if (token !== TOKEN) {
    redirect('/login?error=1');
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  redirect('/');
}
