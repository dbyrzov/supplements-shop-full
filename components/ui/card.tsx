'use client';

import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
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
    >
      {children}
    </div>
  );
}


interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "", ...props }: CardContentProps) {
  return (
    <div className={`p-6 space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
