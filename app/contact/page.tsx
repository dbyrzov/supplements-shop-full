"use client";

import { useState } from "react";
import { HiPhone, HiOutlineMail, HiLocationMarker } from "react-icons/hi";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert("Моля, попълнете всички полета.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">Контакти</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Свържете се с нас</h2>
          <p className="text-gray-600">
            Имате въпроси относно продуктите или поръчките? Можете да ни пишете или да ни посетите на нашия адрес.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <HiPhone className="w-6 h-6 text-blue-600" />
              <span>+359 888 123 456</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <HiOutlineMail className="w-6 h-6 text-blue-600" />
              <span>support@supplementstore.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <HiLocationMarker className="w-6 h-6 text-blue-600" />
              <span>София, България</span>
            </div>
          </div>

          {/* Map */}
          <div className="w-full h-64 rounded overflow-hidden shadow">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.123456789!2d23.321!3d42.123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa123456789abc%3A0x123456789abcdef!2sSofia%2C%20Bulgaria!5e0!3m2!1sen!2sbg!4v1699999999999!5m2!1sen!2sbg"
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow space-y-4"
        >
          <h2 className="text-2xl font-semibold text-gray-700">Изпратете ни съобщение</h2>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-600">Име</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-600">Имейл</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-600">Съобщение</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
          >
            {status === "loading" ? "Изпращане..." : "Изпрати"}
          </button>

          {status === "success" && (
            <p className="text-blue-600 font-medium mt-2">Съобщението беше изпратено успешно!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 font-medium mt-2">Възникна грешка. Опитайте отново.</p>
          )}
        </form>
      </div>
    </div>
  );
}
