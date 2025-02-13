"use client"
import React, { useState, useEffect } from 'react';
import { order, fetchproductpid, fetchseller, sellerorder } from '@/actions/useractions';
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'

const OrderHistoryComponent = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [cart, setCart] = useState([])
    const [products, setProducts] = useState([])

    useEffect(() => {
        if (session) {
            router.push('/order_history') // Fetch the cart and products when session exists
            fetchorder()
        } else {
            router.push('/login')
        }
    }, [session, router])

    const [expandedOrder, setExpandedOrder] = useState(null);

    const toggleOrderDetails = (id) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };
    const fetchorder = async () => {
        if (session.user.type === 'buyer') {
            var cartData = await order(session.user.email)
            setCart(cartData)  // Set the cart state directly
        }
        if (session.user.type === 'seller') {
            var cartData = await sellerorder(session.user.email)
            setCart(cartData)  // Set the cart state directly
        }
        // Initialize an empty array to store product details
        let fetchedProducts = []
        // Loop through each cart item and fetch product details
        console.log(cartData)
        for (let i = 0; i < cartData.length; i++) {
            const product = await fetchproductpid(cartData[i].pid)
            const seller = await fetchseller(product.email)
            const buyer = await fetchseller(cartData[i].email)
            const productDetails = product // Assuming product is returned as an array with one element
            const productWithQuantity = {
                ...productDetails,
                oid: cartData[i].oid,
                quantity: cartData[i].quantity, // Add the quantity from cart data
                s_name: seller.name,
                s_address: seller.address,
                s_contact: seller.contact,
                b_name: buyer.name,
                b_address: buyer.address,
                b_contact: buyer.contact
            }
            fetchedProducts.push(productWithQuantity)
        }

        setProducts(fetchedProducts)
        // console.log(fetchedProducts)
        // console.log(products)
    }

    return (
        <div className="container mx-auto px-6 py-10 font-sans bg-gray-100 bg-opacity-80 min-h-screen pb-24">
            <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">Order History</h1>
            {session && session.user.type === 'buyer' && (
                <div className="space-y-8">
                    {products.map(order => (
                        <div key={order.pid} className="bg-white rounded-xl shadow-lg overflow-hidden p-6 transition transform hover:scale-105 hover:shadow-xl">
                            <div className="flex items-center cursor-pointer" onClick={() => toggleOrderDetails(order.pid)}>
                                <img src={order.pic} alt={order.name} className="w-32 h-32 object-cover rounded-lg mr-6" />
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold text-lime-600 mb-2">{order.name}</h2>
                                    <p className="text-gray-600 mb-2">
                                        <div className="desc flex flex-col">
                                            <span className="text-gray-600">Seller: {order.s_name}</span>
                                            <span className="text-gray-600">Address: {order.s_address}</span>
                                            <span className="text-gray-600">Contact: {order.s_contact}</span>
                                        </div>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className="text-2xl font-bold text-lime-600">₹{order.quantity * order.price}</p>
                                    <p className="text-lime-500 cursor-pointer text-sm mt-2">{expandedOrder === order.pid ? "Hide Details ▲" : "View Details ▼"}</p>
                                </div>
                            </div>
                            {expandedOrder === order.pid && (
                                <div className="mt-4 bg-gray-100 p-4 rounded-lg border border-gray-200">
                                    <p className="text-gray-700"><strong>Order ID:</strong> {order.oid}</p>
                                    <p className="text-gray-700"><strong>Quantity:</strong> {order.quantity}</p>
                                    <p className="text-gray-700"><strong>Price per kg:</strong> ₹{order.price}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {session && session.user.type === 'seller' && (
                <div className="space-y-8">
                    {products.map(order => (
                        <div key={order.pid} className="bg-white rounded-xl shadow-lg overflow-hidden p-6 transition transform hover:scale-105 hover:shadow-xl">
                            <div className="flex items-center cursor-pointer" onClick={() => toggleOrderDetails(order.pid)}>
                                <img src={order.pic} alt={order.name} className="w-32 h-32 object-cover rounded-lg mr-6" />
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold text-lime-600 mb-2">{order.name}</h2>
                                    <p className="text-gray-600 mb-2">
                                        <div className="desc flex flex-col">
                                            <span className="text-gray-600">Buyer: {order.b_name}</span>
                                            <span className="text-gray-600">Address: {order.b_address}</span>
                                            <span className="text-gray-600">Contact: {order.b_contact}</span>
                                        </div>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className="text-2xl font-bold text-lime-600">₹{order.quantity * order.price}</p>
                                    <p className="text-lime-500 cursor-pointer text-sm mt-2">{expandedOrder === order.pid ? "Hide Details ▲" : "View Details ▼"}</p>
                                </div>
                            </div>
                            {expandedOrder === order.pid && (
                                <div className="mt-4 bg-gray-100 p-4 rounded-lg border border-gray-200">
                                    <p className="text-gray-700"><strong>Order ID:</strong> {order.oid}</p>
                                    <p className="text-gray-700"><strong>Quantity:</strong> {order.quantity}</p>
                                    <p className="text-gray-700"><strong>Price per kg:</strong> ₹{order.price}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryComponent;
