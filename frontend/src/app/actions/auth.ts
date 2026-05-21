'use server'

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || 'Login failed' };
    }

    // Await the cookies() before calling set() in Next 15+, wait Next.js 14 App Router
    // Wait, in Next 14, `cookies()` is synchronous but its methods work. Actually in Next 14 cookies() is a function returning ReadonlyRequestCookies. We can mutate using the same but for actions it allows set.
    const cookieStore = await cookies();
    cookieStore.set('jwt', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('jwt');
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('jwt')?.value;
}
