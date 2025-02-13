import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Nunito } from 'next/font/google'
import SessionWrapper from "@/components/SessionWrapper";

const nunito = Nunito({ subsets: ['latin'], weight: '700' })

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Cropsy",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={nunito.className}
        style={{
          backgroundImage: "url('https://images.alphacoders.com/127/thumb-1920-1274679.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          }
        }
       >
        <SessionWrapper>
          <Navbar />
          <div className="min-h-[80vh] ">
            {children}
          </div>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
