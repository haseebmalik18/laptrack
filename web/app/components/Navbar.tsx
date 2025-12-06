"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/lap-analysis", label: "Lap Analysis" },
    { href: "/traces", label: "Data Traces" },
    { href: "/compare", label: "Compare" },
  ];

  return (
    <nav className="border-b border-zinc-800 bg-black">
      <div className="mx-auto max-w-[1800px] px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="4" fill="url(#gradient)" />
                <path d="M12 20 L20 12 L28 20 L20 28 Z" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="20" r="2" fill="white"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LapTrack</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Advanced Telemetry Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-white border-b-2 border-blue-500"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="text-xs text-zinc-500">
            F1 2024 Telemetry
          </div>
        </div>
      </div>
    </nav>
  );
}
