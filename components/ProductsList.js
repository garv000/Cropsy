"use client"
import React from 'react'
import { fetchproduct, deleteProduct } from '@/actions/useractions'

const ProductsList = ({ editProduct, products }) => {
    return (
        <div className="min-h-screen pb-16 bg-opacity-80">
            <div className="text-3xl font-bold text-center text-gray-800 py-12">Your Products</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 lg:px-12">
                {products.map((product) => {
                    return (
                        <div key={product._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <img src={product.pic} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-lime-600">{product.name}</h2>
                                        <p className="text-sm text-gray-500">{product.description || 'Fresh and Organic'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg text-gray-800 font-semibold">{product.quantity} kg</p>
                                        <p className="text-xl text-lime-600 font-bold">₹{product.price}/kg</p>
                                    </div>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <button onClick={() => {editProduct(product._id,product.pid)
                                        }
                                    } className="px-6 py-2 bg-lime-600 text-white font-semibold rounded-lg hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105">
                                        Edit
                                    </button>
                                    <button onClick={() => {deleteProduct(product._id,product.pid)
                                        window.location.reload()}}
                                     className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProductsList
