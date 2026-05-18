import logo from '../assets/logo-05.svg';
import { Link } from 'react-router-dom';

function ResetPassword () {
    return (
        <main className='flex min-h-screen bg-linear-to-br from-[#0EB8DF] to-[#0E5998]'>
            {/* Left Side */}
            <section className='flex w-4/7 flex-col justify-center gap-y-36 px-14 py-12 text-white'>
                {/* Logo */}
                <div>
                    <img
                        src={logo}
                        alt='Vault of Evidence Logo'
                        className='max-h-28'
                    />
                </div>

                {/* Text */}
                <div className='flex flex-1 flex-col px-6'>
                    <h1 className='mb-6 text-5xl font-semibold font-montserrat leading-tight'>
                        Regain Access, <br/> to Your Vault.
                    </h1>

                    <p className='max-w-xl text-2xl font-montserrat font-medium text-white'>
                        Password recovery for your secure environment.
                    </p>
                </div>
            </section>

            {/* Right Side*/}
            <section className='flex w-3/7 items-center justify-center px-10'>
                <div className='flex flex-col gap-y-8 px-14 py-16 w-xl max-w-xl rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'>
                    <div className='flex flex-col'>
                        <h2 className='text-[2.5rem] font-montserrat font-bold text-white mb-2 leading-tight'>
                            Reset Password
                        </h2>

                        <p className='font-montserrat font-medium text-white text-lg'>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Email */}
                    <div className='flex flex-col gap-y-1 text-lg mt-4'>
                        <label className='block font-montserrat font-medium text-white'>
                            Email address
                        </label>
                        <input
                            type='email'
                            placeholder='youremail@mail.com'
                            className='w-full rounded-xl border border-[#27D6FF] bg-[#002C49]/50 px-4 py-3 text-white outline-none'/>
                    </div>

                    {/* Sign-In Link */}
                    <p className='text-center text-lg font-montserrat font-medium text-white mt-4'>
                        Remembered your password?{' '}
                        <Link
                            to='/'
                            className='font-montserrat font-bold text-white hover:text-[#27D6FF]'
                        >
                            Return to Sign in
                        </Link>
                    </p>

                    {/* Send Email Button*/}
                    <button
                        className='w-fit rounded-xl bg-[#41B0EC] mx-auto py-2 px-6 mt-4 text-center text-xl font-montserrat font-semibold text-white hover:bg-white hover:text-[#41B0EC] hover:border hover:border-[#41B0EC] transition-colors cursor-pointer'
                    >
                        Send Reset Link
                    </button>
                </div>
            </section>
        </main>
    )
}

export default ResetPassword;