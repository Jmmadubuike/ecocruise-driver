"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "driver") {
        router.push("/driver/dashboard");
      } else {
        // Block admins or other roles from using the driver app
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner text-primary text-3xl"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-base-200 via-white to-base-100 px-6 py-12">
      <div className="max-w-3xl text-center space-y-6">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="EcoCruise Logo"
          width={72}
          height={72}
          className="mx-auto mb-2"
        />

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          EcoCruise Driver Hub
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-lg md:text-xl">
          Seamless ride coordination, earnings management, and route access for
          campus transport drivers—all in one smart interface.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left text-sm text-gray-700">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-primary">
            <h3 className="font-semibold text-primary mb-1">Live Ride Dashboard</h3>
            <p>View assigned rides, manage lifecycle, and monitor progress effortlessly.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-secondary">
            <h3 className="font-semibold text-secondary mb-1">Route Discovery</h3>
            <p>Browse and select available campus transport routes in real-time.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-accent">
            <h3 className="font-semibold text-accent mb-1">Earnings & Withdrawals</h3>
            <p>Track earnings and request payouts with full transparency.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-info">
            <h3 className="font-semibold text-info mb-1">Support System</h3>
            <p>Submit tickets and resolve ride-related issues quickly and efficiently.</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/login")}
          className="btn btn-primary mt-8 px-6 py-3 text-lg font-semibold shadow-md hover:shadow-lg"
        >
          Enter Driver Portal
        </button>
        <button
            onClick={() => router.push("/register")}
            className="border border-[#004aad] text-[#004aad] px-6 py-3 text-lg font-semibold rounded hover:bg-[#004aad] hover:text-white transition"
          >
            Register
          </button>
      </div>
    </div>
  );
}
