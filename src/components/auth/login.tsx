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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FirebaseError } from 'firebase/app';
import MumetIcon from '@/components/icon/icon';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Email tidak valid';
            case 'auth/user-disabled':
                return 'Akun ini dinonaktifkan';
            case 'auth/user-not-found':
                return 'Akun tidak ditemukan';
            case 'auth/wrong-password':
                return 'Password salah';
            case 'auth/invalid-credential':
                return 'Kredensial tidak valid';
            case 'auth/too-many-requests':
                return 'Terlalu banyak percobaan gagal. Coba lagi nanti';
            case 'auth/network-request-failed':
                return 'Gagal terhubung ke jaringan';
            case 'auth/popup-closed-by-user':
                return 'Login dengan Google dibatalkan';
            default:
                return 'Terjadi kesalahan saat login';
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login berhasil!');
            router.push('/');
        } catch (error) {
            if (error instanceof FirebaseError) {
                const errorMessage = getErrorMessage(error.code);
                toast.error(errorMessage);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Terjadi kesalahan saat login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);

        try {
            await signInWithPopup(auth, provider);
            toast.success('Login dengan Google berhasil!');
            router.push('/');
        } catch (error) {
            if (error instanceof FirebaseError) {
                const errorMessage = getErrorMessage(error.code);
                toast.error(errorMessage);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Terjadi kesalahan saat login dengan Google');
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
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #ffffff08' }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.01, 1],
                    y: [0, -2, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="relative w-full max-w-md"
            >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#B51D2A] to-[#8e1620] blur-xl opacity-20 animate-pulse"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-md rounded-2xl bg-[#0f0f0f] border border-[#ffffff08] p-8 shadow-lg"
                >
                    <div className="text-center mb-8">
                        <div className="flex justify-center">
                            <MumetIcon size={175} />
                        </div>
                        <p className="text-gray-400 mt-3">Login untuk melanjutkan ke chat</p>
                    </div>

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
            </motion.div>
        </div>
    );
}