import NextAuth from 'next-auth'
import AppleProvider from 'next-auth/providers/apple'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import mongoose from 'mongoose'
import User from '@/models/User'
import Payment from '@/models/Payment'

export const authoptions = NextAuth({
    providers: [
        // OAuth authentication providers...
        // AppleProvider({
        //     clientId: process.env.APPLE_ID,
        //     clientSecret: process.env.APPLE_SECRET
        // }),
        // FacebookProvider({
        //     clientId: process.env.FACEBOOK_ID,
        //     clientSecret: process.env.FACEBOOK_SECRET
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        // // Passwordless / email sign in
        // EmailProvider({
        //     server: process.env.MAIL_SERVER,
        //     from: 'NextAuth.js <no-reply@example.com>'
        // }),
        // GitHubProvider({
        //     clientId: process.env.GITHUB_ID,
        //     clientSecret: process.env.GITHUB_SECRET
        // }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                // console.log(credentials)
                const email = credentials.email;
                const password = credentials.password;
                // console.log(credentials.email,credentials.password)
                // console.log(email,password)
                await mongoose.connect(process.env.MONGO_URI)
                const userExists = await User.findOne({ email:credentials.email })
                if (!userExists) {
                    throw new Error('User not found');
                }
                else if(credentials.password!==userExists.password){
                    throw new Error('Password is incorrect')
                }
                return { email: userExists.email, username: userExists.username, id: userExists._id };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            await mongoose.connect(process.env.MONGO_URI)
            // check if user already exists in database
            if (account.provider === "google") {
                const userExists = await User.findOne({ email: user.email })
                if (!userExists) {
                    throw new Error('User not found');
                }
                // if (!userExists) {
                //     // create a new user
                //     const newuser = new User({
                //         email: user.email,
                //         username: user.email.split("@")[0]
                //     })
                //     await newuser.save()
                // }
                return true
            }
            else {
                const userExists = await User.findOne({ email: credentials.email })
                if (!userExists) {
                    throw new Error('User not found');
                }
                else if(credentials.password!==userExists.password){
                    throw new Error('Password is incorrect')
                }
                return { email: userExists.email, username: userExists.username, id: userExists._id };
            }
        },
        async session({ session, user, token, credentials }) {
            await mongoose.connect(process.env.MONGO_URI)
            const dbuser = await User.findOne({ email: session.user.email })
            session.user.type=dbuser.type
            session.user.name = dbuser.username
            return session
        },
    },
    pages: {
        signIn: '/login', // Redirect to your custom sign-in page if needed
    },
    session: {
        strategy: 'jwt', // Use JWT for session management
    },
})

export { authoptions as GET, authoptions as POST }