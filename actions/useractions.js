"use server"
import { Cashfree } from "cashfree-pg"
import Payment from "@/models/Payment"
import Cart from "@/models/Cart"
import Product from "@/models/Product"
import User from "@/models/User"
import mongoose from "mongoose"
import { v4 as uuidv4 } from 'uuid';
var cashfree_id = "";
var cashfree_secret = "";

export const initiate = async (amount, username) => {

    await mongoose.connect(process.env.MONGO_URI)
    // let u = await User.findOne({ username: to_username })
    cashfree_id = process.env.KEY_ID
    cashfree_secret = process.env.KEY_SECRET
    Cashfree.XClientId = cashfree_id
    Cashfree.XClientSecret = cashfree_secret
    Cashfree.XEnvironment = Cashfree.Environment.SANDBOX
    const order = {
        "order_amount": amount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": username,
            "customer_name": "abc",
            "customer_email": "example@gmail.com",
            "customer_phone": "9999999999"
        },
        "order_meta": {
            "return_url": "https://localhost:3000/cart"
        }
    };
    let response = await Cashfree.PGCreateOrder("2022-09-01", order).then(async (response) => {
        console.log('Order Created successfully')
        await Payment.create({ oid: response.data.order_id, amount: amount, })
        return response.data
    }).catch((error) => {
        console.error('Error:', error);
    });
    return response
}
export const verify = async (orderid, email) => {

    await mongoose.connect(process.env.MONGO_URI)
    Cashfree.XClientId = cashfree_id
    Cashfree.XClientSecret = cashfree_secret
    Cashfree.XEnvironment = Cashfree.Environment.SANDBOX
    let a
    let b = false
    await Cashfree.PGOrderFetchPayments("2023-08-01", orderid).then(async (response) => {
        console.log('Order fetched successfully', response.data[0].payment_status);
        a = response.data[0].payment_status
        if (a === 'SUCCESS') {
            const updatedPayment = await Payment.findOneAndUpdate(
                { oid: orderid }, // Filter
                { done: true }, // Update operation
                { new: true } // Option to return the updated document
            );
            
            const updatedCart = await Cart.updateMany(
                { email: email, done: false }, // Filter
                { done: true, oid: orderid } // Update operation
            );

            let orders=await Cart.find({oid:orderid})
            orders.map(async e=>{
                const p= await Product.findOne({pid:e.pid})
                // console.log(p.quantity,e.quantity)
                const updatedProduct=await Product.updateOne({pid:e.pid},{quantity:p.quantity-e.quantity})
                // console.log(p)
            })

            b = true
            return b
        }
    }).catch((error) => {
        console.error('Error:', error);
    });
    return b
}

export const fetchuser = async (username) => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await User.findOne({ username: username }).lean()
    return u
}
export const adduser = async (data) => {
    await mongoose.connect(process.env.MONGO_URI)
    let user = Object.fromEntries(data)
    let userExists = await User.findOne({ email: user.email })
    if (!userExists) {
        // create a new user
        const newuser = new User({
            email: user.email,
            username: user.email.split("@")[0],
            password: user.password,
            type: user.type
        })
        await newuser.save()
        return true
    }
    return false
}

export const fetchpayments = async (username) => {
    await mongoose.connect(process.env.MONGO_URI)
    let p = await Payment.find({ to_user: username, done: true }).sort({ amount: -1 }).lean()
    return p
}

export const updateprofile = async (data, oldusername) => {
    await mongoose.connect(process.env.MONGO_URI)
    let newdata = Object.fromEntries(data)
    if (oldusername !== newdata.username) {
        let u = await User.findOne({ username: newdata.username })
        if (u) {
            return false
        }
        else {
            await User.updateOne({ email: newdata.email }, newdata)
            await Payment.updateMany({ to_user: oldusername }, { to_user: newdata.username })
            return true
        }
    }
    await User.updateOne({ email: newdata.email }, newdata)
    return true
}

export const fetchproduct = async (email) => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await Product.find({ email: email }).lean()
    return u
}
export const fetchproducts = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await Product.find().lean()
    return u
}

export const fetchproductpid = async (pid) => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await Product.findOne({ pid: pid }).lean()
    return u
}

export const fetchcart = async (email) => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await Cart.find({ email: email, done: false })
    return u
}

export const addproduct = async (data, email, pid = "NULL") => {
    await mongoose.connect(process.env.MONGO_URI)
    let newdata = Object.fromEntries(data)
    // create a new product
    const productId = pid === "NULL" ? uuidv4() : pid;
    const newproduct = new Product({
        pid: productId,
        email: email,
        name: newdata.name,
        price: newdata.price,
        quantity: newdata.quantity,
        pic: newdata.pic
    })
    await newproduct.save()
    return true
}
export const addcart = async (pid, email) => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await Cart.find({ email: email, pid: pid,done:false })
    let v= await fetchproductpid(pid)
    // add a new product to cart
    if (u.length === 0) {
        const newcart = new Cart({
            pid: pid,
            email: email,
            selleremail:v.email,
            quantity: 1,
        })
        await newcart.save()
        return true
    }
    return false
}

export const deleteeditProduct = async (id) => {
    await mongoose.connect(process.env.MONGO_URI)
    await Product.findByIdAndDelete(id)
}
export const deleteProduct = async (id, pid) => {
    await mongoose.connect(process.env.MONGO_URI)
    await Product.findByIdAndDelete(id)
    await Cart.deleteMany({ pid: pid })
}
export const deletecartProduct = async (email, pid) => {
    await mongoose.connect(process.env.MONGO_URI)
    await Cart.deleteOne({ email: email, pid: pid, done:false })
}

export const updatecart = async (email, data, pid) => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await Cart.findOne({ email: email, pid: pid,done:false })
    u.quantity = data
    console.log(data,u)
    await Cart.updateOne({ email: email, pid: pid ,done:false}, u)
    return true
}

export const order = async (email) => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await Cart.find({ email: email, done: true })
    return u
}
export const sellerorder = async (email) => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await Cart.find({ selleremail: email, done: true })
    return u
}
export const fetchseller = async (email) => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await User.findOne({ email: email }).lean()
    return u
}
export const fetchsellerl = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await User.find({ type: 'seller' })
    return u
}
export const fetchbuyerl = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await User.find({ type: 'buyer' })
    return u
}
export const orderlist = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    let u = await Cart.find({ done: true })
    return u
}
export const deleteuser = async (email) => {
    await mongoose.connect(process.env.MONGO_URI)
    await User.deleteOne({ email: email })
}