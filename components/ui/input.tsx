import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black ${className}`}
  />
));

Input.displayName = "Input";
