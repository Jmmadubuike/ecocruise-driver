'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/api';
import {
  BanknotesIcon,
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathRoundedSquareIcon,
} from '@heroicons/react/24/outline';

export default function DriverWalletPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/v1/driver/analytics');
        setStats(res.data.data); // Set only the data object
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-4">Loading wallet...</div>;
  }

  if (!stats) {
    return <div className="p-4 text-red-600">Error loading wallet data</div>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WalletStat
        label="Available Balance"
        value={`₦${stats.availableBalance?.toFixed(2) || '0.00'}`}
        icon={<BanknotesIcon className="w-6 h-6 text-green-600" />}
      />
      <WalletStat
        label="Total Earnings"
        value={`₦${stats.totalEarnings?.toFixed(2) || '0.00'}`}
        icon={<CreditCardIcon className="w-6 h-6 text-blue-600" />}
      />
      {/* <WalletStat
        label="Daily Earnings"
        value={`₦${stats.dailyEarnings?.toFixed(2) || '0.00'}`}
        icon={<CalendarIcon className="w-6 h-6 text-orange-600" />}
      />
      <WalletStat
        label="Monthly Earnings"
        value={`₦${stats.monthlyEarnings?.toFixed(2) || '0.00'}`}
        icon={<ClipboardDocumentCheckIcon className="w-6 h-6 text-purple-600" />}
      /> */}
      <WalletStat
        label="Completed Rides"
        value={stats.completedRides}
        icon={<CheckCircleIcon className="w-6 h-6 text-teal-600" />}
      />
      <WalletStat
        label="Pending Withdrawals"
        value={stats.pendingWithdrawals}
        icon={<ArrowPathRoundedSquareIcon className="w-6 h-6 text-red-600" />}
      />
    </div>
  );
}

function WalletStat({ label, value, icon }) {
  return (
    <div className="bg-white dark:bg-zinc-800 shadow rounded-2xl p-4 flex items-center space-x-4">
      <div>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
