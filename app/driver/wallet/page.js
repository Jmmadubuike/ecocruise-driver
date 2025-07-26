"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import {
  FiUsers,
  FiDollarSign,
  FiMap,
  FiTruck,
  FiAlertCircle,
  FiClock,
  FiCreditCard,
} from "react-icons/fi";

const Card = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-white dark:bg-black p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 flex items-center gap-4">
    <div
      className="p-3 rounded-full text-white"
      style={{ backgroundColor: color }}
    >
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-gray-600 dark:text-gray-300 text-sm font-medium">
        {label}
      </h4>
      <p className="text-xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const DriverAnalytics = () => {
  const [stats, setStats] = useState<any>({});
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/driver/analytics", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const { data } = await res.json();

        setStats({
          totalEarnings: data.totalEarnings.toLocaleString("en-NG"),
          availableBalance: data.availableBalance.toLocaleString("en-NG"),
          dailyEarnings: data.dailyEarnings.toLocaleString("en-NG"),
          monthlyEarnings: data.monthlyEarnings.toLocaleString("en-NG"),
          completedRides: data.completedRides,
          totalRides: data.totalRides,
          pendingWithdrawals: data.pendingWithdrawals,
        });
      } catch (err: any) {
        console.error(err);
      }
    };

    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const cards = [
    {
      label: "Total Earnings",
      value: `₦${stats.totalEarnings}`,
      color: "#16a34a",
      icon: FiDollarSign,
    },
    {
      label: "Available Balance",
      value: `₦${stats.availableBalance}`,
      color: "#8b5cf6",
      icon: FiCreditCard,
    },
    {
      label: "Today's Earnings",
      value: `₦${stats.dailyEarnings}`,
      color: "#059669",
      icon: FiClock,
    },
    {
      label: "This Month",
      value: `₦${stats.monthlyEarnings}`,
      color: "#3b82f6",
      icon: FiMap,
    },
    {
      label: "Total Rides",
      value: stats.totalRides,
      color: "#ef4444",
      icon: FiTruck,
    },
    {
      label: "Completed Rides",
      value: stats.completedRides,
      color: "#f59e0b",
      icon: FiUsers,
    },
    {
      label: "Pending Withdrawals",
      value: stats.pendingWithdrawals,
      color: "#eab308",
      icon: FiAlertCircle,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        Driver Analytics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Card key={i} {...card} />
        ))}
      </div>
    </div>
  );
};

export default DriverAnalytics;
