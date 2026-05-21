import logo from '../assets/logo-05.svg';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios'; 

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
        <main className='flex min-h-screen justify-center items-center bg-linear-to-br from-[#27D6FF] to-[#1767AA]'>
            <div className='flex flex-col items-center lg:gap-y-6 xl:gap-y-8'>
                {/* Logo */}
                <div>
                    <img
                        src={logo}
                        alt='Vault of Evidence Logo'
                        className='h-22 lg:h-22 xl:h-34' />
                </div>

                {/* Email Sent (the box) */}
                <div className='flex flex-col lg:gap-y-8 xl:gap-y-12 lg:px-12 lg:py-12 xl:px-12 xl:py-16 w-[85%] max-w-xl lg:rounded-[36px] xl:rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'>
                    
                    <div className='flex flex-col items-center text-center gap-y-1'>
                        <h2 className='lg:text-4xl xl:text-[3.5rem] font-montserrat font-bold text-white'>
                            Email sent
                        </h2>

                        <p className='font-montserrat font-normal text-white lg:text-sm xl:text-lg'>
                            Please check your email, we sent a reset link to{' '}
                            <span className='font-semibold'>
                                {email}
                            </span>
                        </p>
                    </div>

                    {/* Info */}
                    <div className='flex justify-center w-full'>

                        <div className='flex items-center justify-center gap-x-3 text-white max-w-lg'>
                            {/* Icon */}
                            <div className='flex items-center justify-center min-w-10 h-10 rounded-full border-3 border-white text-2xl'>
                                i
                            </div>

                            <p className='font-montserrat lg:text-lg xl:text-2xl max-w-md leading-relaxed'>
                                Link expires in 15 minutes. Check your spam folder if you don't see it
                            </p>
                        </div>
                    </div>

                    {/* Error Box */}
                    {serverError && (
                        <div className='bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg font-montserrat text-sm text-center'>
                            {serverError}
                        </div>
                    )}

                    {/* Resend Button */}
                    <button
                        type='button'
                        onClick={handleResendLink}
                        disabled={isLoading}
                        className={`w-fit lg:rounded-lg xl:rounded-xl bg-[#20A6DA] mx-auto lg:px-8 lg:py-2 xl:px-10 xl:py-3 text-center lg:text-lg xl:text-xl font-montserrat font-bold text-white transition-all hover:bg-white hover:text-[#002C49] hover:bg-[#27D6FF] hover:border hover:border-[#27D6FF] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Checking...' : '↻ Resend Link' }
                    </button>

                    <p className='-mt-3 text-center lg:text-sm xl:text-lg font-montserrat font-medium text-white'>
                        &lt; Go back to{' '}
                        <Link 
                            to='/'
                            className='font-montserrat font-bold text-white hover:text-[#27D6FF]'
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