'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const mainImage = Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : product.image_url || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group">
      
      {/* Image Showcase */}
      <Link href={`/product/${product.id}`} className="relative block aspect-square bg-[#f7faf7] overflow-hidden p-5">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        <span className="absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm text-emerald-800 bg-emerald-100">
          100% Organic
        </span>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Weight / Unit badge */}
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mb-1.5">
            {product.quantity} {product.unit}
          </span>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="text-sm font-bold text-slate-800 line-clamp-1 hover:text-emerald-700 transition">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
          <div>
            <span className="text-base font-extrabold text-slate-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block">
              per {product.quantity} {product.unit}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-3 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1 transition shadow-sm ${
              added
                ? 'bg-emerald-700 text-white'
                : product.stock === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#16a34a] hover:bg-emerald-700 text-white'
            }`}
          >
            {added ? (
              <>
                <Check size={14} /> Added
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingBag size={14} /> + ADD
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
