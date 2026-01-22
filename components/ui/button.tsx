import * as React from "react";

export type ButtonVariant = "default" | "outline";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", ...props },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50";

    const variants: Record<ButtonVariant, string> = {
      default: "bg-black text-white hover:bg-gray-800",
      outline:
        "border border-gray-300 text-gray-900 hover:bg-gray-100",
    };

    return (
      <button
        ref={ref}
        {...props}
        className={`${base} ${variants[variant]} ${className}`}
      />
    );
  }
);

Button.displayName = "Button";
