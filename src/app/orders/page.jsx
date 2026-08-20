'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Calendar, Package, ArrowRight, Loader2, AlertCircle, ShoppingCart } from 'lucide-react';
import { fetchUserOrders } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function MyOrdersPage() {
  const { profile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) {
      const loadOrders = async () => {
        try {
          const data = await fetchUserOrders();
          if (data.success) {
            setOrders(data.orders || []);
          }
        } catch (err) {
          setError('Failed to fetch your MRPurna order history.');
        } finally {
          setLoading(false);
        }
      };
      loadOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [profile, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-slate-200">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-700">Loading your grocery orders...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-xl font-black text-slate-800">Please Login</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          You need to be logged in to view your MRPurna order history and track your fresh produce.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow hover:bg-emerald-700 transition"
        >
          Go to Home & Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <ShoppingBag size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">My MRPurna Orders</h1>
          <p className="text-xs text-slate-500 font-bold">Track your fresh farm-to-home grocery history</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-lg border border-red-100 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">No orders placed yet</h2>
          <p className="text-xs text-slate-500">Your fresh grocery journey starts here. Explore our organic catalog!</p>
          <Link
            href="/"
            className="inline-block bg-emerald-600 text-white font-bold px-8 py-3 rounded-full text-xs shadow-md hover:bg-emerald-700 transition"
          >
            Start Shopping Now
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    Order ID: <span className="font-mono text-emerald-700">#{order.id.slice(-8).toUpperCase()}</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {order.products.length} {order.products.length === 1 ? 'item' : 'items'} • 
                    <span className="text-slate-800 font-bold ml-1">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                      order.order_status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.order_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.order_status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">Payment: {order.payment_status}</span>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="bg-slate-900 text-white p-2.5 rounded-full hover:bg-emerald-600 transition shadow-sm"
                    title="Track Order"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {order.products.map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 shadow-sm">
                    <Package size={10} className="text-emerald-500" /> {item.name} ({item.quantity} {item.unit})
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
