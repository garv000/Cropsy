"use client"
import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchuser, updateprofile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Profile = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [form, setForm] = useState({})

    useEffect(() => {
        if (session) {
            router.push('/profile')
            getData()
        } else {
            router.push('/login')
        }
    }, [router, session])

    const getData = async () => {
        let u = await fetchuser(session.user.name)
        setForm(u)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        let a = await updateprofile(e, session.user.name)
        let newData = Object.fromEntries(e)
        session.user.name = newData.username

        if (a) {
            toast.success('Profile Updated', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        } else {
            toast.error('Username already exists', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <div className="bg-gray-50 bg-opacity-80 dark:bg-gray-900 min-h-screen flex items-center justify-center py-10 pb-24">
                <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 className="font-bold text-4xl text-center text-gray-900 dark:text-white mb-6">Your Profile</h1>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={form.username || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-900 dark:text-white">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={form.address || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-900 dark:text-white">Contact</label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                value={form.contact || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {form.type === 'seller' && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="profilepic" className="block text-sm font-medium text-gray-900 dark:text-white">Profile Picture</label>
                                    <input
                                        type="text"
                                        id="profilepic"
                                        name="profilepic"
                                        value={form.profilepic || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 mt-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="cashfreeid" className="block text-sm font-medium text-gray-900 dark:text-white">UPI ID</label>
                                    <input
                                        type="text"
                                        id="cashfreeid"
                                        name="cashfreeid"
                                        value={form.cashfreeid || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 mt-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* <div className="mb-4">
                                    <label htmlFor="cashfreesecret" className="block text-sm font-medium text-gray-900 dark:text-white">Cashfree Secret</label>
                                    <input
                                        type="text"
                                        id="cashfreesecret"
                                        name="cashfreesecret"
                                        value={form.cashfreesecret || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 mt-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div> */}
                            </>
                        )}

                        <button type="submit" className="w-full mt-6 py-3 text-xl font-bold text-white bg-lime-600 rounded-lg hover:bg-lime-700 focus:outline-none focus:ring-4 focus:ring-lime-300 dark:bg-lime-500 dark:hover:bg-lime-600 dark:focus:ring-lime-700">
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Profile
