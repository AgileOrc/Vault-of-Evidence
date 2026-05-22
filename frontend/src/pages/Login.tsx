import React, { useState } from 'react';
import logo from '../assets/logo-05.svg';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import api from '../api/axios'; 

function Login() {
    const navigate = useNavigate();

    // State untuk input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State untuk error dari backend dan status loading
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // State untuk error validasi Zod dari frontend
    const [errors, setErrors] = useState<{
        email?: string[];
        password?: string[];
    }>({});

    // Skema Validasi ZOD
    const loginSchema = z.object({
        email: z.string().email('Invalid Email Format'),
        password: z.string().min(12, 'Password must have at least 12 characters').regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/, 'Password must contain letters, numbers, and symbols (@, $, !, %, *, ?, &)'
        ),
    });

    // Fungsi Utama Submit
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(''); // Reset error backend
        setErrors({});      // Reset error zod

        // 1. LAPIS PERTAMA: Validasi Frontend dengan Zod
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            // Jika format salah, tampilkan pesan error Zod di bawah input dan hentikan proses
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        // 2. LAPIS KEDUA: Validasi Backend dengan Axios
        setIsLoading(true);
        try {
            // Tembak API login
            const response = await api.post('/auth/login', { email, password });

            if (response.status === 200) {
                // Jika sukses, baru arahkan ke Dashboard
                navigate('/Dashboard');
            }
        } catch (err: any) {
            // Tangkap penolakan dari server (misal password salah)
            setServerError(err.response?.data?.error || 'Login failed. Cannot connect to server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='flex min-h-screen items-start pt-20 bg-linear-to-br from-[#0EB8DF] to-[#0E5998]'>
            {/* Left Side */}
            <section className='flex w-4/7 flex-col justify-center lg:gap-y-18 lg:px-14 xl:px-20 text-white'>

                {/* Logo */}
                <div>
                    <img 
                        src={logo} 
                        alt='Vault of Evidence Logo' 
                        className='md:max-h-16 lg:max-h-22 xl:max-h-32' />
                </div>
            
                <div className='flex flex-col lg:px-5 xl:px-6 lg:gap-y-3 xl:gap-y-4'>
                    <h1 className='lg:text-4xl xl:text-5xl font-semibold font-montserrat leading-tight'>
                        Your Evidence, <br/> Protected and Organized.
                    </h1>
                    <p className='max-w-xl lg:text-xl xl:text-2xl font-montserrat font-medium text-white'>
                        Centralized storage for findings and <br/> investigation records.
                    </p>
                </div>
            </section>

            {/* Right Side - Diperbaiki pembukaan dan penutupan tag Form */}
            <section className='flex w-3/7 items-center lg:px-14 xl:px-22'>
                <form 
                    onSubmit={handleLoginSubmit} 
                    className='flex flex-col lg:gap-y-8 xl:gap-y-12 lg:px-12 lg:py-14 xl:px-16 xl:py-18 w-xl max-w-xl lg:rounded-[36px] xl:rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'
                >
                    <div className='flex flex-col'>
                        <h2 className='lg:text-3xl xl:text-[2.5rem] font-montserrat font-bold text-white'>
                            Welcome Back!
                        </h2>
                        <p className='font-montserrat font-medium text-white lg:text-sm xl:text-lg'>
                            Continue where you left off.
                        </p>
                    </div>
                    
                    {/* Kotak Error Backend (Warna Merah) */}
                    {serverError && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg font-montserrat text-sm">
                             {serverError}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className='flex flex-col gap-y-1 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>Email address</label>
                        <input
                            type='email'
                            placeholder='youremail@mail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                        />
                        {/* Teks Error Zod (Tepat di bawah input) */}
                        {errors.email && (
                            <p className='text-sm text-red-300'>{errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className='flex flex-col gap-y-1 lg:text-sm xl:text-lg'>
                        <div className='flex items-center justify-between'>
                            <label className='font-montserrat font-medium text-white'>Password</label>
                            <Link to='/ResetPassword' className='font-montserrat font-semibold text-white hover:text-[#27D6FF]'>
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            type='password'
                            placeholder='******'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none' 
                        />
                        {/* Teks Error Zod */}
                        {errors.password && (
                            <p className='text-sm text-red-300'>{errors.password[0]}</p>
                        )}
                    </div>

                    <p className='text-center lg:text-sm xl:text-lg font-montserrat font-medium text-white'>
                        Don't have account?{' '}
                        <Link to='/SignUp' className='font-montserrat font-bold text-white hover:text-[#27D6FF]'>
                            Create one
                        </Link>
                    </p>

                    {/* Sign-In Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-fit lg:rounded-lg xl:rounded-xl bg-[#41B0EC] mx-auto lg:px-4 lg:py-1 xl:px-6 xl:py-2 text-center lg:text-md xl:text-xl font-montserrat font-semibold text-white transition-all hover:bg-white hover:text-[#41B0EC] hover:border hover:border-[#41B0EC] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Checking...' : 'Sign In'}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Login;