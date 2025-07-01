"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  ClockIcon,
  MapIcon,
  UserCircleIcon,
  WalletIcon,
  TicketIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navLinks = [
  { label: "Dashboard", href: "/driver/dashboard", icon: HomeIcon },
  { label: "My Rides", href: "/driver/rides/history", icon: ClockIcon },
  { label: "Withdrawals", href: "/driver/withdrawals", icon: WalletIcon },
  { label: "Wallet", href: "/driver/wallet", icon: WalletIcon },
  { label: "Support", href: "/driver/support", icon: TicketIcon },
  { label: "Notifications", href: "/driver/notifications", icon: BellIcon },
  { label: "Profile", href: "/driver/profile", icon: UserCircleIcon },
  { label: "History", href: "/driver/history", icon: ClockIcon },
];

const ACTIVE_BG = "#004aad";
const ACTIVE_TEXT = "#ffffff";
const HOVER_BG = "rgba(0, 74, 173, 0.1)";
const INACTIVE_TEXT = "#333333";

export default function SidebarNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sm:hidden p-4 flex justify-between items-center bg-base-100 border-b border-base-300 shadow-md">
        <button
          onClick={toggleSidebar}
          className="text-[#004aad] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
        <span className="font-bold text-[#004aad] text-lg">Menu</span>
      </div>

      {/* Sidebar */}
      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } sm:flex flex-col bg-base-100 border-r border-base-300 shadow-lg h-screen sticky top-0 p-4 space-y-1 w-full sm:w-64 z-30`}
        aria-label="Driver navigation"
      >
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={closeSidebar} // ✅ Close sidebar on click (mobile)
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              aria-current={isActive ? "page" : undefined}
              style={{
                backgroundColor: isActive ? ACTIVE_BG : undefined,
                color: isActive ? ACTIVE_TEXT : INACTIVE_TEXT,
                boxShadow: isActive ? "0 0 10px rgba(0,74,173,0.6)" : undefined,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = HOVER_BG;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "";
              }}
            >
              <Icon
                className="w-5 h-5 transition-transform duration-200"
                style={{ color: isActive ? ACTIVE_TEXT : ACTIVE_BG }}
                aria-hidden="true"
              />
              <span className="truncate">{label}</span> {/* ✅ Always show text */}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
