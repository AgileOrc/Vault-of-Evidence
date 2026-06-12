import React, { useState } from 'react';
import logo from '../assets/logo-05.svg';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import api from '../api/axios'; 
import { useUser } from '../context/UserContext';

function Login() {
    const navigate = useNavigate();
    const { refreshUser } = useUser();

    // State untuk input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State untuk error dari backend dan status loading
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(1),
    });

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            setServerError('Email or password is incorrect.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.status === 200) {
                await refreshUser();
                navigate('/Dashboard');
            }
        } catch {
            setServerError('Email or password is incorrect.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='flex flex-col lg:flex-row min-h-screen justify-center items-center lg:items-start lg:pt-28 xl:pt-20 gap-y-5 md:gap-y-8 bg-linear-to-br from-[#0EB8DF] to-[#0E5998]'>
            {/* Left Side */}
            <section className='flex w-full lg:w-4/7 flex-col items-center lg:items-start justify-center px-6 lg:gap-y-18 lg:px-14 xl:px-20 text-white'>
                {/* Logo */}
                <div>
                    <img 
                        src={logo} 
                        alt='Vault of Evidence Logo' 
                        className='items-center min-h-12 md:min-h-16 lg:min-h-20 xl:min-h-28' />
                </div>
            
                <div className='hidden lg:flex flex-col lg:px-5 xl:px-6 lg:gap-y-3 xl:gap-y-4'>
                    <h1 className='lg:text-3xl xl:text-5xl font-semibold font-montserrat leading-tight'>
                        Your Evidence, <br/> Protected and Organized.
                    </h1>
                    <p className='max-w-xl lg:text-xl xl:text-2xl font-montserrat font-medium text-white'>
                        Centralized storage for findings and <br/> investigation records.
                    </p>
                </div>
            </section>

            {/* Right Side */}
            <section className='flex w-full md:w-xl lg:w-[60vh] xl:w-3/7 items-center justify-center px-10 md:px-12 xl:px-22'>
                <form 
                    onSubmit={handleLoginSubmit} 
                    className='flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8 px-10 py-12 md:px-12 lg:px-14 lg:py-14 xl:px-16 xl:py-18 w-full md:w-xl rounded-4xl lg:rounded-[36px] xl:rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'
                >
                    <div className='flex flex-col gap-y-1'>
                        <h2 className='text-2xl md:text-3xl xl:text-[2.5rem] font-montserrat font-bold text-white'>
                            Welcome Back!
                        </h2>
                        <p className='font-montserrat font-medium text-white text-xs md:text-sm xl:text-lg'>
                            Continue where you left off.
                        </p>
                    </div>
                    

                    {serverError && (
                        <p className='text-sm text-red-300 font-montserrat'>{serverError}</p>
                    )}

                    {/* Email Input */}
                    <div className='flex flex-col gap-y-1 text-xs md:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>Email address</label>
                        <input
                            type='email'
                            placeholder='youremail@mail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full rounded-md md:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 px-1.5 py-1 md:px-2 md:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                            />
                    </div>

                    {/* Password Input */}
                    <div className='flex flex-col gap-y-1 text-xs md:text-sm xl:text-lg'>
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
                            className='w-full rounded-md md:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 px-1.5 py-1 md:px-2 md:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                            />
                    </div>

                    <p className='text-center text-xs md:text-sm xl:text-lg font-montserrat font-medium text-white'>
                        Don't have account?{' '}
                        <Link to='/SignUp' className='font-montserrat font-bold text-white hover:text-[#27D6FF]'>
                            Create one
                        </Link>
                    </p>

                    {/* Sign-In Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-fit rounded-md md:rounded-lg xl:rounded-xl bg-[#41B0EC] shadow-sm shadow-black/2 mx-auto px-3 py-0.5 md:px-4 md:py-1 xl:px-6 xl:py-2 text-center text-sm md:text-md xl:text-xl font-montserrat font-semibold text-white transition-all hover:bg-white hover:text-[#41B0EC] hover:border hover:border-[#41B0EC] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Login;