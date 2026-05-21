// import React, { useState } from 'react';
// import logo from '../assets/logo-01.svg';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import api from '../api/axios';
// // import Sidebar from '...';
// import folderIcon from '../assets/folder-icon.svg';

function Dashboard () {
    // const location = useLocation();

    // const username = location.state?.username || 'User';

    // // const navigate = useNavigate();

    // // const [serverError, setServerError] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    // const [expanded, setExpanded] = useState(false);

    return (
        <h1> Dashboard Page </h1>

        // <main className='flex min-h-screen bg-[#F4F7FA]'>
        //     {/* Sidebar
        //     <Sidebar
        //         expanded={expanded}
        //         setExpanded={setExpanded}
        //     /> */}

        //     {/*  */}
        //     <section
        //         className={`flex-1 transition-all duration-300 ${
        //             expanded ? 'px-10 py-8' : 'px-16 py-10'
        //         }`}
        //     >
        //         {/* Header */}
        //         <div className='flex items-center justify-between'>
        //             {/* Left Side */}
        //             <div className='flex flex-col text-[#002C49] max-w-xl'>
        //                 <h1 className='font-montserrat font-semibold lg:text-2xl xl:text-4xl max-w-md leading-relaxed'>
        //                     Hello there,{' '}
        //                     <span>
        //                         {username}
        //                     </span>
        //                 </h1>

        //                 <p className='max-w-xl lg:text-xl xl:text-2xl font-montserrat font-medium text-black'>
        //                     Here's what's happening across your project today.
        //                 </p>
        //             </div>

        //             {/* New Project Button */}
        //             <button
        //                 type='button'
        //                 disabled={isLoading}
        //                 className={`flex items-center gap-2 bg-[#0E5998] text-white px-5 py-3 rounded-xl font-semibold shadow-md transition-all hover:bg-white hover:text-[#1380D8] hover:border hover:border-[#0E5998] ${
        //                     isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        //                 }`}
        //             >
        //                 {/* Folder Icon */}
        //                 <img
        //                     src={folderIcon}
        //                     alt='New Project Icon'
        //                     className='w-4 h-4 brightness-0 invert'
        //                 />

        //                 {isLoading ? 'Checking...' : 'New Project' }
        //             </button>
        //         </div>

        //         {/* 4 Card */}
        //         <div className='mt-10 grid grid-cols-4 gap-5'>
        //                 {/* Active Project */}
        //                 <div className='bg-white border border-[#D8E8F3] rounded-2xl p-6 shadow-sm'>
        //                     <p className='text-[#4A6C85] text-sm'>
        //                         Active projects
        //                     </p>

        //                     <h2 className='text-5xl font-bold text-[#002C49] mt-3'>
        //                         4
        //                     </h2>
        //                 </div>
        //         </div>
        //     </section>

        // </main>
    );
}

export default Dashboard;