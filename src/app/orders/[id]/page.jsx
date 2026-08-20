'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Truck, 
  Package, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  Loader2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { fetchOrderById } from '../../../utils/api';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(id);
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Order not found.');
        }
      } catch (err) {
        setError('Error fetching tracking details.');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const statusSteps = [
    { label: 'Order Placed', icon: Clock, desc: 'Your grocery request is received.' },
    { label: 'Processing', icon: ShoppingBag, desc: 'Quality check & selection in progress.' },
    { label: 'Packed', icon: Package, desc: 'Farm-fresh items safely packed.' },
    { label: 'Out for Delivery', icon: Truck, desc: 'Assigned to delivery partner.' },
    { label: 'Delivered', icon: CheckCircle2, desc: 'Handed over successfully.' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-sm font-black text-slate-700">Connecting to MRPurna Logistics Engine...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-lg">
        <AlertTriangle size={48} className="text-amber-500 mx-auto" />
        <h1 className="text-xl font-black text-slate-800">Tracking Unavailable</h1>
        <p className="text-xs text-slate-500">{error || 'The order you are looking for does not exist.'}</p>
        <button onClick={() => router.push('/orders')} className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md">
          Back to My Orders
        </button>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex(s => s.label === order.order_status);
  const isCancelled = order.order_status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Back & Title */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 font-bold text-xs transition">
          <ArrowLeft size={16} /> Go Back
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Reference</p>
          <p className="text-sm font-mono font-bold text-emerald-800 uppercase">#{order.id.slice(-12)}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left Column: Status Timeline */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
              Live Delivery Timeline
              {isCancelled && <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full">CANCELLED</span>}
            </h2>

            {!isCancelled ? (
              <div className="relative space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-100 -z-0"></div>

                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  const Icon = step.icon;

                  return (
                    <div key={idx} className="flex items-start gap-6 relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 ${
                        isCompleted ? 'bg-emerald-600 border-emerald-100 text-white shadow-md' : 'bg-white border-slate-50 text-slate-300'
                      } ${isCurrent ? 'animate-pulse scale-110 ring-4 ring-emerald-50' : ''}`}>
                        <Icon size={20} />
                      </div>
                      <div className="pt-1">
                        <p className={`text-sm font-black ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {isCompleted ? step.desc : 'Waiting to reach this stage...'}
                        </p>
                        {isCurrent && (
                          <span className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                            <Clock size={10} /> Updated just now
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
                <h3 className="font-bold text-red-800">Order Cancelled</h3>
                <p className="text-xs text-red-600">This order was cancelled. Please contact support for details.</p>
              </div>
            )}
          </div>

          {/* Items Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
            <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
              <Package size={18} className="text-emerald-600" /> Order Items Summary
            </h3>
            <div className="divide-y divide-slate-100">
              {order.products.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-emerald-600">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold">Qty: {item.quantity} {item.unit}</p>
                    </div>
                  </div>
                  <p className="text-xs font-black text-slate-900">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Details */}
        <div className="space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin size={14} /> Delivery Location
            </h3>
            <div className="space-y-2">
              <p className="text-sm font-black text-slate-800">{order.customer_name}</p>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {order.address?.street || '123, Organic Lane'}<br />
                {order.address?.city || 'Farmers Market Area'}, {order.address?.zip || '400001'}
              </p>
              <p className="text-xs font-bold text-emerald-700 mt-2">{order.customer_phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-slate-900 text-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
            <ShieldCheck size={100} className="absolute -right-4 -bottom-4 text-white/5" />
            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CreditCard size={14} /> Payment Transaction
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-400 font-bold">Status</span>
                <span className="font-black text-emerald-400 uppercase tracking-tighter italic">{order.payment_status}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-400 font-bold">Method</span>
                <span className="font-bold">Razorpay Secure</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-xl font-black text-amber-400">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter">Buyer Protection</p>
              <p className="text-[9px] text-emerald-600 font-bold leading-tight mt-0.5">Your payment is safe with MRPurna. Farm fresh quality or money back guarantee.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
