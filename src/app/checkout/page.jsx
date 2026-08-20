'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, ArrowLeft, Loader2, CheckCircle, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createRazorpayOrder } from '../../utils/api';
import RazorpayModal from '../../components/RazorpayModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, total, subtotal, deliveryFee, clearCart } = useCart();
  const { profile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zip, setZip] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [razorpayOrderData, setRazorpayOrderData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const clearLocationCoordinates = () => {
    setLatitude(null);
    setLongitude(null);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Location detection is not supported by this browser.');
      return;
    }

    setError('');
    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: detectedLatitude, longitude: detectedLongitude } = coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(detectedLatitude)}&lon=${encodeURIComponent(detectedLongitude)}&addressdetails=1`,
            { headers: { Accept: 'application/json' } }
          );
          if (!response.ok) throw new Error('Unable to convert your location into an address.');

          const location = await response.json();
          const address = location.address || {};
          const locality = address.suburb || address.neighbourhood || address.village || address.hamlet;
          const cityName = address.city || address.town || address.municipality || address.county || '';
          const streetAddress = [address.house_number, address.road, locality, cityName, address.state, address.postcode]
            .filter(Boolean)
            .join(', ') || location.display_name;

          if (!streetAddress) throw new Error('No readable address was found for your current location.');

          setStreet(streetAddress);
          if (cityName) setCity(cityName);
          if (address.state) setStateName(address.state);
          if (address.postcode) setZip(address.postcode);
          setLatitude(detectedLatitude);
          setLongitude(detectedLongitude);
        } catch (locationError) {
          setError(locationError.message || 'Unable to fetch a readable address for your location.');
          clearLocationCoordinates();
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (locationError) => {
        const message = locationError.code === locationError.PERMISSION_DENIED
          ? 'Location permission was denied. Please allow it or enter your address manually.'
          : 'Unable to detect your current location. Please try again or enter your address manually.';
        setError(message);
        setIsFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 space-y-3">
        <h2 className="text-base font-bold text-slate-800">Your Cart is Empty</h2>
        <button
          onClick={() => router.push('/')}
          className="bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow hover:bg-emerald-700 transition"
        >
          Return to Grocery Storefront
        </button>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        products: cartItems,
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        latitude,
        longitude,
        address: { street, city, state: stateName, zip, country: 'India', latitude, longitude },
        user_id: profile?.id
      };

      const data = await createRazorpayOrder(orderPayload);
      if (data.success) {
        setRazorpayOrderData(data);
        setIsModalOpen(true);
      } else {
        throw new Error(data.message || 'Order creation failed');
      }
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (confirmedOrder) => {
    setIsModalOpen(false);
    clearCart();
    router.push(`/order-success/${confirmedOrder.id || razorpayOrderData.order_id}`);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Cart
        </button>
        <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck size={16} /> Secured Razorpay Checkout
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
            <Truck className="text-emerald-600" /> Delivery Address
          </h2>

          {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded font-bold">{error}</div>}

          <form onSubmit={handleCheckoutSubmit} autoComplete="off" className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your name" autoComplete="off" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter your mobile number" autoComplete="off" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" autoComplete="off" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-3">
                <label className="block font-bold text-slate-700">Delivery Address</label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isFetchingLocation}
                  className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:text-emerald-800 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  {isFetchingLocation ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} />}
                  {isFetchingLocation ? 'Fetching your location...' : '📍 Use Current Location'}
                </button>
              </div>
              <input type="text" required value={street} onChange={e => { setStreet(e.target.value); clearLocationCoordinates(); }} placeholder="Enter your street address" autoComplete="off" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
              {latitude !== null && longitude !== null && <p className="mt-1 text-[11px] font-medium text-emerald-700">Current location attached for delivery.</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input type="text" required value={city} onChange={e => { setCity(e.target.value); clearLocationCoordinates(); }} placeholder="City" autoComplete="off" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">State</label>
                <input type="text" required value={stateName} onChange={e => { setStateName(e.target.value); clearLocationCoordinates(); }} placeholder="State" autoComplete="off" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                <input type="text" required value={zip} onChange={e => { setZip(e.target.value); clearLocationCoordinates(); }} placeholder="Pincode" autoComplete="off" className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow transition uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              Proceed to Pay ₹{total.toLocaleString('en-IN')}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase border-b pb-3">ORDER SUMMARY</h3>
          <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <span className="truncate font-bold text-slate-800">{item.name} × {item.quantity}</span>
                <span className="font-black text-slate-900 shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between font-black text-slate-900 text-base">
            <span>Total Amount</span>
            <span className="text-emerald-700">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      <RazorpayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderDetails={razorpayOrderData}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
