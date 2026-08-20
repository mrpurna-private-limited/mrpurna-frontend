'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Plus, Package, ShoppingBag, Trash2, Edit, X, Loader2, Leaf, AlertTriangle, MessageCircle, RefreshCw } from 'lucide-react';
import { 
  fetchProducts, 
  createProductAdmin, 
  deleteProductAdmin, 
  updateProductAdmin, 
  fetchAdminOrders,
  updateOrderStatusAdmin,
  fetchWhatsAppStatusAdmin
} from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { profile, isAdmin, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [whatsAppStatus, setWhatsAppStatus] = useState({ ready: false, qr: null });
  const [whatsAppLoading, setWhatsAppLoading] = useState(false);

  // Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('50');
  
  // 5 Image URLs State
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [img4, setImg4] = useState('');
  const [img5, setImg5] = useState('');

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [prodData, orderData] = await Promise.all([
        fetchProducts({}),
        fetchAdminOrders().catch(() => ({ orders: [] }))
      ]);

      if (prodData.products) setProducts(prodData.products);
      if (orderData.orders) setOrders(orderData.orders);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadWhatsAppStatus = async () => {
    setWhatsAppLoading(true);
    try {
      const data = await fetchWhatsAppStatusAdmin();
      if (data.success) setWhatsAppStatus({ ready: data.ready, qr: data.qr });
    } catch (err) {
      console.error('WhatsApp status error:', err);
    } finally {
      setWhatsAppLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return undefined;
    loadWhatsAppStatus();
    const refreshTimer = setInterval(loadWhatsAppStatus, 5000);
    return () => clearInterval(refreshTimer);
  }, [isAdmin]);

  // If Auth loading, show spinner
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-slate-200">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-700">Verifying Route Access...</p>
      </div>
    );
  }

  // 404 GUARD FOR REGULAR USERS / UNAUTHENTICATED
  if (!profile || profile.role !== 'admin') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center max-w-md mx-auto my-12 space-y-4 shadow-sm">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 font-extrabold text-2xl">
          404
        </div>
        <h1 className="text-2xl font-black text-slate-800">404 - Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested route <span className="font-mono text-slate-700">/admin</span> does not exist or you do not have permission to view it.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow hover:bg-emerald-700 transition"
        >
          Return to MRPurna Home
        </button>
      </div>
    );
  }

  // ADMIN DASHBOARD CONTENT (ONLY FOR ADMIN ROLE)
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setMessage('');

    try {
      const imagesArray = [img1, img2, img3, img4, img5].filter(url => url.trim() !== '');

      const payload = {
        name,
        category,
        price: parseFloat(price),
        description: description || name,
        quantity: parseFloat(quantity),
        unit,
        stock: parseInt(stock, 10),
        images: imagesArray.length > 0 ? imagesArray : undefined
      };

      const res = await createProductAdmin(payload);
      if (res.success) {
        setMessage('Product added to MRPurna catalog successfully!');
        setIsAddModalOpen(false);
        // Reset form
        setName('');
        setPrice('');
        setDescription('');
        setImg1(''); setImg2(''); setImg3(''); setImg4(''); setImg5('');
        loadAdminData();
      }
    } catch (err) {
      setMessage('Error creating product: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this grocery item?')) {
      try {
        await deleteProductAdmin(id);
        loadAdminData();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatusAdmin(orderId, newStatus);
      if (res.success) {
        setMessage(`Order status updated to ${newStatus}`);
        loadAdminData();
      }
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-[#064e3b] text-white rounded-xl p-6 shadow-md flex items-center justify-between flex-wrap gap-4 border border-emerald-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black flex items-center gap-2">
              MRPurna Admin Control Panel
            </h1>
            <p className="text-xs text-emerald-200">
              Authenticated Admin: <span className="font-bold text-white">{profile.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black px-4 py-2.5 rounded-full shadow flex items-center gap-1.5 transition"
        >
          <Plus size={16} /> Add Product (With 5 Images)
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-lg border border-emerald-200">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row gap-5 sm:items-center">
        <div className="flex-1">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2"><MessageCircle size={18} className="text-emerald-600" /> WhatsApp Notifications</h2>
          <p className="mt-1 text-xs text-slate-500">
            {whatsAppStatus.ready ? 'Connected and ready to send order notifications.' : 'Scan the QR code in WhatsApp → Linked devices to connect this store number.'}
          </p>
          <button onClick={loadWhatsAppStatus} disabled={whatsAppLoading} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 disabled:text-slate-400">
            <RefreshCw size={14} className={whatsAppLoading ? 'animate-spin' : ''} /> Refresh QR
          </button>
        </div>
        {whatsAppStatus.ready ? (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-bold text-emerald-800">WhatsApp connected</div>
        ) : whatsAppStatus.qr ? (
          <img src={whatsAppStatus.qr} alt="WhatsApp pairing QR code" className="w-48 h-48 rounded-lg border border-slate-200 p-2 bg-white" />
        ) : (
          <div className="w-48 h-48 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-center p-4 text-xs text-slate-400">Generating a secure QR code…</div>
        )}
      </div>

      {/* Main Admin Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'products' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <Package size={16} /> Products Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'orders' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <ShoppingBag size={16} /> Customer Orders ({orders.length})
          </button>
        </div>

        {/* Products CRUD Table */}
        {activeTab === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Quantity Unit</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {products.map((p) => {
                  const mainImg = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image_url;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 flex items-center gap-3">
                        <img src={mainImg} alt={p.name} className="w-10 h-10 object-contain rounded bg-slate-50 p-1 border shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <span className="text-[10px] text-slate-400">({Array.isArray(p.images) ? p.images.length : 1} photos)</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                          p.category === 'Vegetables' ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 font-extrabold text-slate-900">
                        ₹{Number(p.price).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 font-bold text-slate-600">
                        {p.quantity} {p.unit}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock < 10 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Table */}
        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Update Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold">{o.id.slice(-8).toUpperCase()}</td>
                    <td className="p-3">
                      <p className="font-bold">{o.customer_name}</p>
                      <p className="text-[10px] text-slate-400">{o.customer_email}</p>
                    </td>
                    <td className="p-3 font-extrabold">₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.order_status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                        o.order_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {o.order_status || 'Order Placed'}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.order_status || 'Order Placed'}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className="px-2 py-1 text-[10px] font-bold border border-slate-300 rounded outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-slate-400">{new Date(o.created_at || Date.now()).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add Product Modal (With 5 Image URL inputs) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#064e3b] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus size={18} /> Add New MRPurna Grocery Product
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-emerald-200 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-3 text-xs max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fresh Dragon Fruit" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input type="number" required value={price} onChange={e => setPrice(e.target.value)} placeholder="120" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input type="number" required value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="1" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit</label>
                  <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="pc">pc</option>
                    <option value="pack">pack</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock</label>
                  <input type="number" required value={stock} onChange={e => setStock(e.target.value)} placeholder="50" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              {/* 5 Image URLs Section */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block font-extrabold text-emerald-800 mb-1">Upload 5 Image URLs (Carousel Images)</label>
                <div className="space-y-2">
                  <input type="url" placeholder="Image 1 URL (Primary)" value={img1} onChange={e => setImg1(e.target.value)} className="w-full px-2.5 py-1.5 border rounded" />
                  <input type="url" placeholder="Image 2 URL" value={img2} onChange={e => setImg2(e.target.value)} className="w-full px-2.5 py-1.5 border rounded" />
                  <input type="url" placeholder="Image 3 URL" value={img3} onChange={e => setImg3(e.target.value)} className="w-full px-2.5 py-1.5 border rounded" />
                  <input type="url" placeholder="Image 4 URL" value={img4} onChange={e => setImg4(e.target.value)} className="w-full px-2.5 py-1.5 border rounded" />
                  <input type="url" placeholder="Image 5 URL" value={img5} onChange={e => setImg5(e.target.value)} className="w-full px-2.5 py-1.5 border rounded" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Farm fresh produce details..." className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-lg shadow uppercase tracking-wider flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
              >
                {formSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Add Product to Catalog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
