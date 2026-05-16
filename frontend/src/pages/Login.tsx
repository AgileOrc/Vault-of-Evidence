import logo from '../assets/logo-05.svg';
import { Link } from 'react-router-dom'

function Login () {
    return (
        <main className='flex min-h-screen bg-linear-to-br from-[#0EB8DF] to-[#0E5998]'>
            {/* Left Side */}
            <section className='flex w-4/7 flex-col justify-center lg:gap-y-40 xl:gap-y-36 lg:px-8 lg:py-10 xl:px-14 xl:py-12 text-white'>
                {/* Logo */}
                <div>
                    <img
                        src={logo}
                        alt='Vault of Evidence Logo'
                        className='lg:max-h-18 xl:max-h-28'
                    />
                </div>

                {/* Text */}
                <div className= 'flex flex-1 flex-col lg:px-5 xl:px-6 lg:gap-y-3 xl:gap-y-4'>
                    <h1 className='lg:text-4xl xl:text-5xl font-semibold font-montserrat leading-tight'>
                        Your Evidence, <br/> Protected and Organized.
                    </h1>

                    <p className='max-w-xl lg:text-xl xl:text-2xl font-montserrat font-medium text-white'>
                        Centralized storage for findings and investigation records.
                    </p>
                </div>
            </section>

            {/* Right Side*/}
            <section className='flex w-3/7 items-center justify-center px-20'>
                <div className='flex flex-col gap-y-10 px-14 py-16 w-xl max-w-xl rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'>
                    <div className='flex flex-col'>
                        <h2 className='text-[2.5rem] font-montserrat font-bold text-white'>
                            Welcome Back!
                        </h2>

                        <p className='font-montserrat font-medium text-white text-lg'>
                            Continue where you left off.
                        </p>
                    </div>

                    {/* Email */}
                    <div className='flex flex-col gap-y-1 text-lg'>
                        <label className='block font-montserrat font-medium text-white'>
                            Email address
                        </label>

                        <input
                            type='email'
                            placeholder='youremail@mail.com'
                            className='w-full rounded-xl border border-[#27D6FF] bg-[#002C49]/50 px-4 py-3 text-white outline-none'/>
                    </div>

                    {/* Password */}
                    <div className='flex flex-col gap-y-1 text-lg'>
                        <div className='flex items-center justify-between'>
                            
                            <label className='font-montserrat font-medium text-white'>
                            Password
                            </label>
                            
                            <Link
                                to='/ResetPassword'
                                className='font-montserrat font-semibold text-white hover:text-[#27D6FF]'
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        
                        <input
                            type='password'
                            placeholder='******'
                            className='w-full rounded-xl border border-[#27D6FF] bg-[#002C49]/50 px-4 py-3 text-white outline-none' 
                        />
                    </div>

                    {/* Create Account */}
                    <p className='text-center text-lg font-montserrat font-medium text-white'>
                        Don't have account?{' '}

                        <Link
                            to='/SignUp'
                            className='font-montserrat font-bold text-white hover:text-[#27D6FF]'
                        >
                            Create one
                        </Link>
                    </p>

                    {/* Sign-In Button*/}
                    <Link
                        to='/Dashboard'
                        className='w-fit rounded-xl bg-[#41B0EC] mx-auto py-2 px-6 text-center text-xl font-montserrat font-semibold text-white hover:bg-white hover:text-[#41B0EC] hover:border hover:border-[#41B0EC]'
                    >
                        Sign In
                    </Link>
                </div>
            </section>

        </main>
    )
}

export default Login
