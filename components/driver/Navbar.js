'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

const LOGOUT_ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/logout`;

export default function DriverNavbar() {
  const { user, loading, fetchUser } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await fetch(LOGOUT_ENDPOINT, {
        method: 'POST',
        credentials: 'include',
      });
      await fetchUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  }, [fetchUser, router]);

  return (
    <nav className="navbar sticky top-0 z-50 px-4 md:px-8 h-20 border-b border-[#004aad]/10 shadow-lg bg-white dark:bg-[#0a0a0a]">
      <div className="flex-1">
        <Link href="/driver/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="EcoCruise Logo"
            width={36}
            height={36}
            className="rounded"
            priority
          />
          <span className="text-xl font-bold text-[#004aad] hidden sm:inline">
            EcoCruise Driver
          </span>
        </Link>
      </div>

      <div className="flex-none">
        {loading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : user ? (
          <div className="dropdown dropdown-end" tabIndex={0}>
            <button
              className="btn btn-ghost btn-circle avatar ring ring-[#004aad] ring-offset-2"
              aria-haspopup="true"
              aria-expanded="false"
              aria-label="User menu"
              type="button"
            >
              <div className="w-10 rounded-full bg-[#004aad] text-white flex items-center justify-center font-semibold select-none">
                {(user.name && user.name.charAt(0).toUpperCase()) || 'U'}
              </div>
            </button>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-4 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-60 border border-[#004aad]/20"
              role="menu"
              aria-label="User menu options"
            >
              <li className="mb-2" role="none">
                <div className="text-sm font-medium text-gray-700">Signed in as</div>
                <div className="text-sm text-[#004aad] font-bold truncate" title={user.name}>{user.name}</div>
                <div className="text-xs text-gray-500 truncate" title={user.email}>{user.email}</div>
              </li>
              <li role="none">
                <Link href="/driver/dashboard" className="hover:text-[#004aad] block" role="menuitem">
                  Dashboard
                </Link>
              </li>
              <li role="none">
                <button
                  onClick={handleLogout}
                  className="text-[#f80b0b] hover:text-[#004aad] block w-full text-left"
                  role="menuitem"
                  type="button"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-[#004aad] hover:bg-[#f80b0b] btn border-none text-white transition-colors duration-200"
            aria-label="Login"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
