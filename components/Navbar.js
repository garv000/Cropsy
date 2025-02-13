"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"

const Navbar = () => {
    const { data: session } = useSession()
    const [showdropdown, setShowDropdown] = useState(false)

    return (
        <nav className='bg-lime-600 flex justify-between items-center px-6 py-4 shadow-md bg-opacity-85'>
            <div className="logo flex items-center">
                <Link href={'/'}>
                    <div className='text-3xl font-bold text-white hover:text-gray-100 transition duration-300'>Cropsy</div>
                </Link>
            </div>

            {session ? (
                <div className='flex items-center gap-6'>
                    <Link href={'/about'}>
                        <button className='bg-white hover:bg-gray-100 text-lime-600 font-semibold rounded-lg px-6 py-2 transition duration-300 ease-in-out'>
                            About
                        </button>
                    </Link>
                    
                    <div className='relative'>
                        <button 
                            onClick={() => setShowDropdown(!showdropdown)} 
                            onBlur={() => setTimeout(() => { setShowDropdown(false) }, 300)} 
                            className="bg-white hover:bg-gray-100 text-lime-600 font-semibold rounded-lg px-6 py-2 flex items-center space-x-2 transition duration-300 ease-in-out"
                        >
                            <span>Welcome <span className='hidden md:inline'>{session.user.name}</span></span>
                            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>

                        {showdropdown && (
                            <div className="absolute right-0 mt-2 bg-white text-gray-700 rounded-lg shadow-lg w-48 z-10">
                                <ul className="py-2 text-sm">
                                    <li>
                                        <Link href={'/'} className="block px-4 py-2 hover:bg-gray-100">Home</Link>
                                    </li>
                                    <li>
                                        {session.user.type === 'seller' && (
                                            <Link href={'/dashboard'} className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                                        )}
                                        {session.user.type === 'buyer' && (
                                            <Link href={'/cart'} className="block px-4 py-2 hover:bg-gray-100">Cart</Link>
                                        )}
                                        {session.user.type === 'admin' && (
                                            <Link href={'/admin'} className="block px-4 py-2 hover:bg-gray-100">Admin Dashboard</Link>
                                        )}
                                    </li>
                                    {session.user.type !== 'admin' && (
                                        <>
                                    <li>
                                        <Link href={'/order_history'} className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                                    </li>
                                    <li>
                                        <Link href={'/profile'} className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                                    </li>
                                        </>
                                    )}
                                    <li>
                                        <Link href={'/login'} onClick={() => signOut()} className="block px-4 py-2 hover:bg-gray-100">Sign out</Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className='flex gap-4'>
                    <Link href={'/signup'}>
                        <button className='bg-white text-black font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300 ease-in-out'>
                            Sign Up
                        </button>
                    </Link>
                    <Link href={'/login'}>
                        <button className='bg-white text-black font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300 ease-in-out'>
                            Log In
                        </button>
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar
