"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// XSRF-TOKENをリクエスト時に送信するための設定
const http = axios.create({
  baseURL: 'http://localhost:80',
  withCredentials: true,
  withXSRFToken: true,
});

const Test = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [user, setUser] = useState<any>(null);

    const postData = async () => {
        try {
            // CSRF Cookieを取得
            await axios.get('http://localhost:80/sanctum/csrf-cookie', { withCredentials: true });
                
            // ログインリクエスト
            const res = await http.post('/api/login', {email, password}, { withCredentials: true });
            console.log('ログイン成功:', res);

            const accessToken = res.data.token;
            setToken(accessToken);  // トークンを保存

            // トークンを使ってユーザー情報を取得
            const userRes = await http.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            console.log('ユーザー情報:', userRes.data);
            setUser(userRes.data);  // ユーザー情報を保存
        } catch (error) {
            console.error('ログインまたはユーザー情報取得エラー', error);
        }
    }

    return (
        <div>
            <input
                type="text"
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm'
                placeholder='email'
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            /><br/>
            <input
                type="text"
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm'
                placeholder='password'
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <div>
                <button
                    className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-3"
                    onClick={()=>{
                        postData();
                    }}
                >送信</button>
            </div>

            {user && (
                <div className='m-3 p-3 bg-green-100 rounded'>
                    <h3 className='font-bold'>ユーザー情報</h3>
                    <p><strong>ID:</strong>{user.id}</p>
                    <p><strong>名前:</strong>{user.name}</p>
                    <p><strong>Email:</strong>{user.email}</p>
                </div>
            )}
        </div>
    );
}

export default Test;
