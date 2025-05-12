'use server';

import { cookies } from 'next/headers';
import axios from 'axios';
import { promises } from 'dns';

type LoginResult =
  | { success: true }
  | { success: false; error: string };

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    // CSRF Cookie を取得（必要なら）
    await axios.get('http://localhost:80/sanctum/csrf-cookie', { withCredentials: true });

    // ログインリクエスト
    const res = await axios.post(
      'http://localhost:80/api/login',
      { email, password },
      { withCredentials: true }
    );

    const token = res.data.token;

    // HttpOnly で Cookie に保存（フロントからは読み出せない）
    const cookieStore = await cookies();
    cookieStore.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1日
    });

    return { success: true };
  } catch (err: any) {
    console.error('Login error', err);
    return { success: false, error: 'ログインに失敗しました' };
  }
}
