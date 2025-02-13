"use client"
import React, { useState, useEffect } from 'react'
import ProductsList from '@/components/ProductsList'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { addproduct, fetchuser, updateprofile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchproduct, deleteProduct, fetchproductpid, deleteeditProduct } from '@/actions/useractions'

const Dashboard = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [form, setform] = useState({})
    const [productform, setproductform] = useState({})
    const [products, setproducts] = useState([])
    const [pid, setpid] = useState('NULL')

    const getProducts = async (Email) => {
        let product = await fetchproduct(Email)
        setproducts(product)
    }


    useEffect(() => {
        if (!session) {
            router.push('/login')
        } else {
            if (session.user.type === 'buyer') {
                router.push('/')
            } else {
                getData()
                getProducts(session.user.email)
            }
        }
    }, [router, session])

    const getData = async () => {
        let u = await fetchuser(session.user.name)
        setform(u)
    }

    const editProduct = async (id, pid) => {
        setproductform(products.filter(item => item._id === id)[0])
        setpid(pid)
        deleteeditProduct(id)
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const handleProductChange = (e) => {
        setproductform({ ...productform, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        let a = await updateprofile(e, session.user.name)
        let newdata = Object.fromEntries(e)
        session.user.name = newdata.username
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
            })
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
            })
        }
    }
    const handleProductSubmit = async (e) => {
        const a = await addproduct(e, session.user.email, pid)
        setpid('NULL')
        setproductform({})
        if (a) {
            toast.success('Product added successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            })
            setTimeout(() => {
                window.location.reload()
            }, 5000);
        } else {
            toast.error('Product not added successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            })
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
            {/* is page p bg lagana h kya?bol h
             */}
            <div className="bg-gray-50 min-h-screen pb-10 bg-opacity-80">
                <h1 className="font-bold text-4xl text-center py-12 text-gray-800 px-6">Welcome to your Dashboard</h1>

                <div className="flex flex-col lg:flex-row justify-around gap-8 px-6">
                    <form action={handleProductSubmit} className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
                        <div className="text-2xl font-bold text-center text-gray-800 mb-6">Add Product</div>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input type="text" id="name" name="name" value={productform.name || ""} onChange={handleProductChange}
                                className="w-full p-3 mt-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="pic" className="block text-sm font-medium text-gray-700">Product Picture</label>
                            <input type="text" id="pic" name="pic" value={productform.pic || ""} onChange={handleProductChange}
                                className="w-full p-3 mt-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price per kg</label>
                            <input type="number" id="price" name="price" value={productform.price || ""} onChange={handleProductChange}
                                className="w-full p-3 mt-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input type="number" id="quantity" name="quantity" value={productform.quantity || ""} onChange={handleProductChange}
                                className="w-full p-3 mt-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" />
                        </div>
                        <button type="submit" className="w-full bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-lg py-3 text-lg transition duration-300">Add Product</button>
                    </form>

                    <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
                        <div className="text-xl font-semibold text-gray-800 mb-4">Profile Details</div>
                        <div className="text-center mb-6">
                            <img src={form.profilepic} alt="Profile Picture" className="w-32 h-32 rounded-full object-cover mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-800">{form.name}</p>
                            <p className="text-gray-600">{form.email}</p>
                            <p className="text-gray-600">{form.address}</p>
                            <p className="text-gray-600">{form.contact}</p>
                        </div>
                    </div>
                </div>

                <ProductsList editProduct={editProduct} products={products} />
            </div>
        </>
    )
}

export default Dashboard
