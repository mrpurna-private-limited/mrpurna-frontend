'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, LogOut, Leaf, X, Apple, Carrot, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { profile, logout, login, register } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setIsAuthModalOpen(false);
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      setAuthError(err.message || 'Auth failed');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 text-slate-800 shadow-sm backdrop-blur border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#16a34a] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <Leaf size={24} className="fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#166534] flex items-center gap-1">
                MRPurna <span className="text-emerald-500">Fresh</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold tracking-wider uppercase -mt-1">
                Fresh Farm Grocery
              </span>
            </div>
          </Link>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="Search fresh Papaya, Mushroom, Apple, Avocado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-5 pr-12 text-sm text-slate-800 bg-slate-100 rounded-full outline-none border border-slate-200 focus:ring-2 focus:ring-emerald-300 focus:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-[#16a34a] hover:bg-emerald-700 text-white rounded-full transition flex items-center justify-center"
              title="Search"
            >
              <Search className="w-4 h-4 font-bold" />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 text-sm font-semibold">
            {profile ? (
              <div className="relative group py-2">
                <button className="flex items-center gap-1.5 bg-emerald-800 text-emerald-100 px-3.5 py-1.5 rounded-full font-semibold border border-emerald-700 hover:bg-emerald-700 transition">
                  <User size={16} />
                  <span>{profile.email.split('@')[0]}</span>
                </button>
                <div className="absolute right-0 top-full pt-1 hidden group-hover:block w-48 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs">
                    <p className="text-slate-400">Signed in as</p>
                    <p className="font-bold truncate text-slate-800">{profile.email}</p>
                  </div>
                  <Link
                    href="/orders"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-slate-50 text-slate-700 font-semibold border-b border-slate-50"
                  >
                    <ShoppingBag size={16} className="text-emerald-600" /> My Orders
                  </Link>
                  {profile.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-amber-50 text-amber-700 font-bold border-b border-slate-50"
                    >
                      <ShieldCheck size={16} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-red-50 text-red-600 font-semibold text-left"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:inline-flex bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold transition"
              >
                Login
              </button>
            )}

            {/* Cart Link */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-[#16a34a] hover:bg-emerald-700 text-white px-4 py-2 rounded-full transition relative shadow-sm"
            >
              <div className="relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>

        {/* Sub-Header Categories */}
        <nav className="bg-emerald-50 border-t border-emerald-100 text-emerald-900 text-xs font-semibold">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 py-2">
            <Link href="/" className="hover:text-emerald-600 transition flex items-center gap-1.5">
              <span>All Groceries</span>
            </Link>
            <Link href="/?category=Vegetables" className="hover:text-emerald-600 transition flex items-center gap-1.5">
              <Carrot size={14} className="text-amber-400" /> Fresh Vegetables (8)
            </Link>
            <Link href="/?category=Fruits" className="hover:text-emerald-600 transition flex items-center gap-1.5">
              <Apple size={14} className="text-[#f43f5e]" /> Organic Fruits (18)
            </Link>
          </div>
        </nav>
      </header>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative border border-slate-200">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition"
            >
              <X size={18} />
            </button>

            <div className="bg-[#064e3b] text-white p-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Leaf className="text-emerald-400" /> MRPurna Grocery Login
              </h3>
              <p className="text-xs text-emerald-200 mt-1">
                Access your organic grocery cart and order history
              </p>
            </div>

            <div className="p-6">
              <div className="flex border-b border-slate-200 mb-4">
                <button
                  type="button"
                  onClick={() => setIsLoginTab(true)}
                  className={`flex-1 py-2 text-sm font-semibold border-b-2 ${isLoginTab ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLoginTab(false)}
                  className={`flex-1 py-2 text-sm font-semibold border-b-2 ${!isLoginTab ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400'}`}
                >
                  Register
                </button>
              </div>

              {authError && (
                <div className="bg-red-50 text-red-600 text-xs font-semibold p-2.5 rounded mb-3 border border-red-200">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-md shadow uppercase text-xs tracking-wider"
                >
                  {isLoginTab ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
