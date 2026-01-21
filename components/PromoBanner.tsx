import React from "react";

type Props = {
  message: string;
};

export default function PromoBanner({ message }: Props) {
  return (
    <div className="bg-yellow-200 p-4 mb-4 rounded text-center font-bold">{message}</div>
  );
}
