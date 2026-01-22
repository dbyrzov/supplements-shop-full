export default function PromoBanner({ message }: { message: string }) {
  return (
    <div className="
      w-full
      bg-gradient-to-r from-yellow-300 to-yellow-200
      text-center
      font-semibold
      text-lg
      py-4
      rounded-lg
      shadow
      mt-5
      mb-5
    ">
      {message}
    </div>
  );
}
