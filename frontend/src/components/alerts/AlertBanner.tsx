"use client";

interface AlertProps {
  active: boolean;
  title: string;
  message: string;
}

export default function AlertBanner({
  active,
  title,
  message,
}: AlertProps) {
  if (!active) return null;

  return (
    <div className="bg-red-600 text-white p-5 rounded-xl mb-8 animate-pulse shadow-xl">
      <h2 className="text-2xl font-bold">
        🚨 {title}
      </h2>

      <p className="mt-2">
        {message}
      </p>
    </div>
  );
}