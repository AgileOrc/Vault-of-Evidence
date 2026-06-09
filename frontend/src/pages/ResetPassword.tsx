import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
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
            <div className='flex flex-col items-center gap-y-2 md:gap-y-4 lg:gap-y-6 xl:gap-y-8'>
                {/* Logo */}
                <div>
                    <img
                        src={logo}
                        alt='Vault of Evidence Logo'
                        className='items-center min-h-12 md:min-h-16 lg:min-h-20 xl:min-h-28' />
                </div>

                <form
                    onSubmit={handleResetPasswordSubmit}
                    className='flex flex-col gap-y-3 md:gap-y-4 lg:gap-y-6 xl:gap-y-8 px-10 py-8 md:px-12 md:py-10 lg:px-14 lg:py-12 xl:px-14 xl:py-16 w-84 md:w-auto rounded-3xl lg:rounded-[36px] xl:rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'
                >
                    <div className='flex flex-col items-center text-center'>
                        <h2 className='text-2xl md:text-3xl xl:text-[2.5rem] font-montserrat font-bold text-white'>
                            Reset Password
                        </h2>

                        <p className='font-montserrat font-medium text-white text-xs md:text-sm xl:text-lg'>
                            Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    {/* Kotak Error Backend (Warna Merah) */}
                    {serverError && (
                        <div className="text-white px-4 py-2 font-montserrat text-sm">
                            {serverError}
                        </div>
                    )}

                    {/* Email */}
                    <div className='flex flex-col gap-y-0.5 md:gap-y-1 text-xs md:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>Email address</label>
                        <input
                            type='email'
                            placeholder='youremail@mail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full rounded-sm md:rounded-md lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 py-1 px-2 md:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                        />
                        {/* Teks Error Zod (Tepat di bawah input) */}
                        {errors.email && (
                            <p className='text-sm text-white'>{errors.email[0]}</p>
                        )}
                    </div>

                    {/* Send Reset Link Button */}
                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`w-fit rounded-md lg:rounded-lg xl:rounded-xl bg-[#41B0EC] shadow-sm mx-auto px-4 py-1.5 md:px-6 md:py-2 xl:px-8 xl:py-3 text-center text-sm md:text-md xl:text-xl font-montserrat font-semibold text-white transition-all hover:bg-white hover:text-[#41B0EC] hover:border hover:border-[#41B0EC] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Checking...' : 'Send Reset Link'}
                    </button>
                    
                    <Link to='/' className='font-montserrat font-semibold text-white hover:text-[#27D6FF]'>
                        <p className='flex items-center justify-center text-center text-xs md:text-sm xl:text-lg font-montserrat font-medium text-white'>
                            <ChevronLeft className='h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7' />
                            Go back to Sign In
                        </p>
                    </Link>
                </form>
            </div>
        </main>
    );
}

export default ResetPassword;