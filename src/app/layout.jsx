import React from 'react';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'MRPurna - Fresh Organic Grocery Store',
  description: 'Full-stack Headless Grocery Store for Fresh Vegetables and Organic Fruits. Powered by Express REST APIs, Supabase & Next.js 14.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between bg-[#f4f7f5]">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
