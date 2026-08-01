"use client";

export default function Navbar() {
  return (
    <header className="w-full h-20 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-8">

      <div>
        <h2 className="text-2xl font-bold text-white">
          GuardianSense Dashboard
        </h2>

        <p className="text-slate-400 text-sm">
          Real-Time Contactless Health Monitoring
        </p>
      </div>

      <div className="text-green-400 font-semibold">
        ● Backend Online
      </div>

    </header>
  );
}