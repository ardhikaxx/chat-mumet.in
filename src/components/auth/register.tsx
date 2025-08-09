'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
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

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'Email sudah digunakan';
            case 'auth/invalid-email':
                return 'Email tidak valid';
            case 'auth/weak-password':
                return 'Password terlalu lemah (minimal 6 karakter)';
            case 'auth/operation-not-allowed':
                return 'Operasi tidak diizinkan';
            case 'auth/network-request-failed':
                return 'Gagal terhubung ke jaringan';
            case 'auth/popup-closed-by-user':
                return 'Pendaftaran dengan Google dibatalkan';
            case 'auth/invalid-credential':
                return 'Kredensial tidak valid';
            default:
                return 'Terjadi kesalahan saat mendaftar';
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });
            toast.success('Pendaftaran berhasil!');
            router.push('/');
        } catch (error) {
            if (error instanceof FirebaseError) {
                const errorMessage = getErrorMessage(error.code);
                toast.error(errorMessage);
            } else {
                toast.error('Terjadi kesalahan yang tidak diketahui');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setLoading(true);

        try {
            await signInWithPopup(auth, provider);
            toast.success('Pendaftaran dengan Google berhasil!');
            router.push('/');
        } catch (error) {
            if (error instanceof FirebaseError) {
                const errorMessage = getErrorMessage(error.code);
                toast.error(errorMessage);
            } else {
                toast.error('Terjadi kesalahan yang tidak diketahui');
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
                    className="relative w-full rounded-2xl bg-[#0f0f0f] border border-[#ffffff08] p-8 shadow-lg"
                >
                    <div className="text-center mb-8 text-white">
                        <div className="flex justify-center">
                            <MumetIcon size={175} />
                        </div>
                        <p className="text-gray-400 mt-3">Buat akun baru kamu disini</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                Nama
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nama Anda"
                                className="w-full bg-[#0a0a0a] border border-[#ffffff08] text-white"
                                required
                            />
                        </div>

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
                                minLength={6}
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
                            {loading ? 'Memproses...' : 'Daftar'}
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
                        onClick={handleGoogleRegister}
                        variant="outline"
                        className="w-full bg-[#0a0a0a] border border-[#ffffff08] text-white hover:bg-[#1a1a1a]"
                        disabled={loading}
                    >
                        <FcGoogle className="mr-2 h-4 w-4" />
                        Continue with Google
                    </Button>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="text-[#B51D2A] hover:underline">
                            Login disini
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}