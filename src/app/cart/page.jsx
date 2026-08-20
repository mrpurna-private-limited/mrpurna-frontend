'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, subtotal, deliveryFee, total } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8 space-y-4 shadow-sm">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-xl font-black text-slate-800">Your MRPurna Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Add farm fresh raw papaya, green bananas, mushrooms, capsicums, crisp apples, and organic fruits to your cart.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow transition uppercase tracking-wide"
        >
          Explore Fresh Groceries
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShoppingBag className="text-emerald-600" /> MRPurna Grocery Cart ({cartItems.length} items)
        </h1>
        <Link href="/" className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Add More Items
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Item List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {cartItems.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row items-center gap-4 hover:bg-slate-50/50 transition">
              
              <Link href={`/product/${item.id}`} className="w-16 h-16 shrink-0 bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center justify-center">
                <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain" />
              </Link>

              <div className="flex-1 text-center sm:text-left space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {item.category}
                </span>
                <Link href={`/product/${item.id}`}>
                  <h3 className="text-xs font-extrabold text-slate-800 hover:text-emerald-700 transition">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-[11px] text-slate-500">
                  Unit: {item.item_quantity} {item.unit}
                </p>
                <p className="text-xs font-black text-slate-900 pt-0.5">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Quantity controller */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xs font-black text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
              BILL DETAILS
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Item Total</span>
                <span className="font-bold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
                )}
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-sm font-black text-slate-900">
                <span>To Pay</span>
                <span className="text-lg text-emerald-700">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow transition uppercase text-xs tracking-wider flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
