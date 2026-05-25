import React, { useState } from 'react';
import logo from '../assets/logo-05.svg';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import api from '../api/axios'; 

function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    
    const [errors, setErrors] = useState<{
        username?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    }>({});

   
    const signupSchema = z.object({
        username: z.string()
            .min(3, 'Username must be at least 3 characters')
            .regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric (no spaces or symbols)'), // Mencegah error 400 dari backend Gin
        email: z.string()
            .email('Invalid Email Format'),
        password: z.string()
            .min(12, 'Password must have at least 12 characters')
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/, 'Password must contain letters, numbers, and symbols (@, $, !, %, *, ?, &)'),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

    
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setErrors({});

       
        const result = signupSchema.safeParse({
            username,
            email,
            password,
            confirmPassword,
        });

        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        
        setIsLoading(true);
        try {
            
            const response = await api.post('/auth/signup', {
                username: username,
                email: email,
                password: password,
            });

            if (response.status === 201 || response.status === 200) {
                alert('Account created successfully! Please sign in.');
                navigate('/'); 
            }
        } catch (err: any) {
            
            setServerError(err.response?.data?.error || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='flex flex-col lg:flex-row min-h-screen justify-center items-center lg:items-start lg:pt-28 xl:pt-16 gap-y-5 md:gap-y-8 bg-linear-to-br from-[#0EB8DF] to-[#0E5998]'>

            {/* Left Side */}
            <section className='flex w-full lg:w-4/7 flex-col items-center lg:items-start justify-center px-6 lg:gap-y-24 lg:px-14 xl:px-20 text-white'>
                {/* Logo */}
                <div>
                    <img 
                        src={logo} 
                        alt='Vault of Evidence Logo' 
                        className='items-center min-h-12 md:min-h-16 lg:min-h-20 xl:min-h-28 object-contain' />
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
            <section className='flex w-full md:w-xl lg:w-[60vh] xl:w-3/7 max-h-screen items-center justify-center px-10 md:px-12 lg:px-12 xl:px-18'>
                <form 
                    onSubmit={handleSignupSubmit}
                    className='flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-4 xl:gap-y-4 px-10 py-12 md:px-12 lg:px-10 lg:py-12 xl:px-14 xl:py-14 w-full md:w-xl rounded-4xl lg:rounded-[36px] xl:rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'
                >
                    <div className='flex flex-col gap-y-1'>
                        <h2 className='text-2xl md:text-3xl xl:text-[2.5rem] font-montserrat font-bold text-white'>
                            Get Started
                        </h2>
                        <p className='font-montserrat font-medium text-white text-xs md:text-sm xl:text-lg'>
                            Create your secure workspace.
                        </p>
                    </div>

                    {/* Alert Error dari Backend */}
                    {serverError && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg font-montserrat text-sm">
                             {serverError}
                        </div>
                    )}

                    {/* Username Input (Menggantikan Full Name) */}
                    <div className='flex flex-col gap-y-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>Username</label>
                        <input
                            type='text' 
                            placeholder='pentester01'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                        />
                        {errors.username && (
                            <p className='text-sm text-red-300'>{errors.username[0]}</p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div className='flex flex-col gap-y-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>Email</label>
                        <input
                            type='email'
                            placeholder='youremail@gmail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                        />
                        {errors.email && (
                            <p className='text-sm text-red-300'>{errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className='flex flex-col gap-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>Password</label>
                        <input
                            type='password'
                            placeholder='******'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                        />
                        {errors.password && (
                            <p className='text-sm text-red-300'>{errors.password[0]}</p>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className='flex flex-col gap-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>Confirm Password</label>
                        <input
                            type='password'
                            placeholder='******'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                        />
                        {errors.confirmPassword && (
                            <p className='text-sm text-red-300'>{errors.confirmPassword[0]}</p>
                        )}
                    </div>

                    {/* Tautan Login */}
                    <p className='text-center lg:text-sm xl:text-lg font-montserrat font-medium text-white'>
                        Already have an account?
                        <Link to='/' className='px-1 font-montserrat font-bold text-white hover:text-[#27D6FF]'>
                            Sign in
                        </Link>
                    </p>

                    {/* Sign-Up Button (Diubah jadi type='submit') */}
                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`w-fit lg:rounded-lg xl:rounded-xl bg-[#41B0EC] mx-auto lg:px-4 lg:py-1 xl:px-6 xl:py-2 text-center lg:text-md xl:text-xl font-montserrat font-semibold text-white transition-all hover:bg-white hover:text-[#41B0EC] hover:border hover:border-[#41B0EC] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>                
            </section>
        </main>
    );
}

export default Signup;