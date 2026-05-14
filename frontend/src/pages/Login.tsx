import logo from '../assets/logo-05.svg';
import { Link } from 'react-router-dom'

function Login () {
    return (
        <main className='flex min-h-screen bg-gradient-to-r from-cyan-500 to-blue-950'>
            {/* Left Side */}
            <section className='flex w-1/2 flex-col justify-center px-20 text-white'>
                <img
                    src={logo}
                    alt='Vault of Evidence Logo'
                    className='mb-25 -mt-30 w-139.5'
                />

                <h1 className='ml-6 mb-6 text-4xl font-semibold font-montserrat leading-tight'>
                    Your Evidence,
                    <br />

                    <span className='whitespace-nowrap'>
                        Protected and Organized.
                    </span>
                </h1>

                <p className='ml-6 max-w-lg text-2xl font-montserrat font-medium text-blue-100'>
                    <span className='whitespace-nowrap'>
                        Centralized storage for findings and
                    </span>

                    <br />
                    investigation records.
                </p>
            </section>

            {/* Right Side*/}
            <section className='flex w-1/2 items-center justify-center'>
                <div className='w-full max-w-md rounded-[40px] border border-white/20 bg-white/10 p-10 backdrop-blur-md'>

                    <h2 className='mb-2 text-4xl font-montserrat font-bold text-white'>
                        Welcome Back!
                    </h2>

                    <p className='mb-10 font-montserrat font-medium text-blue-100'>
                        Continue where you left off.
                    </p>

                    {/* Email */}
                    <div className='mb-5'>
                        <label className='mb-2 block font-montserrat font-medium text-white'>
                            Email address
                        </label>

                        <input
                            type='email'
                            placeholder='youremail@gmail.com'
                            className='w-full rounded-lg border border-cyan-300 bg-transparent px-4 py-3 text-white outline-none'/>
                    </div>

                    {/* Password */}
                    <div className='mb-3'>
                        <div className='mb-2 flex items-center justify-between'>
                            
                            <label className='mb-2 block font-montserrat font-medium text-white'>
                            Password
                            </label>
                            
                            <Link
                                to='/ResetPassword'
                                className='text-sm font-montserrat font-semibold text-white hover:text-cyan-200'
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        
                        <input
                            type='password'
                            placeholder='******'
                            className='w-full rounded-lg border border-cyan-300 bg-transparent px-4 py-3 text-white outline-none' 
                        />
                    </div>

                    {/* Create Account */}
                    <p className='mb-6 text-center font-montserrat font-medium text-white'>
                        Don't have account?{' '}

                        <Link
                            to='/Signup'
                            className='font-montserrat font-bold text-white hover:text-cyan-200'
                        >
                            Create one
                        </Link>
                    </p>

                    {/* Sign-In Button*/}
                    <Link
                        to='/Dashboard'
                        className='block w-full rounded-xl bg-cyan-400 py-3 text-center text-xl font-montserrat font-semibold text-white transition hover:bg-cyan-300'
                    >
                        Sign In
                    </Link>
                </div>
            </section>

        </main>
    )
}

export default Login
