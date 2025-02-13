"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchcart, fetchproductpid, deletecartProduct, updatecart } from '@/actions/useractions'

import Script from 'next/script'
import { initiate, verify, fetchuser, fetchpayments } from '@/actions/useractions'
import { load } from '@cashfreepayments/cashfree-js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const page = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [cart, setCart] = useState([])
    const [products, setProducts] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    let cashfree;
    var initializeSDK = async function () {
        cashfree = await load({
            mode: "sandbox"
        });
    };
    initializeSDK();

    const doPayment = async (amount) => {
        let a = await initiate(amount, session.user.name)
        let orderid = a.order_id
        let checkoutOptions = {
            paymentSessionId: a.payment_session_id,
            redirectTarget: "_modal",
        };
        cashfree.checkout(checkoutOptions).then(async (result) => {
            if (result.error) {
                // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
                console.log("User has closed the popup or there is some payment error, Check for Payment Status");
                console.log(result.error);
            }
            if (result.redirect) {
                // This will be true when the payment redirection page couldnt be opened in the same window
                // This is an exceptional case only when the page is opened inside an inAppBrowser
                // In this case the customer will be redirected to return url once payment is completed
                console.log("Payment will be redirected");
            }
            if (result.paymentDetails) {
                // This will be called whenever the payment is completed irrespective of transaction status
                console.log("Payment has been completed, Check for Payment Status");
                console.log(result.paymentDetails.paymentMessage);
                const isdone = await verify(orderid,session.user.email)
                // console.log(isdone)
                if (isdone) {
                    // console.log('success')
                    toast.success('Order successfull', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored"
                    });
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000);
                }
                else{
                    console.log('fail')
                    toast.error('Payment failed', {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored"
                          });
                }
            }
        });
    };





    const getCart = async () => {
        if (session?.user?.email) {
            try {
                // Fetch cart
                const cartData = await fetchcart(session.user.email)
                setCart(cartData)  // Set the cart state directly
                console.log(cartData)

                // Initialize an empty array to store product details
                let fetchedProducts = []
                let total = 0

                // Loop through each cart item and fetch product details
                for (let i = 0; i < cartData.length; i++) {
                    const product = await fetchproductpid(cartData[i].pid)
                    const productDetails = product  // Assuming product is returned as an array with one element
                    const productWithQuantity = {
                        ...productDetails,
                        qty: cartData[i].quantity, // Add the quantity from cart data
                    }
                    fetchedProducts.push(productWithQuantity)

                    // Calculate the total price
                    total += productWithQuantity.price * productWithQuantity.qty
                }

                setProducts(fetchedProducts)
                setTotalPrice(total)  // Set the total price once all products are fetched
            } catch (error) {
                console.error("Error fetching cart or products:", error)
            }
        }
    }

    const updateQuantity = async (pid, qty) => {
        await updatecart(session.user.email, qty, pid)
        setProducts(prevProducts => {
            const updatedProducts = prevProducts.map(product => {
                if (product.pid === pid) {
                    product.qty = qty
                }
                return product
            })
            return updatedProducts
        })
    }
    const removeProduct = async(pid) => {
        // Filter out the product with the matching _id or pid
        await deletecartProduct(session.user.email, pid)
        const updatedProducts = products.filter(product => product.pid !== pid);
        // Update the state with the filtered product list
        setProducts(updatedProducts);
        window.location.reload()
        window.location.reload()
    };
    useEffect(() => {
        const updatedTotalPrice = products.reduce((total, product) => {
            return total + (product.price * product.qty)
        }, 0)

        setTotalPrice(updatedTotalPrice)
    }, [products]) // Update the total price when products change (i.e., when quantity changes)

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN')}`  // Format the number as INR with commas
    }

    useEffect(() => {
        if (session) {
            if (session.user.type === 'seller') {
                router.push('/')
            } else {
                router.push('/cart')
                getCart()  // Fetch the cart and products when session exists
            }
        } else {
            router.push('/login')
        }
    }, [session, router])  // Depend on session and router

    return (
        <>

            <Script src="https://sdk.cashfree.com/js/v3/cashfree.js"></Script>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <div className="bg-gray-100 dark:bg-gray-900 bg-opacity-80">
                <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 md:py-20 bg-opacity-80">
                    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 sm:text-3xl">Shopping Cart</h2>

                        <div className="mt-6 sm:mt-8 lg:flex lg:gap-10 xl:gap-16 bg-opacity-80">
                            <div className="flex flex-col w-full lg:w-2/3 space-y-6">
                                {/* Loop through products and render dynamically */}
                                {products.map((product) => {
                                    const updatedPrice = product.price * product.qty;

                                    return (
                                        <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden md:flex items-center justify-between space-x-4 px-4 py-5 md:px-6">
                                            <div className="flex items-center space-x-4">
                                                <img className="h-20 w-20 object-cover rounded-lg shadow-md" src={product.pic} alt={product.name || 'pic'} />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-semibold text-lime-600 dark:text-white truncate">{product.name}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{product.price}/kg</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(product.pid, Math.max(product.qty - 1, 1))}
                                                        className="inline-flex items-center justify-center p-2 text-lg font-semibold text-gray-600 dark:text-gray-200 rounded-md border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        disabled={product.quantity <= 1}
                                                    >
                                                        <span>-</span>
                                                    </button>
                                                    <span className="text-lg font-medium text-lime-600 dark:text-white">{product.qty}</span>
                                                    <button
                                                        onClick={() => updateQuantity(product.pid, product.qty + 1)}
                                                        className="inline-flex items-center justify-center p-2 text-lg font-semibold text-gray-600 dark:text-gray-200 rounded-md border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        disabled={product.qty >= product.quantity}
                                                    >
                                                        <span>+</span>
                                                    </button>
                                                </div>

                                                <p className="text-lg font-medium text-lime-600 dark:text-white">₹{updatedPrice.toLocaleString('en-IN')}</p>

                                                <button
                                                    onClick={() => { removeProduct(product.pid) }}
                                                    className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Order summary */}
                            <div className="mt-6 lg:mt-0 lg:w-1/3 bg-gray-100 dark:bg-gray-700 rounded-lg p-6 shadow-xl">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Order Summary</h3>
                                <div className="space-y-4 mt-4">
                                    <dl className="flex justify-between text-gray-700 dark:text-gray-300">
                                        <dt className="text-base font-normal">Original Price</dt>
                                        <dd className="text-base font-medium">{formatCurrency(totalPrice)}</dd>
                                    </dl>

                                    <dl className="flex justify-between text-gray-700 dark:text-gray-300">
                                        <dt className="text-base font-normal">Platform Fees</dt>
                                        <dd className="text-base font-medium">{formatCurrency(10)}</dd>
                                    </dl>

                                    <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-600 pt-4">
                                        <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                                        <dd className="text-base font-bold text-gray-900 dark:text-white">{formatCurrency(totalPrice + 10)}</dd>
                                    </div>
                                </div>

                                <button
                                    onClick={() => doPayment(totalPrice)}
                                    className="w-full mt-6 py-3 text-lg font-semibold text-white bg-lime-600 rounded-lg hover:bg-lime-700 focus:outline-none focus:ring-4 focus:ring-lime-300 dark:bg-lime-500 dark:hover:bg-lime-600 dark:focus:ring-lime-700"
                                >
                                    Proceed to Checkout
                                </button>

                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
                                    <a href="/" className="text-sm font-medium text-primary-700 dark:text-primary-500 hover:underline">Continue Shopping</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default page;
