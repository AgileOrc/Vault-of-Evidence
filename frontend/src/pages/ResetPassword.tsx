import React, { useState } from 'react';
import logo from '../assets/logo-05.svg';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import api from '../api/axios'; 

function ResetPassword () {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState<{
        email?: string[];
    }>({});

    const resetPasswordSchema = z.object({
        email: z.string()
            .email('Invalid Email Format'),
    });

    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setErrors({});

        const result = resetPasswordSchema.safeParse({ email });
        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        setIsLoading(true);
        try {
            
            const response = await api.post('/auth/resetPassword', { email });

            if (response.status === 201 || response.status === 200) {
                alert('New password created successfully! Please sign in using your new password.');
                navigate('/EmailSent', {
                    state: {email}
                }); 
            }
        } catch (err: any) {
            setServerError(err.response?.data?.error || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='flex min-h-screen justify-center items-center bg-linear-to-br from-[#0EB8DF] to-[#0E5998]'>
            <div className='flex flex-col items-center lg:gap-y-6 xl:gap-y-8'>
                {/* Logo */}
                <div>
                    <img
                        src={logo}
                        alt='Vault of Evidence Logo'
                        className='h-22 lg:h-22 xl:h-34' />
                </div>

                <form
                    onSubmit={handleResetPasswordSubmit}
                    className='flex flex-col lg:gap-y-6 xl:gap-y-10 lg:px-14 lg:py-12 xl:px-14 xl:py-16 w-[90] lg:rounded-[36px] xl:rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'
                >
                    <div className='flex flex-col items-center text-center'>
                        <h2 className='lg:text-3xl xl:text-[2.5rem] font-montserrat font-bold text-white'>
                            Reset Password
                        </h2>

                        <p className='font-montserrat font-medium text-white lg:text-sm xl:text-lg'>
                            Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    {/* Kotak Error Backend (Warna Merah) */}
                    {serverError && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg font-montserrat text-sm">
                            {serverError}
                        </div>
                    )}

                    {/* Email */}
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

                    {/* Send Reset Link Button */}
                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`w-fit lg:rounded-lg xl:rounded-xl bg-[#41B0EC] mx-auto lg:px-6 lg:py-2 xl:px-8 xl:py-3 text-center lg:text-md xl:text-xl font-montserrat font-semibold text-white transition-all hover:bg-white hover:text-[#41B0EC] hover:border hover:border-[#41B0EC] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Checking...' : 'Send Reset Link'}
                    </button>

                    <p className='text-center lg:text-sm xl:text-lg font-montserrat font-medium text-white'>
                        &lt; Go back to{' '}
                        <Link 
                            to='/'
                            className='font-montserrat font-bold text-white hover:text-[#27D6FF]'
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}

export default ResetPassword;