'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#064e3b] text-white pt-10 pb-6 mt-16 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Value Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-emerald-800 text-xs">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Same-Day Express Delivery</p>
              <p className="text-emerald-200 text-[11px]">Farm fresh produce delivered to your doorstep</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">100% Quality Guarantee</p>
              <p className="text-emerald-200 text-[11px]">Hand-picked vegetables & organic fruits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Headless REST API Architecture</p>
              <p className="text-emerald-200 text-[11px]">Seamless mobile app REST integration</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-400" />
            <span className="font-bold text-white text-base">MRPurna Grocery</span>
          </div>
          <p>© 2026 MRPurna Grocery Stores Ltd. All Rights Reserved.</p>
          <div className="font-mono text-[11px] bg-emerald-900/60 px-3 py-1 rounded border border-emerald-700">
            REST API: http://localhost:5000/api
          </div>
        </div>

      </div>
    </footer>
  );
}
