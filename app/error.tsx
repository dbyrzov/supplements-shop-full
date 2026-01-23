"use client"; // важно за интерактивни бутони

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Логваме грешката в конзолата
    console.error("Грешка в приложението:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Опа! Грешка</h1>
        <p className="text-gray-700 mb-6">
          Нещо се обърка в приложението. Моля, опитайте отново.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          {error.message}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Опитай отново
        </button>
      </div>
    </div>
  );
}
