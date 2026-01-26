"use client";

import { ReactNode, HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        group
        bg-white
        border border-gray-200
        rounded-xl
        overflow-hidden
        transition-all duration-300
        hover:shadow-xl
        hover:border-sky-300
        flex flex-col
        cursor-pointer
        ${className}
      `}
      {...props} // тук приемаме onClick, style, id и други HTML пропове
    >
      {children}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "", ...props }: CardContentProps) {
  return (
    <div className={`p-6 space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
