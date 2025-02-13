"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Login = () => {
    const { data: session } = useSession()
    const router = useRouter()
    useEffect(() => {
        if (session && session.user.type === 'admin') {
            router.push('/admin')
        }
        if (session && session.user.type === 'seller') {
            router.push('/dashboard')
        }
        if (session && session.user.type === 'buyer') {
            router.push('/')
        }
    }, [router, session])

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleUsername = (e) => {
        setEmail(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleSubmit = async (e) => {
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res.error) {
            alert('Wrong credentials');
            console.error(res.error);
        } else {
            if (session && session.user.type === 'seller') {
                router.push('/dashboard')
            }
            if (session && session.user.type === 'buyer') {
                router.push('/')
            }
        }
    };

    return (
        <div className="mx-auto min-h-[80vh] flex items-center justify-center bg-gray-100 pt-10 pb-24 bg-opacity-80">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg dark:bg-gray-800">
                <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">Login to Get Started</h1>
                
                <button
                    onClick={() => { signIn("google") }}
                    className="w-full flex items-center justify-center gap-2 mb-6 p-3 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="-0.5 0 48 48" version="1.1">
                        <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="Color-" transform="translate(-401.000000, -860.000000)">
                                <g id="Google" transform="translate(401.000000, 860.000000)">
                                    <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"></path>
                                    <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"></path>
                                    <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"></path>
                                    <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                    <span className="text-gray-700">Continue with Google</span>
                </button>

                <div className="text-gray-500 text-center mb-5">or</div>
                <form className="space-y-6" action={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={handleUsername}
                            className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-lime-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-lime-500"
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={handlePassword}
                            className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-lime-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-lime-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Link href="#" className="text-sm font-medium text-[#2563eb] hover:underline dark:text-[#2563eb]">Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-lime-600 rounded-lg hover:bg-lime-700 focus:outline-none focus:ring-4 focus:ring-lime-300 dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800">
                        Sign In
                    </button>

                    <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                        Don’t have an account yet? <Link href="/signup" className="font-medium text-[#2563eb] hover:underline dark:text-[#2563eb]">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;
