"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Activity,
  Cpu,
  LayoutDashboard,
  Shield,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `flex items-center gap-3 p-2 rounded-lg transition ${
      pathname === path
        ? "bg-cyan-600 text-white"
        : "hover:bg-slate-800 hover:text-cyan-400"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        GuardianSense
      </h1>

      <nav className="space-y-3">

        <Link href="/" className={linkStyle("/")}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link href="/devices" className={linkStyle("/devices")}>
          <Cpu size={20} />
          Devices
        </Link>

        <Link href="/monitoring" className={linkStyle("/monitoring")}>
          <Activity size={20} />
          Monitoring
        </Link>

        <Link href="/guardian-ai" className={linkStyle("/guardian-ai")}>
          <Shield size={20} />
          Guardian AI
        </Link>

      </nav>
    </aside>
  );
}