'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Leaf, Sparkles, Loader2, ArrowUpDown, Carrot, Apple } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../utils/api';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-sm font-semibold text-emerald-700">Loading MRPurna Fresh…</div>}>
      <HomeCatalog />
    </Suspense>
  );
}

function HomeCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryQuery = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);

  useEffect(() => {
    setSelectedCategory(categoryQuery);
  }, [categoryQuery]);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          sort: sortBy
        });
        if (isMounted && data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('MRPurna REST API error:', err);
          setError('Could not connect to Express REST API server (http://localhost:5000). Showing fallback products.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();
    return () => { isMounted = false; };
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategoryTab = (catName) => {
    setSelectedCategory(catName);
    if (catName !== 'All') {
      router.push(`/?category=${catName}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="space-y-7 pb-8">
      
      {/* MRPurna Hero Banner */}
      {!searchQuery && (
        <div className="bg-gradient-to-br from-[#14532d] via-[#15803d] to-[#16a34a] rounded-3xl text-white p-7 md:p-11 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="z-10 max-w-xl space-y-3">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <Sparkles size={14} /> 100% Farm Fresh Guarantee
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Welcome to <span className="text-emerald-300">MRPurna</span> Grocery
            </h1>
            <p className="text-xs md:text-sm text-emerald-100 leading-relaxed">
              Order fresh raw papaya, green bananas, mushrooms, capsicums, crisp apples, avocados, kiwi, and 26 exclusive farm-fresh products. Headless REST API powered.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button 
                onClick={() => handleCategoryTab('Vegetables')}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-5 py-2.5 rounded-full text-xs md:text-sm shadow-md transition flex items-center gap-1.5"
              >
                <Carrot size={16} /> Shop Fresh Vegetables
              </button>
              <button 
                onClick={() => handleCategoryTab('Fruits')}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-2.5 rounded-full text-xs md:text-sm shadow-md transition flex items-center gap-1.5"
              >
                <Apple size={16} /> Shop Organic Fruits
              </button>
            </div>
          </div>

          <div className="relative z-10 shrink-0 hidden md:block">
            <div className="w-56 h-48 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80"
                alt="MRPurna Produce"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <p className="text-xs font-bold text-emerald-300">Daily Morning Orchard Harvest</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCategoryTab('All')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 ${
              selectedCategory === 'All' ? 'bg-[#16a34a] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <Leaf size={14} /> All Products
          </button>
          
          <button
            onClick={() => handleCategoryTab('Vegetables')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 ${
              selectedCategory === 'Vegetables' ? 'bg-[#16a34a] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <Carrot size={14} /> Vegetables (8)
          </button>

          <button
            onClick={() => handleCategoryTab('Fruits')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 ${
              selectedCategory === 'Fruits' ? 'bg-[#16a34a] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <Apple size={14} /> Fruits (18)
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <ArrowUpDown size={14} /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="name">Alphabetical (A-Z)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Products Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-800">
            {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory !== 'All' ? `${selectedCategory} Section` : 'Complete Grocery Catalog'}
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {products.length} Items Available
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-700">Finding the freshest products for you…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <h3 className="text-base font-bold text-slate-800">No products found. Please refresh!</h3>
            <button
              onClick={() => handleCategoryTab('All')}
              className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow hover:bg-emerald-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
