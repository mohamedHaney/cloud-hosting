import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import Header from "@/components/header/Header"
import Footer from "@/components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cloud Hosting",
  description: "Cloud Hosting Project",
    icons: {
    icon: "/favicon.ico",
  },
};
interface RootLayoutPorps{
  children : React.ReactNode
}
export default function RootLayout({children}:RootLayoutPorps) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
        <Header/>
        <ToastContainer theme="colored" position="top-center"/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}
