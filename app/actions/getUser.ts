'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  try {
    const res = await axios.get('http://localhost:80/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (e) {
    return null;
  }
}
