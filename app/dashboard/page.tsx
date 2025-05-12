'use client';

import { useEffect, useState } from 'react';
import { getUser } from '../actions/getUser';

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };

    fetchUser();
  }, []);

  if (!user) {
    return <p>読み込み中…</p>;
  }

  return (
    <div>
      <h1>ようこそ、{user.name}さん！</h1>
    </div>
  );
};

export default DashboardPage;
