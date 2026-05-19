import logo from '../assets/logo-05.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { z } from 'zod';

function Signup () {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState<{
        email?: string[],
        password?: string[],
        confirmPassword?: string[],
    }>({
        email: [],
        password: [],
        confirmPassword: [],
    });

    {/* Email & Password Validation Using ZOD */}
    const signupSchema = z.object({
        email: z.string().email('Invalid Email Format').regex(
            /^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must use @gmail.com'
        ),

        password: z.string().min(6, 'Password must have at least 6 characters').regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/, 'Password must contain letters, numbers, and symbols (@, $, !, %, *, ?, &)'
        ),

        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Password do not match',
        path: ['confirmPassword'],
    });

    const handleSignup = () => {
        const result = signupSchema.safeParse({
            email,
            password,
            confirmPassword,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            return;
        }

        setErrors({
            email: [],
            password: [],
            confirmPassword: []
        });

        setErrors({});
        console.log('Sign Up Success')

        navigate('/');
    };

    return (
        <main className='flex min-h-screen items-center bg-linear-to-br from-[#0EB8DF] to-[#0E5998]'>
            {/* Logo */}
            <div className='absolute w-md lg:top-10 lg:left-10 xl:top-12 xl:left-14'>
                <img
                    src={logo}
                    alt='Vault of Evidence Logo'
                    className='md:max-h-12 lg:max-h-18 xl:max-h-28'
                />
            </div>

            {/* Left Side */}
            <section className='flex w-4/7 flex-col justify-center lg:gap-y-40 lg:px-8 xl:px-14 text-white'>
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
            <section className='flex w-3/7 items-center lg:px-12 xl:px-20'>
                <div className='flex flex-col lg:gap-y-6 xl:gap-y-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 w-xl max-w-xl lg:rounded-[36px] xl:rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'>
                    <div className='flex flex-col'>
                        <h2 className='lg:text-3xl xl:text-[2.5rem] font-montserrat font-bold text-white'>
                            Get Started
                        </h2>

                        <p className='font-montserrat font-medium text-white lg:text-sm xl:text-lg'>
                            Create your secure workspace.
                        </p>
                    </div>

                    {/* Full Name */}
                    <div className='flex flex-col gap-y-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>
                            Full Name
                        </label>

                        <input
                            type='string'
                            placeholder='John Doe'
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                        />
                    </div>

                    {/* Email */}
                    <div className='flex flex-col gap-y-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>
                            Email
                        </label>

                        <input
                            type='email'
                            placeholder='youremail@gmail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                        />

                        {errors.email && (
                            <p className='text-sm text-red-300'>
                                {errors.email[0]}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className='flex flex-col gap-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>
                            Password
                        </label>

                        <input
                            type='password'
                            placeholder='******'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                        />

                        {errors.password && (
                            <p className='text-sm text-red-300'>
                                {errors.password[0]}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className='flex flex-col gap-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>
                            Confirm Password
                        </label>

                        <input
                            type='password'
                            placeholder='******'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none'
                        />

                        {errors.confirmPassword && (
                            <p className='text-sm text-red-300'>
                                {errors.confirmPassword[0]}
                            </p>
                        )}
                    </div>

                    {/* Sign-In */}
                    <p className='text-center lg:text-sm xl:text-lg font-montserrat font-medium text-white'>
                        Already have an account?

                        <Link
                            to='/'
                            className='px-1 font-montserrat font-medium text-white hover:text-[#27D6FF]'
                        >
                            Sign in
                        </Link>
                    </p>

                    {/* Sign-Up BUtton */}
                    <button
                        onClick={handleSignup}
                        className='w-fit lg:rounded-lg xl:rounded-xl bg-[#41B0EC] mx-auto lg:px-4 lg:py-1 xl:px-6 xl:py-2 text-center lg:text-md xl:text-xl font-montserrat font-semibold text-white hover:bg-white hover:text-[#41B0EC] hover:border hover:border-[#41B0EC]'>
                            Sign Up
                    </button>
                </div>                
            </section>
        </main>
    )
}

export default Signup;