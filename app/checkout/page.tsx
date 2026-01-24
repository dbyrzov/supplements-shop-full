'use client';

import { useEffect, useState } from 'react';
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/useCartStore";
import { useGiftStore } from '@/store/useGiftStore';

/* ===================== TYPES ===================== */
interface Gift {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

export default function CheckoutPage() {
  const items = useCartStore(state => state.items);
  const increase = useCartStore(state => state.increase);
  const decrease = useCartStore(state => state.decrease);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  /* ===================== GIFTS ===================== */
  const { gifts, selectedGift, setGifts, selectGift, resetGift } = useGiftStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const hasFreeGift = subtotal >= 20;

  /* ===================== FETCH GIFTS ===================== */
  useEffect(() => {
    if (!hasFreeGift) {
      setGifts([]);
      selectGift(null);
      return;
    }

    fetch('/api/admin/gifts')
      .then(res => res.json())
      .then(data => setGifts(data.gifts || []))
      .catch(() => setGifts([]));
  }, [hasFreeGift]);

  function generateOrderNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${year}-${random}`;
  }

  async function submitOrder() {
    setLoading(true);
    await new Promise(res => setTimeout(res, 1200));
    setOrderNumber(generateOrderNumber());
    setLoading(false);
    setOrderPlaced(true);
  }

  // ======================== ORDER CONFIRMATION ========================
  if (orderPlaced && orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-2xl w-full space-y-6">
          <Card className="p-10 text-center space-y-6">
            <div className="text-6xl animate-bounce">🎉</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Thank you, {firstName}!</h1>
            <p className="text-gray-600">Your order has been placed successfully.</p>

            <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 text-sm md:text-base space-y-3 shadow-sm">
              <p className="flex justify-between">
                <span>Order Number</span>
                <span className="font-mono font-semibold text-gray-900">{orderNumber}</span>
              </p>
              <p className="flex justify-between">
                <span>Total Paid</span>
                <span className="font-semibold">€{subtotal.toFixed(2)}</span>
              </p>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <p className="text-sm text-gray-500">📧 Email preview</p>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm space-y-4">
              <p><strong>Subject:</strong> Your order {orderNumber} is confirmed</p>
              <p>Hi {firstName},</p>
              <p>Thank you for ordering from our store! Here’s your order summary:</p>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-gray-800">
                    <span>{item.name} × {item.quantity}</span>
                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="border-gray-200" />
              <p className="flex justify-between font-semibold">
                <span>Total</span>
                <span>€{subtotal.toFixed(2)}</span>
              </p>
              <p className="text-gray-500">
                Shipping to:<br />
                {firstName} {lastName}<br />
                {street}, {city}, {zip}, {country}<br />
                {phone}<br />
                {email}
              </p>
              <p>We’ll notify you once your order is on the way 🚚</p>
              <p className="font-semibold">Best regards,<br />Your Supplements Team</p>
            </div>
          </Card>

          <Button className="w-full h-12 rounded-xl bg-sky-700 text-white text-lg hover:bg-sky-600 transition shadow">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // ======================== CHECKOUT PAGE ========================
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center md:text-left">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT SIDE FOR FORMS */}
          <div className="lg:col-span-2 space-y-8">

            {/* Cart */}
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
              {items.map(item => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 border-b border-gray-100"
                >
                  {/* Name + Price */}
                  <div className="overflow-hidden">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">€{item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrease(item.id)}
                      className="h-8 w-8 rounded-full border text-sky-700 hover:bg-sky-50 transition"
                    >−</button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => increase(item.id)}
                      className="h-8 w-8 rounded-full border text-sky-700 hover:bg-sky-50 transition"
                    >+</button>
                  </div>

                  {/* Total */}
                  <p className="font-semibold text-right text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
            </Card>

            {/* 🎁 FREE GIFT */}
            {hasFreeGift && gifts.length > 0 && (
              <Card className="p-6 space-y-4 bg-yellow-50 border-yellow-200">
                <h2 className="text-xl font-semibold">
                  Choose your free gift 🎁
                </h2>

                {gifts.map(gift => (
                  <label
                    key={gift.id}
                    className={`flex gap-3 p-3 rounded-lg border cursor-pointer
                      ${selectedGift?.id === gift.id
                        ? 'border-yellow-500 bg-yellow-100'
                        : 'border-gray-200 hover:bg-yellow-100/50'
                      }`}
                  >
                    <input
                      type="radio"
                      name="gift"
                      checked={selectedGift?.id === gift.id}
                      onChange={() => selectGift(gift)}
                    />
                    <div>
                      <p className="font-medium">{gift.name}</p>
                      <p className="text-sm line-through text-gray-500">
                        €{gift.price.toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        Free
                      </p>
                    </div>
                  </label>
                ))}
              </Card>
            )}

            {/* Customer Info */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', value: firstName, setter: setFirstName, placeholder: 'John' },
                  { label: 'Last Name', value: lastName, setter: setLastName, placeholder: 'Doe' },
                  { label: 'Email', value: email, setter: setEmail, placeholder: 'john@example.com', type: 'email' },
                  { label: 'Phone', value: phone, setter: setPhone, placeholder: '+359 88 123 4567', type: 'tel' }
                ].map((field, idx) => (
                  <div key={idx} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type={field.type || 'text'}
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      className="bg-gray-50 border-gray-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 transition"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Info */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Street', value: street, setter: setStreet, placeholder: '123 Main St' },
                  { label: 'City', value: city, setter: setCity, placeholder: 'Sofia' },
                  { label: 'ZIP', value: zip, setter: setZip, placeholder: '1000' },
                  { label: 'Country', value: country, setter: setCountry, placeholder: 'Bulgaria' }
                ].map((field, idx) => (
                  <div key={idx} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      className="bg-gray-50 border-gray-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 transition"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
              <div className="flex gap-3">
                {(['card','paypal','cash'] as const).map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                      paymentMethod===method
                        ? 'border-sky-700 bg-sky-50 text-sky-700 shadow'
                        : 'hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {method.toUpperCase()}
                  </button>
                ))}
              </div>

              {paymentMethod==='card' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3 space-y-2">
                    <Label>Card Number</Label>
                    <Input placeholder="1234 5678 9012 3456" value={card.number} onChange={e=>setCard({...card,number:e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry</Label>
                    <Input placeholder="MM/YY" value={card.expiry} onChange={e=>setCard({...card,expiry:e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <Label>CVC</Label>
                    <Input placeholder="123" value={card.cvc} onChange={e=>setCard({...card,cvc:e.target.value})}/>
                  </div>
                </div>
              )}
            </Card>

          </div>

          {/* RIGHT SIDE ORDER SUMMARY */}
          <Card className="p-6 space-y-6 h-fit sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
            <div className="space-y-2">
              {items.map(item=>(
                <div key={item.id} className="flex justify-between text-gray-900">
                  <span>{item.name} × {item.quantity}</span>
                  <span>€{(item.price*item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>

            <Button
              className="w-full h-12 rounded-xl bg-sky-700 text-white text-lg hover:bg-sky-600 transition shadow"
              disabled={loading || !firstName || !lastName || !email || !phone || !street || !city || !zip || !country}
              onClick={submitOrder}
            >
              {loading ? 'Placing order…' : 'Place Order'}
            </Button>
            <p className="text-xs text-gray-400 text-center mt-1">Secure payment · SSL encrypted</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
