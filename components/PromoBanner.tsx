import { useEffect, useState } from "react";

export default function PromoBanner() {
  const [promo, setPromo] = useState<{
    message1?: string;
    message2?: string;
  }>({});

  useEffect(() => {
    fetch("/api/promo")
      .then((res) => res.json())
      .then((data) => setPromo(data ?? {}));
  }, []);

  return (
    <div
      className="
        w-full
        relative
        overflow-hidden
        rounded-xl
        bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-200
        text-center
        py-5
        shadow-lg
        mt-5
        mb-5
        transition
        duration-300
        hover:scale-[1.01]
        min-h-[100]
      "
    >
      {/* декоративен блясък */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-white/20
          blur-2xl
          opacity-40
        "
      />

      <div className="relative z-10">
        <div className="text-xl md:text-2xl font-extrabold tracking-wide">
          {promo.message1}
        </div>

        {promo.message2 && (
          <div className="mt-1 text-sm md:text-base font-medium text-yellow-900/80">
            {promo.message2}
          </div>
        )}
      </div>
    </div>
  );
}
