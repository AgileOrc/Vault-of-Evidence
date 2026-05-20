import { useState } from 'react';
import logo from '../assets/logo-05.svg';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Info } from 'lucide-react';

function EmailSent () {
    const location = useLocation();

    const email = location.state?.email || 'youremail@gmail.com';
    
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleResendLink = async () => {
        setServerError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/resetPassword', { email });
            
            if (response.status === 201 || response.status === 200) {
                alert('Reset link resent successfully.');
            }

        } catch (err: any) {
            setServerError(err.response?.data?.error || 'Failed to resend link. Please try again.');
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

                <div className='flex w-full max-w-xl flex-col gap-6 rounded-[36px] border border-[#F5F5F5]/40 bg-[#1767AA]/30 px-10 py-12 text-[#F5F5F5] shadow-lg shadow-[#002C49]/20 backdrop-blur-md'>
                    <div className='flex flex-col items-center text-center gap-y-2'>
                        <h2 className='text-3xl font-semibold'>Email sent</h2>

                        <p className='text-sm opacity-90'>
                            Please check your email, we sent a reset link to{' '}
                            <span className='font-semibold'>{email}</span>
                        </p>
                    </div>

                    <div className='flex items-center gap-3 rounded-xl border border-[#F5F5F5]/30 bg-[#002C49]/30 px-4 py-3 text-sm'>
                        <Info className='h-5 w-5' />
                        <p>
                            Link expires in 15 minutes. Check your spam folder if you do not see it.
                        </p>
                    </div>

                    {serverError && (
                        <div className='rounded-lg border border-[#27D6FF]/40 bg-[#002C49]/40 px-4 py-2 text-sm text-[#F5F5F5]'>
                            {serverError}
                        </div>
                    )}

                    <button
                        type='button'
                        onClick={handleResendLink}
                        disabled={isLoading}
                        className={`mx-auto w-fit rounded-lg bg-[#20A6DA] px-8 py-2 text-sm font-semibold text-[#F5F5F5] transition-all hover:bg-[#27D6FF] hover:text-[#002C49] hover:border hover:border-[#27D6FF] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Checking...' : 'Resend Link' }
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
                </div>
            </div>
        </main>
    );
}

export default EmailSent;