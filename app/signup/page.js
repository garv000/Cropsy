"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adduser, fetchuser, updateprofile } from '@/actions/useractions'

const page = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [form, setform] = useState({})

    useEffect(() => {
        if (session) {
            router.push('/profile')
        } else {
            router.push('/signup')
        }
    }, [router, session])

    const handleChange = (e) => {
        if (e.target.name === "type") {
            setform({ ...form, [e.target.name]: e.target.checked ? e.target.value : "" });
        } else {
            setform({ ...form, [e.target.name]: e.target.value });
        }
    }

    const handleSubmit = async (e) => {
        let a = await adduser(e)
        if (a) {
            router.push('/login')
        } else {
            alert("User already exists")
        }
    }

    return (
        <div>
            <section className="bg-gray-50 dark:bg-gray-900 pb-10 bg-opacity-80">
                <h1 className="text-4xl font-extrabold text-center pt-12 text-gray-800 dark:text-white">Signup to Get Started</h1>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-8 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-2xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white">
                                Create an account
                            </h1>
                            <form className="space-y-4 md:space-y-6" action={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={form.email || ""} 
                                        onChange={handleChange} 
                                        id="email" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-600 focus:border-lime-600 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500 transition duration-200"
                                        placeholder="name@company.com" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={form.password || ""} 
                                        onChange={handleChange} 
                                        id="password" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-600 focus:border-lime-600 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500 transition duration-200"
                                        placeholder="••••••••" 
                                        required 
                                    />
                                </div>

                                <div className="flex items-start gap-8">
                                    <div className="flex items-center mb-4">
                                        <input
                                            id="default-radio-1"
                                            type="radio"
                                            name="type"
                                            value="seller"
                                            checked={form.type === "seller"}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-lime-600 bg-gray-100 border-gray-300 focus:ring-lime-500 dark:focus:ring-lime-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor="default-radio-1" className="ms-2 text-lg font-medium text-gray-900 dark:text-gray-300">Seller</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="default-radio-2"
                                            type="radio"
                                            name="type"
                                            value="buyer"
                                            checked={form.type === "buyer"}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-lime-600 bg-gray-100 border-gray-300 focus:ring-lime-500 dark:focus:ring-lime-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor="default-radio-2" className="ms-2 text-lg font-medium text-gray-900 dark:text-gray-300">Buyer</label>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full text-white bg-lime-600 hover:bg-lime-700 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-lg px-6 py-3 text-center dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800 transition-all duration-300 ease-in-out"
                                >
                                    Create an account
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? 
                                    <Link href="/login" className="font-medium text-[#2563eb] hover:underline dark:text-[#2563eb]">
                                        Login here
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default page
