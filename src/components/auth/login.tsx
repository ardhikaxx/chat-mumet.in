'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during Google login');
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md rounded-2xl bg-[#0f0f0f] border border-[#ffffff08] p-8 shadow-lg"
            >
                <div className="text-center mb-8">
                    <motion.h1
                        className="text-3xl font-bold mb-2 text-white"
                        animate={{
                            textShadow: [
                                "0 0 0px rgba(255,255,255,0)",
                                "0 0 5px rgba(255,255,255,0.2)",
                                "0 0 0px rgba(255,255,255,0)"
                            ]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        mumet<span className="text-[#B51D2A]">.in</span>
                    </motion.h1>
                    <p className="text-gray-400">Login untuk melanjutkan ke chat</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@contoh.com"
                            className="w-full bg-[#0a0a0a] border border-[#ffffff08] text-white"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Password
                        </label>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#0a0a0a] border border-[#ffffff08] text-white pr-10"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-400 hover:text-gray-300 opacity-40"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className="h-6 w-6" />
                            ) : (
                                <Eye className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#B51D2A] to-[#8e1620] hover:from-[#8e1620] hover:to-[#B51D2A]"
                    >
                        {loading ? 'Memproses...' : 'Login'}
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#0f0f0f] text-gray-400">atau</span>
                    </div>
                </div>

                <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="w-full bg-[#0a0a0a] border border-[#ffffff08] text-white hover:bg-[#1a1a1a]"
                    disabled={loading}
                >
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Continue with Google
                </Button>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Belum punya akun?{' '}
                    <Link href="/register" className="text-[#B51D2A] hover:underline">
                        Daftar disini
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}