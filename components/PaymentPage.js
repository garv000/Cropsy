"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import Script from 'next/script'
import { initiate, verify, fetchuser, fetchpayments } from '@/actions/useractions'
import { load } from '@cashfreepayments/cashfree-js'
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PaymentPage = ({ params }) => {
    // const { data: session } = useSession()
    let cashfree;
    var initializeSDK = async function () {
        cashfree = await load({
            mode: "sandbox"
        });
    };
    initializeSDK();

    const doPayment = async (amount) => {
        let a = await initiate(amount, currentuser.username, paymentform)
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
                const isdone = await verify(orderid)
                if (isdone) {
                    getData(params.username)
                    toast.success('Thanks for your support', {
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
        });
    };

    const getData = async (username) => {
        let u = await fetchuser(username)
        await setcurrentuser(u)
        let p = await fetchpayments(username)
        setpayments(p)
    }

    return (
        <>
            <Script src="https://sdk.cashfree.com/js/v3/cashfree.js"></Script>
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
            <div className='bg-gray-100 min-h-[80vh] pb-16'>
                <div className='relative flex flex-col items-center'>
                    <div className='cover w-full md:h-[350px] h-auto bg-slate-600 overflow-hidden'>
                        <img className='object-cover w-full md:h-[350] h-auto' src='https://dnm.nflximg.net/api/v6/2DuQlx0fM4wd1nzqm5BFBi6ILa8/AAAAQeMzPn8iTCFkrKB7adPZBsro3vogloFzL_2LC2qUcgdlICt_-GwmjyQP5Q4gPOvmEoMc6-tGXbfs5BKcSOb10txNA8Hz2nHymjJwiMrDerrNkHfQt_anm_MvnSQRZs1fbbNfutOl4jaqZqegNirdA4TQ.jpg?r=54c' alt="" />
                    </div>
                    <div className='absolute bottom-[-55px] '>
                        <img className='rounded-full' width={110} src={currentuser.profilepic} alt="" />
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center py-16'>
                    <div className='text-3xl py-2'>
                        @{currentuser.username}
                    </div>
                    <div className='text-slate-800'>
                        Lets help {currentuser.name} get a Coffee
                    </div>
                    <div className='text-slate-800'>
                        {payments.length} Payments . ₹{payments.reduce((a,b)=>a+b.amount,0)} Raised
                    </div>
                    <div className="flex gap-4 justify-center w-[80%] mt-8 flex-col-reverse lg:flex-row">
                        <div className="supporters lg:w-1/2 w-full bg-white rounded-xl p-8">
                            <h2 className='pb-4 text-2xl font-bold'>Top Supporters</h2>
                            <ul className='max-h-[280px] overflow-auto'>
                                {payments.length == 0 && <li>&nbsp; No payments yet</li>}
                                {payments.map((p, i) => {
                                    return <li key={i} className='mb-2 flex gap-2'><div className="text-2xl xs:text-4xl">☕</div><div><span className='font-bold'>{p.name}</span> bought you a coffee of <span className='font-bold'>₹{p.amount}</span> with a message "{p.message}"</div></li>
                                })}
                            </ul>
                        </div>
                        <div className="payment lg:w-1/2 w-full bg-white rounded-xl p-8">
                            <h2 className='pb-4 text-2xl font-bold'>Buy {currentuser.username} a coffee</h2>
                            <div className='bg-[#ff813f0d] border border-[#ff813f40] rounded-xl p-4 flex items-center justify-center'>
                                <div className="text-4xl md:text-5xl">☕</div>
                                <div className="text-2xl text-grey-[71] opacity-60 font-cr-medium md:ml-4 flex items-center ml-2">x</div>
                                <div className="flex ml-2 md:ml-6 items-center">
                                    <div className="flex">
                                        <div onClick={() => setpaymentform({ ...paymentform, amount: 10 })} className="focus-within:bg-[#ff813f] focus-within:text-white relative text-[#ff813f] mr-2 bg-white rounded-full border border-[#ff813f40] border-solid flex items-center justify-center hover:border-[#ff813f] last:mr-0 md:mr-2.5 w-10 h-10 bg-pageTheme md:w-12 md:h-12"><span className="md:text-lg md:font-bold font-medium text-sm">1</span><input type="radio" autoFocus className="absolute opacity-0 w-full h-full left-0 top-0 cursor-pointer" value="10" />
                                        </div>
                                        <div onClick={() => setpaymentform({ ...paymentform, amount: 30 })} className="focus-within:bg-[#ff813f] focus-within:text-white relative mr-2 rounded-full border border-[#ff813f40] border-solid flex items-center justify-center hover:border-[#ff813f] last:mr-0 md:mr-2.5 w-10 h-10 bg-white text-[#ff813f] md:w-12 md:h-12"><span className="md:text-lg md:font-bold font-medium text-sm">3</span><input type="radio" className="absolute opacity-0 w-full h-full left-0 top-0 cursor-pointer" value="30" />
                                        </div>
                                        <div onClick={() => setpaymentform({ ...paymentform, amount: 50 })} className="focus-within:bg-[#ff813f] focus-within:text-white relative mr-2 rounded-full border border-[#ff813f40] border-solid flex items-center justify-center hover:border-[#ff813f] last:mr-0 md:mr-2.5 w-10 h-10 bg-white text-[#ff813f] md:w-12 md:h-12"><span className="md:text-lg md:font-bold font-medium text-sm">5</span><input type="radio" className="absolute opacity-0 w-full h-full left-0 top-0 cursor-pointer" value="50" />
                                        </div>
                                    </div>
                                    <input name='amount' onChange={handlechange} value={paymentform.amount} className="font-medium rounded-xl p-3 ring-1 ring-[#ff813f40] hover:ring-[#f76826] md:!w-12 md:!h-12 !px-1 bg-[#f0f0f0] !text-lg md:ml-4 ml-2 text-center text-slate-600 !w-10 !h-10" type="number" min="1" max="5000" placeholder="10" />
                                </div>
                            </div>
                            <div>
                                <input onChange={handlechange} name='name' value={paymentform.name} className="w-full bg-[#f0f0f0] font-medium mt-4 !pl-3 py-3 rounded-xl" placeholder="Name or @yoursocial" type="text" />
                                <input onChange={handlechange} name='message' value={paymentform.message} className="w-full bg-[#f0f0f0] font-medium mt-4 !pl-3 py-3 rounded-xl" placeholder="Say something nice..." type="text" />
                                <button onClick={() => doPayment(paymentform.amount)} disabled={paymentform.name.length < 1 || paymentform.message.length < 1} className='w-full rounded-full text-white bg-[#ff813f] font-bold text-xl p-2 flex items-center justify-center my-4 transition-all ease-out hover:bg-[#ff762d] disabled:opacity-90'>Pay ₹{paymentform.amount}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentPage
