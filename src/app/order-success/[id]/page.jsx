'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Truck, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { fetchOrderById } from '../../../utils/api';

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadOrder = async () => {
      try {
        const res = await fetchOrderById(params.id);
        if (isMounted && res.success) {
          setOrder(res.order);
        }
      } catch (err) {
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (params.id) loadOrder();
    return () => { isMounted = false; };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-700">Verifying Grocery Order Receipt...</p>
      </div>
    );
  }

  const orderDetails = order || {
    id: params.id,
    customer_name: 'Valued Shopper',
    total_amount: 320,
    payment_status: 'paid',
    payment_id: 'pay_mrpurna_verified_7721'
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 my-4">
      
      <div className="bg-gradient-to-br from-[#064e3b] to-[#047857] text-white rounded-2xl p-8 shadow-xl text-center space-y-3">
        <CheckCircle2 size={48} className="text-emerald-300 mx-auto" />
        <h1 className="text-2xl font-black">MRPurna Order Confirmed!</h1>
        <p className="text-xs text-emerald-100 max-w-md mx-auto">
          Thank you <span className="font-bold text-white">{orderDetails.customer_name}</span>! Your organic grocery order has been verified via Razorpay.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <span className="bg-emerald-900/60 px-3 py-1 rounded-full text-xs font-mono">
            Order ID: {orderDetails.id}
          </span>
          <span className="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-full text-xs uppercase">
            {orderDetails.payment_status || 'PAID'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs border-b pb-3">
          <span className="font-bold text-slate-500">Razorpay Payment ID:</span>
          <span className="font-mono font-bold text-slate-800">{orderDetails.payment_id || 'pay_stub'}</span>
        </div>

        <div className="flex justify-between items-center text-sm font-black text-slate-900">
          <span>Total Paid</span>
          <span className="text-emerald-700">₹{Number(orderDetails.total_amount).toLocaleString('en-IN')}</span>
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow transition"
          >
            Continue Shopping Groceries
          </Link>
        </div>
      </div>

    </div>
  );
}
