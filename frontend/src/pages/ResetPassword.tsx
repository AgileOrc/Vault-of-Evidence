import { useState } from 'react';
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
                navigate('/email-sent', {
                    state: { email }
                });
            }
        } catch (err: any) {
            setServerError(err.response?.data?.error || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#27D6FF] to-[#1767AA] px-6'>
            <div className='flex flex-col items-center gap-6'>
                <div>
                    <img
                        src={logo}
                        alt='Vault of Evidence Logo'
                        className='h-16 lg:h-20 xl:h-24'
                    />
                </div>

                <form
                    onSubmit={handleResetPasswordSubmit}
                    className='flex w-full max-w-xl flex-col gap-6 rounded-[36px] border border-[#F5F5F5]/40 bg-[#1767AA]/30 px-10 py-12 text-[#F5F5F5] shadow-lg shadow-[#002C49]/20 backdrop-blur-md'
                >
                    <div className='flex flex-col items-center text-center'>
                        <h2 className='text-3xl font-semibold'>Reset Password</h2>

                        <p className='mt-2 text-sm opacity-90'>
                            Enter your email and we will send you a reset link.
                        </p>
                    </div>

                    {serverError && (
                        <div className='rounded-lg border border-[#27D6FF]/40 bg-[#002C49]/40 px-4 py-2 text-sm text-[#F5F5F5]'>
                            {serverError}
                        </div>
                    )}

                    <div className='flex flex-col gap-y-1 text-sm'>
                        <label className='font-semibold'>Email address</label>
                        <input
                            type='email'
                            placeholder='youremail@mail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full rounded-lg border border-[#27D6FF] bg-[#002C49]/50 px-4 py-2 text-[#F5F5F5] outline-none'
                        />
                        {errors.email && (
                            <p className='text-xs text-[#27D6FF]'>{errors.email[0]}</p>
                        )}
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`mx-auto w-fit rounded-lg bg-[#20A6DA] px-6 py-2 text-sm font-semibold text-[#F5F5F5] transition-all hover:bg-[#27D6FF] hover:text-[#002C49] hover:border hover:border-[#27D6FF] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Checking...' : 'Send Reset Link'}
                    </button>

                    <p className='text-center text-sm'>
                        &lt; Go back to{' '}
                        <Link
                            to='/'
                            className='font-semibold text-[#F5F5F5] hover:text-[#27D6FF]'
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