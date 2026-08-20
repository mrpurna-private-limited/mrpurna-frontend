'use client';

import React, { useState } from 'react';
import { CreditCard, Smartphone, ShieldCheck, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { verifyPayment } from '../utils/api';

export default function RazorpayModal({ isOpen, onClose, orderDetails, onSuccess }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !orderDetails) return null;

  const handlePayNow = async () => {
    setProcessing(true);
    setError('');

    try {
      const mockPaymentPayload = {
        order_id: orderDetails.order_id,
        razorpay_order_id: orderDetails.razorpay_order_id,
        razorpay_payment_id: `pay_mrpurna_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      };

      const result = await verifyPayment(mockPaymentPayload);

      if (result.success) {
        setProcessing(false);
        onSuccess(result.order || { id: orderDetails.order_id });
      } else {
        throw new Error(result.message || 'Payment verification failed');
      }
    } catch (err) {
      setProcessing(false);
      setError(err.message || 'Payment processing error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#042f2e] text-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-800">
        
        {/* Razorpay Brand Header */}
        <div className="bg-[#0f766e] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-400 font-black text-slate-900 flex items-center justify-center text-lg">
              R
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                Razorpay <span className="bg-emerald-900 text-emerald-200 text-[10px] px-1.5 py-0.5 rounded">TEST MODE</span>
              </h4>
              <p className="text-[11px] text-emerald-100">MRPurna Grocery Checkout</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1 rounded-full">
            <X size={18} />
          </button>
        </div>

        {/* Amount */}
        <div className="p-5 bg-emerald-950/60 border-b border-emerald-800 space-y-1">
          <p className="text-xs text-emerald-300 font-medium">Total Amount Payable</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              ₹{(orderDetails.amount / 100).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <ShieldCheck size={14} /> 256-bit Encrypted
            </span>
          </div>
          <p className="text-[11px] text-emerald-300 truncate">Order ID: {orderDetails.razorpay_order_id}</p>
        </div>

        {/* Actions */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-red-900/50 text-red-200 border border-red-700 text-xs p-3 rounded flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-emerald-900/40 rounded border border-emerald-800 text-xs space-y-1 text-emerald-200">
            <p className="font-bold text-white">Payment Method: UPI / Card Sandbox</p>
            <p>Click below to verify Razorpay checkout test signature.</p>
          </div>

          <button
            onClick={handlePayNow}
            disabled={processing}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-lg shadow flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm"
          >
            {processing ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Verifying Payment...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} /> Pay ₹{(orderDetails.amount / 100).toLocaleString('en-IN')} (Test Mode)
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
