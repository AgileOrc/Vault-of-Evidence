import { useState } from 'react';
import logo from '../assets/logo-05.svg';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import api from '../api/axios';

function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState<{
        username?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    }>({});

    const signupSchema = z.object({
        username: z.string()
            .min(3, 'Full name must be at least 3 characters')
            .regex(/^[a-zA-Z0-9 ]+$/, 'Full name must be alphanumeric'),
        email: z.string()
            .email('Invalid Email Format'),
        password: z.string()
            .min(6, 'Password must have at least 6 characters')
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/, 'Password must contain letters, numbers, and symbols (@, $, !, %, *, ?, &)'),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setErrors({});

        const result = signupSchema.safeParse({
            username,
            email,
            password,
            confirmPassword,
        });

        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/signup', {
                username: username,
                email: email,
                password: password,
            });

            if (response.status === 201 || response.status === 200) {
                alert('Account created successfully! Please sign in.');
                navigate('/');
            }
        } catch (err: any) {
            setServerError(err.response?.data?.error || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='flex min-h-screen items-center bg-gradient-to-br from-[#27D6FF] to-[#1767AA]'>
            <div className='mt-2 absolute w-md lg:top-10 lg:left-14 xl:top-16 xl:left-14'>
                <img src={logo} alt='Vault of Evidence Logo' className='md:max-h-12 lg:max-h-22 xl:max-h-32' />
            </div>

            <section className='flex w-4/7 flex-col justify-center lg:gap-y-40 lg:px-8 xl:px-14 text-[#F5F5F5]'>
                <div className='flex flex-1 flex-col lg:px-5 xl:px-6 lg:gap-y-3 xl:gap-y-4'>
                    <h1 className='lg:text-4xl xl:text-5xl font-semibold leading-tight'>
                        Your Evidence, <br/> Protected and Organized.
                    </h1>
                    <p className='max-w-xl lg:text-xl xl:text-2xl font-medium text-[#F5F5F5]'>
                        Centralized storage for findings and investigation records.
                    </p>
                </div>
            </section>

            <section className='flex w-3/7 items-center lg:px-12 xl:px-20'>
                <form 
                    onSubmit={handleSignupSubmit}
                    className='flex flex-col lg:gap-y-6 xl:gap-y-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 w-xl max-w-xl lg:rounded-[36px] xl:rounded-[40px] border border-[#F5F5F5]/40 bg-[#1767AA]/30 shadow-lg shadow-[#002C49]/20 backdrop-blur-md'
                >
                    <div className='flex flex-col'>
                        <h2 className='lg:text-3xl xl:text-[2.5rem] font-bold text-[#F5F5F5]'>
                            Get Started
                        </h2>
                        <p className='font-medium text-[#F5F5F5] lg:text-sm xl:text-lg'>
                            Create your secure workspace.
                        </p>
                    </div>

                    {serverError && (
                        <div className="bg-[#002C49]/40 border border-[#27D6FF]/40 text-[#F5F5F5] px-4 py-2 rounded-lg text-sm">
                             {serverError}
                        </div>
                    )}

                    <div className='flex flex-col gap-y-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-medium text-[#F5F5F5]'>Full Name</label>
                        <input
                            type='text' 
                            placeholder='John Doe'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-[#F5F5F5] outline-none'
                        />
                        {errors.username && (
                            <p className='text-sm text-[#27D6FF]'>{errors.username[0]}</p>
                        )}
                    </div>

                    <div className='flex flex-col gap-y-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-medium text-[#F5F5F5]'>Email</label>
                        <input
                            type='email'
                            placeholder='youremail@gmail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-[#F5F5F5] outline-none'
                        />
                        {errors.email && (
                            <p className='text-sm text-[#27D6FF]'>{errors.email[0]}</p>
                        )}
                    </div>

                    <div className='flex flex-col gap-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-medium text-[#F5F5F5]'>Password</label>
                        <input
                            type='password'
                            placeholder='******'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-[#F5F5F5] outline-none'
                        />
                        {errors.password && (
                            <p className='text-sm text-[#27D6FF]'>{errors.password[0]}</p>
                        )}
                    </div>

                    <div className='flex flex-col gap-0.5 lg:text-sm xl:text-lg'>
                        <label className='font-medium text-[#F5F5F5]'>Confirm Password</label>
                        <input
                            type='password'
                            placeholder='******'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-[#F5F5F5] outline-none'
                        />
                        {errors.confirmPassword && (
                            <p className='text-sm text-[#27D6FF]'>{errors.confirmPassword[0]}</p>
                        )}
                    </div>

                    <p className='text-center lg:text-sm xl:text-lg font-medium text-[#F5F5F5]'>
                        Already have an account?
                        <Link to='/' className='px-1 font-bold text-[#F5F5F5] hover:text-[#27D6FF]'>
                            Sign in
                        </Link>
                    </p>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`w-fit lg:rounded-lg xl:rounded-xl bg-[#20A6DA] mx-auto lg:px-4 lg:py-1 xl:px-6 xl:py-2 text-center lg:text-md xl:text-xl font-semibold text-[#F5F5F5] transition-all hover:bg-[#27D6FF] hover:text-[#002C49] hover:border hover:border-[#27D6FF] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>                
            </section>
        </main>
    );
}

export default Signup;