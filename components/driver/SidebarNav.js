"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ClockIcon,
  WalletIcon,
  TicketIcon,
  BellIcon,
  UserCircleIcon,
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

  return (
    <nav
      className={`
        fixed sm:sticky
        bottom-0 sm:top-0
        left-0 right-0 sm:left-auto sm:right-auto
        w-full sm:w-64
        z-30
        bg-base-100 border-t sm:border-t-0 sm:border-r border-base-300 shadow-lg
        flex sm:flex-col flex-row
        justify-between sm:justify-start
        items-center sm:items-start
        px-2 sm:px-4 py-2 sm:py-4
        space-y-0 sm:space-y-1
      `}
      aria-label="Driver navigation"
    >
      {navLinks.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`
              group flex sm:flex-row flex-col
              items-center justify-center sm:justify-start
              sm:items-center gap-1 sm:gap-3
              w-full sm:w-full
              px-2 sm:px-4 py-2 sm:py-3
              rounded-lg text-xs sm:text-sm font-medium
              transition-all duration-200
            `}
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
              className="w-5 h-5"
              style={{ color: isActive ? ACTIVE_TEXT : ACTIVE_BG }}
              aria-hidden="true"
            />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
