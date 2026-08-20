'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, Zap, ArrowLeft, Loader2, Check, ChevronLeft, ChevronRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { fetchProductById } from '../../../utils/api';
import { useCart } from '../../../context/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchProductById(params.id);
        if (isMounted && res.success) {
          setProduct(res.product);
        }
      } catch (err) {
        console.error('MRPurna product detail error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (params.id) loadProduct();
    return () => { isMounted = false; };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-slate-200">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-700">Loading Product Gallery & Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Product Not Found</h2>
        <button
          onClick={() => router.push('/')}
          className="bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow hover:bg-emerald-700 transition"
        >
          Return to MRPurna Storefront
        </button>
      </div>
    );
  }

  // Handle images array (Up to 5 images)
  const imageList = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image_url || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'];

  const prevImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImageIndex(prev => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="space-y-6">
      
      {/* Back CTA */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      {/* Main Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Flipkart-style 5 Image Carousel */}
        <div className="lg:col-span-6 flex flex-col md:flex-row gap-4">
          
          {/* Thumbnails Column (up to 5 thumbnails) */}
          <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-y-auto max-h-96 custom-scrollbar shrink-0">
            {imageList.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                onMouseEnter={() => setActiveImageIndex(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 p-1 bg-slate-50 transition shrink-0 ${
                  activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Main Active Image Carousel Viewer */}
          <div className="flex-1 order-1 md:order-2 bg-slate-50 rounded-xl border border-slate-200 relative aspect-square p-6 flex items-center justify-center overflow-hidden group">
            <img
              src={imageList[activeImageIndex]}
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />

            {/* Slider Navigation Arrows */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 rounded-full p-2 shadow-md transition"
                  title="Previous Image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 rounded-full p-2 shadow-md transition"
                  title="Next Image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Image Indicator Counter */}
            <span className="absolute bottom-3 right-3 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
              {activeImageIndex + 1} / {imageList.length} Photos
            </span>
          </div>

        </div>

        {/* Right Column: Product Specs & Options */}
        <div className="lg:col-span-6 space-y-5">
          
          <div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-2 text-white ${
              product.category === 'Vegetables' ? 'bg-amber-600' : 'bg-emerald-600'
            }`}>
              {product.category}
            </span>
            <h1 className="text-2xl font-black text-slate-900 leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Quantity / Package Unit: <span className="text-slate-800 font-extrabold">{product.quantity} {product.unit}</span>
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-1">
            <p className="text-xs text-emerald-800 font-bold">MRPurna Direct Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                / {product.quantity} {product.unit}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium pt-1">
              Inclusive of all fresh farm taxes & packaging
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-6 py-3 border-y border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Select Packs:</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg outline-none"
              >
                {[1, 2, 3, 4, 5, 10].map(n => (
                  <option key={n} value={n}>{n} pack ({n * product.quantity} {product.unit})</option>
                ))}
              </select>
            </div>

            <div>
              {product.stock > 0 ? (
                <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1">
                  <Check size={14} /> Fresh Stock Available ({product.stock} units)
                </span>
              ) : (
                <span className="text-xs text-red-600 font-bold">Currently Out of Stock</span>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow ${
                added ? 'bg-emerald-800 text-white' : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
              }`}
            >
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
              {added ? 'Added to Cart' : 'Add to Cart'}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow"
            >
              <Zap size={18} /> Buy Now
            </button>
          </div>

          {/* Product Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description & Recipe Uses</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {product.description}
            </p>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-emerald-600 shrink-0" />
              <span>Same Day Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              <span>Farm Organic</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw size={14} className="text-emerald-600 shrink-0" />
              <span>Easy Replacement</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
