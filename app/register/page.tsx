'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/session');
                const data = await res.json();
                if (res.ok && data.loggedIn) {
                    router.replace('/dashboard');
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error('Failed to check session', err);
                setLoading(false);
            }
        };
        checkSession();
    }, [router]);

    if (loading) return null;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
            router.push('/login');
        } else {
            setError(data.message || 'Rejestracja nie powiodła się.');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/pic.jpg')" }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Form container */}
            <div className="relative z-10 max-w-md w-full p-6 bg-white bg-opacity-90 backdrop-blur rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Rejestracja</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleRegister}>
                    <input
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Zarejestruj się
                    </button>
                </form>
            </div>
        </div>
    )
}