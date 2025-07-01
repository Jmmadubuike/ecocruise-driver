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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/v1/driver/analytics');
        const data = res.data.data;

        // Format server-stable values (locale-safe)
        setStats({
          totalEarnings: data.totalEarnings.toLocaleString('en-NG'),
          dailyEarnings: data.dailyEarnings.toLocaleString('en-NG'),
          monthlyEarnings: data.monthlyEarnings.toLocaleString('en-NG'),
          completedRides: data.completedRides,
          totalRides: data.totalRides,
          pendingWithdrawals: data.pendingWithdrawals,
        });
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load wallet data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center p-4">Loading wallet info...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#004aad] mb-8">Driver Wallet & Earnings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Earnings',
            value: `₦${stats.totalEarnings}`,
            color: '#004aad',
            icon: CreditCardIcon,
          },
          {
            label: "Today's Earnings",
            value: `₦${stats.dailyEarnings}`,
            color: '#22c55e',
            icon: BanknotesIcon,
          },
          {
            label: 'Monthly Earnings',
            value: `₦${stats.monthlyEarnings}`,
            color: '#facc15',
            icon: CalendarIcon,
          },
          {
            label: 'Completed Rides',
            value: stats.completedRides,
            color: '#0ea5e9',
            icon: CheckCircleIcon,
          },
          {
            label: 'Total Rides',
            value: stats.totalRides,
            color: '#6b7280',
            icon: ClipboardDocumentCheckIcon,
          },
          {
            label: 'Pending Withdrawals',
            value: stats.pendingWithdrawals,
            color: '#f80b0b',
            icon: ArrowPathRoundedSquareIcon,
          },
        ].map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="card bg-white shadow-lg p-5 rounded-xl border-l-4 hover:shadow-xl transition-all duration-200"
            style={{ borderColor: color }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">{label}</p>
                <p className="text-2xl font-bold" style={{ color }}>
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
