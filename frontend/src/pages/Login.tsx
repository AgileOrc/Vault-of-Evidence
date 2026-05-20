import { useState } from 'react';
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
        password: z.string().min(6, 'Password must have at least 6 characters').regex(
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
                navigate('/dashboard');
            }
        } catch (err: any) {
            // Tangkap penolakan dari server (misal password salah)
            setServerError(err.response?.data?.error || 'Login failed. Cannot connect to server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='flex min-h-screen items-center bg-gradient-to-br from-[#27D6FF] to-[#1767AA]'>
            {/* Logo */}
            <div className='absolute w-64 lg:top-10 lg:left-10 xl:top-12 xl:left-14'>
                <img src={logo} alt='Vault of Evidence Logo' className='md:max-h-12 lg:max-h-20 xl:max-h-28' />
            </div>

            {/* Left Side */}
            <section className='flex w-[57%] flex-col justify-center lg:gap-y-40 lg:px-8 xl:px-14 text-[#F5F5F5]'>
                <div className='flex flex-1 flex-col lg:px-5 xl:px-6 lg:gap-y-3 xl:gap-y-4'>
                    <h1 className='lg:text-4xl xl:text-5xl font-semibold leading-tight'>
                        Your Evidence, <br/> Protected and Organized.
                    </h1>
                    <p className='max-w-xl lg:text-xl xl:text-2xl font-medium text-[#F5F5F5]'>
                        Centralized storage for findings and investigation records.
                    </p>
                </div>
            </section>

            {/* Right Side */}
            <section className='flex w-[43%] items-center lg:px-14 xl:px-20'>
                <form 
                    onSubmit={handleLoginSubmit} 
                    className='flex flex-col lg:gap-y-6 xl:gap-y-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 w-full max-w-xl lg:rounded-[36px] xl:rounded-[40px] border border-[#F5F5F5]/40 bg-[#1767AA]/30 shadow-lg shadow-[#002C49]/20 backdrop-blur-md'
                >
                    <div className='flex flex-col'>
                        <h2 className='lg:text-3xl xl:text-[2.5rem] font-bold text-[#F5F5F5]'>
                            Welcome Back!
                        </h2>
                        <p className='font-medium text-[#F5F5F5] lg:text-sm xl:text-lg'>
                            Continue where you left off.
                        </p>
                    </div>
                    
                    {/* Kotak Error Backend (Warna Merah) */}
                    {serverError && (
                        <div className="bg-[#002C49]/40 border border-[#27D6FF]/40 text-[#F5F5F5] px-4 py-2 rounded-lg text-sm">
                             {serverError}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className='flex flex-col gap-y-1 lg:text-sm xl:text-lg'>
                        <label className='font-medium text-[#F5F5F5]'>Email address</label>
                        <input
                            type='email'
                            placeholder='youremail@mail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-[#F5F5F5] outline-none'
                        />
                        {/* Teks Error Zod (Tepat di bawah input) */}
                        {errors.email && (
                            <p className='text-sm text-[#27D6FF]'>{errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className='flex flex-col gap-y-1 lg:text-sm xl:text-lg'>
                        <div className='flex items-center justify-between'>
                            <label className='font-medium text-[#F5F5F5]'>Password</label>
                            <Link to='/reset-password' className='font-semibold text-[#F5F5F5] hover:text-[#27D6FF]'>
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            type='password'
                            placeholder='******'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-[#F5F5F5] outline-none' 
                        />
                        {/* Teks Error Zod */}
                        {errors.password && (
                            <p className='text-sm text-[#27D6FF]'>{errors.password[0]}</p>
                        )}
                    </div>

                    <p className='text-center lg:text-sm xl:text-lg font-medium text-[#F5F5F5]'>
                        Don't have account?{' '}
                        <Link to='/signup' className='font-bold text-[#F5F5F5] hover:text-[#27D6FF]'>
                            Create one
                        </Link>
                    </p>

                    {/* Sign-In Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-fit lg:rounded-lg xl:rounded-xl bg-[#20A6DA] mx-auto lg:px-4 lg:py-1 xl:px-6 xl:py-2 text-center lg:text-base xl:text-xl font-semibold text-[#F5F5F5] transition-all hover:bg-[#27D6FF] hover:text-[#002C49] hover:border hover:border-[#27D6FF] ${
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