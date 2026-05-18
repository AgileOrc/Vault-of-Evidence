import { useState } from 'react';
import logo from '../assets/logo-05.svg';
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios';
function Login () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 3. Buat fungsi handler untuk menangani submit form login
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Reset error setiap kali tombol ditekan

        try {
            // Tembak API login di backend Go
            const response = await api.post('/auth/login', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                // Jika sukses, arahkan ke Dashboard
                navigate('/Dashboard');
            }
        } catch (err: any) {
            // Jika password salah atau user tidak terdaftar, tangkap error dari backend
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        }
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
                <form 
                    onSubmit={handleLoginSubmit} 
                    className='flex flex-col lg:gap-y-6 xl:gap-y-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 w-xl max-w-xl lg:rounded-[36px] xl:rounded-[40px] border border-white/40 bg-linear-to-br from-white/20 to-white/10 shadow-lg shadow-black/5 backdrop-blur-md'
                >
                    <div className='flex flex-col'>
                        <h2 className='lg:text-3xl xl:text-[2.5rem] font-montserrat font-bold text-white'>
                            Welcome Back!
                        </h2>

                        <p className='font-montserrat font-medium text-white lg:text-sm xl:text-lg'>
                            Continue where you left off.
                        </p>
                    </div>
                    
                    {/* Tempat Menampilkan Pesan Error jika Login Gagal */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg font-montserrat text-sm">
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <div className='flex flex-col gap-y-1 lg:text-sm xl:text-lg'>
                        <label className='font-montserrat font-medium text-white'>
                            Email address
                        </label>

                        <input
                            type='email'
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            placeholder='youremail@mail.com'
                            required
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none'/>
                    </div>

                    {/* Password */}
                    <div className='flex flex-col gap-y-1 lg:text-sm xl:text-lg'>
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
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            placeholder='******'
                            required
                            className='w-full lg:rounded-lg xl:rounded-xl border border-[#27D6FF] bg-[#002C49]/50 lg:px-2 lg:py-1.5 xl:px-4 xl:py-3 text-white outline-none' 
                        />
                    </div>

                    {/* Create Account */}
                    <p className='text-center lg:text-sm xl:text-lg font-montserrat font-medium text-white'>
                        Don't have account?{' '}

                        <Link
                            to='/SignUp'
                            className='font-montserrat font-bold text-white hover:text-[#27D6FF]'
                        >
                            Create one
                        </Link>
                    </p>

                    {/* Sign-In Button*/}
                    <button type='submit'
                    className='w-fit lg:rounded-lg xl:rounded-xl bg-[#41B0EC] mx-auto lg:px-4 lg:py-1 xl:px-6 xl:py-2 text-center lg:text-md xl:text-xl font-montserrat font-semibold text-white cursor-pointer hover:bg-white hover:text-[#41B0EC] hover:border hover:border-[#41B0EC]'>
                        Sign In
                    </button>
                </form>
            </section>

        </main>
    )
}

export default Login
