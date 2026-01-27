"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/useCartStore";
import { useGiftStore } from "@/store/useGiftStore";
import { FormInput } from "@/components/ui/FormInput";
import { isValidEmail } from "@/lib/validators";
import Link from "next/link";

export default function CheckoutPage() {  
  const items = useCartStore((state) => state.items);

  /* ===================== QUICK ORDER ===================== */
  const [isQuickOrder, setIsQuickOrder] = useState(true);

  /* ===================== CUSTOMER ===================== */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  /* ===================== PAYMENT ===================== */
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "cash"
  >("cash");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });

  /* ===================== ORDER STATE ===================== */
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  /* ===================== GIFTS ===================== */
  const { gifts, selectedGift, setGifts, selectGift } = useGiftStore();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const hasFreeGift = subtotal >= 20;

  /* ===================== FETCH GIFTS ===================== */
  useEffect(() => {
    if (!hasFreeGift) {
      setGifts([]);
      selectGift(null);
      return;
    }

    fetch("/api/gifts")
      .then((res) => res.json())
      .then((data) => setGifts(data.gifts || []))
      .catch(() => setGifts([]));
  }, [hasFreeGift]);

  async function submitOrder() {
    if (!isValid) return;

    setLoading(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 1, // или вземи от сесията на next-auth
        items: items.map((i) => ({
          variantId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
        shippingAddress: `${street}, ${city}, ${zip}, ${country}`,
        paymentMethod,
        notes: "",
        giftId: selectedGift?.id || null,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setOrderNumber(`ORD-${Date.now()}`); // можеш да вземеш от data.order.id
      setOrderPlaced(true);
    } else {
      console.error(data.error);
      setLoading(false);
    }

    setLoading(false);
  }

  async function submitQuickOrder() {
    if (!firstName || !phone || !email) return;

    const res = await fetch("/api/quick-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        phone,
        email,
        items: items.map((i) => ({
          variantId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setOrderNumber(data.orderId);
      setOrderPlaced(true);
    } else {
      alert(data.error || "Грешка при поръчката");
    }
  }

  function isValidPhone(phone: string) {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 9;
  }

  const isValid = isQuickOrder
    ? firstName && lastName && isValidEmail(email) && isValidPhone(phone)
    : firstName &&
      lastName &&
      isValidEmail(email) &&
      isValidPhone(phone) &&
      street &&
      city &&
      zip &&
      country;

  /* ===================== ORDER CONFIRMATION ===================== */
  if (orderPlaced && orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="p-10 max-w-xl w-full text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h1 className="text-3xl font-bold">Благодарим ти, {firstName}!</h1>
          <p className="text-gray-600">Поръчката е приета успешно.</p>

          <div className="bg-gray-50 border rounded-lg p-4 text-sm space-y-2">
            <p className="flex justify-between">
              <span>Номер</span>
              <span className="font-mono">{orderNumber}</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>Общо</span>
              <span>€{subtotal.toFixed(2)}</span>
            </p>
          </div>

          <Button className="w-full h-12 bg-sky-700 hover:bg-sky-600">
            <Link href={"/"}>
              Продължи с пазаруването
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  /* ===================== CHECKOUT ===================== */
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {/* QUICK ORDER TOGGLE */}
          <Card className="p-5 bg-sky-50 border-sky-200">
            <label className="flex items-center gap-3 cursor-pointer">
              {/* <input
                type="checkbox"
                checked={isQuickOrder}
                onChange={() => setIsQuickOrder((v) => !v)}
              /> */}
              <div>
                <p className="font-semibold">Бърза поръчка 🚀</p>
                <p className="text-sm text-gray-600">
                  Само име и телефон · плащане при доставка
                </p>
              </div>
            </label>
          </Card>

          {/* CUSTOMER */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Контакт</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Име"
                value={firstName}
                onChange={setFirstName}
                placeholder="John"
              />

              <FormInput
                label="Фамилия"
                value={lastName}
                onChange={setLastName}
                placeholder="Doe"
              />

              <FormInput
                label="Телефон"
                value={phone}
                onChange={(e) => {
                  const value = e.replace(/[^0-9+\s]/g, "");
                  setPhone(value);
                }}
                type="tel"
                placeholder="+359 88 123 4567"
                validate={isValidPhone}
                errorMessage="Моля, въведи валиден телефонен номер"
              />

              <FormInput
                label="Email"
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="john@example.com"
                validate={isValidEmail}
                errorMessage="Невалиден email адрес"
              />
            </div>
          </Card>

          {/* 🎁 FREE GIFT */}
          {hasFreeGift && gifts.length > 0 && (
            <Card className="p-6 space-y-4 bg-yellow-50 border-yellow-200">
              <h2 className="text-xl font-semibold">
                Choose your free gift 🎁
              </h2>

              {gifts.map((gift) => (
                <label
                  key={gift.id}
                  className={`flex gap-3 p-3 rounded-lg border cursor-pointer
                      ${
                        selectedGift?.id === gift.id
                          ? "border-yellow-500 bg-yellow-100"
                          : "border-gray-200 hover:bg-yellow-100/50"
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
                    <p className="text-sm font-semibold text-green-600">Free</p>
                  </div>
                </label>
              ))}
            </Card>
          )}

          {/* ADDRESS */}
          {!isQuickOrder && (
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Доставка</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Улица"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
                <Input
                  placeholder="Град"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  placeholder="ZIP"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
                <Input
                  placeholder="Държава"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT */}
        <Card className="p-6 space-y-4 h-fit sticky top-6">
          <h2 className="text-xl font-semibold">Обобщение</h2>

          {items.map((i) => (
            <div key={i.id} className="flex justify-between">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>€{(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}

          {selectedGift && (
            <>
              <hr className="border-dashed" />
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1">
                  🎁 {selectedGift.name}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    FREE
                  </span>
                </span>

                <span className="line-through text-gray-400">
                  €{selectedGift.price.toFixed(2)}
                </span>
              </div>
            </>
          )}

          <hr />
          <div className="flex justify-between font-bold">
            <span>Общо</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>

          <Button
            className="h-12 bg-sky-700 hover:bg-sky-600"
            disabled={!isValid || loading}
            onClick={submitQuickOrder}
          >
            {loading ? "Изпращане…" : "Поръчай"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
