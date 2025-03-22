// app/login/page.tsx
"use client";

import { useState } from 'react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (data.error) {
            setError(data.error);
        } else {
            window.location.href = '/dashboard'; // Redirect after successful login
        }
    };

    return (
        <>
            <div className="login-page">
                <div className="login-container">
                    <div className="login-form">
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Nazwa Użytkownika"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Hasło"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit">Login</button>
                        </form>
                        <p>
                            Nie masz jeszcze konta? <a href="/register">Zarejestruj sie</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}