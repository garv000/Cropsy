"use client"
import React, { useState, useEffect } from 'react'
import { addcart, fetchproducts, fetchseller, fetchproductpid } from '@/actions/useractions'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const [products, setproducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const getProducts = async () => {
    let product1 = await fetchproducts()
    let fetchedProducts = []
    // Loop through each cart item and fetch product details
    for (let i = 0; i < product1.length; i++) {
      const product = await fetchproductpid(product1[i].pid)
      // console.log(product1[i])
      const seller = await fetchseller(product.email)
      const productDetails = product // Assuming product is returned as an array with one element
      const productWithQuantity = {
        ...productDetails, // Add the quantity from cart data
        s_name: seller.name,
        s_address: seller.address,
        s_contact: seller.contact
      }
      fetchedProducts.push(productWithQuantity)
    }

    setproducts(fetchedProducts)
  }

  const addtocart = async (x, y) => {
    let a = await addcart(x, y)
    if (a) {
      toast.success('Added to Cart', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    } else {
      toast.error('Already in Cart', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredProducts = products.filter(product => {
    const searchLowerCase = searchTerm.toLowerCase()
    return (
      product.name.toLowerCase().includes(searchLowerCase) ||
      (product.s_name && product.s_name.toLowerCase().includes(searchLowerCase)) ||
      (product.s_address && product.s_address.toLowerCase().includes(searchLowerCase))
    )
  })

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20 bg-opacity-80">
        <div className="flex flex-col items-center justify-center py-16 gap-6 px-6 sm:px-12">
          <p className="text-4xl md:text-5xl font-semibold text-center text-gray-900 dark:text-white">Welcome to Cropsy</p>
          <p className="text-xl text-center text-gray-700 dark:text-gray-300 max-w-2xl">A platform where farmers can connect with buyers to sell their Fruits and Vegetables. Explore our fresh produce today!</p>
        </div>

        <div className='h-1 w-full bg-lime-600'></div>

        <div className="py-10 px-6 sm:px-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">Fruits and Vegetables</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Browse through our fresh collection of fruits and vegetables available for sale.</p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-12">
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full sm:w-1/2 p-3 rounded-lg border-2 border-lime-600 focus:outline-none focus:border-lime-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.pid} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition-all duration-300">
                <img src={product.pic} alt={product.name} className="w-full h-48 object-cover bg-lime-600" />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-lime-600 dark:text-white">{product.name}</h2>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-500">{product.s_name}</p>
                      <p className="text-gray-500 dark:text-gray-500">{product.s_address}</p>
                      <p className="text-gray-500 dark:text-gray-500">{product.s_contact}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-500">Fresh and Organic</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{product.quantity} kg</p>
                      <p className="text-lg font-semibold text-lime-600">₹{product.price}/Kg</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    {!session && (
                      <button
                        onClick={() => router.push('/login')}
                        className="w-full py-2 bg-lime-600 text-white font-semibold rounded-lg focus:outline-none hover:bg-lime-700 transition-all duration-300"
                      >
                        Log in to Add to Cart
                      </button>
                    )}
                    {session && session.user.type === 'buyer' && (
                      <button
                        onClick={() => addtocart(product.pid, session.user.email)}
                        className="w-full py-2 bg-lime-600 text-white font-semibold rounded-lg focus:outline-none hover:bg-lime-700 transition-all duration-300"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
