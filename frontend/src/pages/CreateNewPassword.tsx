import logo from '../assets/logo-05.svg';
import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState } from 'react';
import { z } from 'zod';
import api from '../api/axios';

function CreateNewPassword(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState<{
        password?: string[];
        confirmPassword?: string[];
    }>({});

    // Skema Validasi ZOD
    const createNewPasswordSchema = z.object({
        password: z.string().min(12, 'Password must have at least 12 characters').regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/, 'Password must contain letters, numbers, and symbols (@, $, !, %, *, ?, &)'
        ),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Password do not match',
        path: ['confirmPassword'],
    });

    const handleCreateNewPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setErrors({});

        const result = createNewPasswordSchema.safeParse({
            password,
            confirmPassword,
        });

        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        if (!token) {
            setServerError('Invalid or expired link.');
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await api.post('/auth/createNewPassword', {
                token: token,
                password: password,
            });

            if (response.status === 201 || response.status === 200) {
                alert('New Password created successfully! Please sign in using your new password.');
                navigate('/');
            }
        } catch (err: any) {
            setServerError(err.response?.data?.error || 'Failed to create new password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return(
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
                    onSubmit={handleCreateNewPassword}
                    className='flex flex-col lg:gap-y-6 xl:gap-y-10 lg:px-22 lg:py-10 xl:px-22 xl:py-14 w-[90] lg:rounded-[36px] xl:rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'
                >
                    <div className='flex flex-col items-center text-center'>
                        <h2 className='lg:text-3xl xl:text-[2.5rem] font-montserrat font-bold text-white'>
                            Almost there
                        </h2>

                        <p className='font-montserrat font-medium text-white lg:text-sm xl:text-lg'>
                            Create a strong password to keep your <br /> workspace secure.
                        </p>
                    </div>

                    {serverError && (
                        <div className='bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg font-montserrat text-sm'>
                            {serverError}
                        </div>
                    )}

                    {/* Password Input */}
                    <div className='flex flex-col gap-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>New Password</label>
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
                        <label className='font-montserrat font-medium text-white'>Confirm New Password</label>
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

                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`w-fit lg:rounded-lg xl:rounded-xl bg-[#41B0EC] mx-auto lg:px-4 lg:py-1 xl:px-6 xl:py-2 text-center lg:text-md xl:text-xl font-montserrat font-semibold text-white transition-all hover:bg-white hover:text-[#41B0EC] hover:border hover:border-[#41B0EC] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </main>
    )

}

export default CreateNewPassword;