"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXOctagon,
  FiTrendingUp,
  FiActivity,
  FiMapPin,
  FiUser,
  FiWifiOff,
  FiWifi,
  FiSend,
  FiHelpCircle,
  FiPlayCircle,
  FiStopCircle,
} from "react-icons/fi";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ icon, title, value }) => (
  <Card className="shadow-md">
    <CardContent className="flex items-center gap-4 p-6">
      <div className="text-2xl">{icon}</div>
      <div>
        <h2 className="text-sm text-gray-500">{title}</h2>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const AvailableRideCard = ({ ride, acceptingRideId, onAccept }) => (
  <Card className="shadow-sm border border-gray-200">
    <CardContent className="p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FiUser /> {ride.customer?.name || "Unnamed"}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FiMapPin /> {ride.route?.startPoint} → {ride.route?.endPoint}
      </div>
      <div className="text-sm">Passengers: {ride.passengers}</div>
      <div className="text-sm font-semibold text-green-700">
        ₦{ride.amount?.toLocaleString()}
      </div>
      <Button
        size="sm"
        className="w-full mt-2"
        disabled={acceptingRideId === ride._id}
        onClick={() => onAccept(ride._id)}
      >
        {acceptingRideId === ride._id ? "Accepting..." : "Accept Ride"}
      </Button>
    </CardContent>
  </Card>
);

const CurrentRideCard = ({ ride, onStart, onEnd }) => {
  const status = ride.status?.trim().toLowerCase();
  return (
    <Card className="shadow border border-blue-400">
      <CardContent className="p-4 space-y-2">
        <div className="text-sm text-gray-700">
          Customer: {ride.customer?.name || "Unnamed"}
        </div>
        <div className="text-sm">
          Route: {ride.route?.startPoint} → {ride.route?.endPoint}
        </div>
        <div className="text-sm">Passengers: {ride.passengers}</div>
        <div className="text-sm font-semibold text-green-700">
          ₦{ride.amount?.toLocaleString()}
        </div>
        <div className="text-sm text-blue-600 font-medium">
          Status: {ride.status}
        </div>
        <div className="flex gap-2 mt-3">
          {status === "accepted" && (
            <Button
              onClick={() => onStart(ride._id)}
              size="sm"
              className="flex items-center gap-1"
            >
              <FiPlayCircle /> Start Ride
            </Button>
          )}
          {status === "in-progress" && (
            <Button
              onClick={() => onEnd(ride._id)}
              size="sm"
              variant="destructive"
              className="flex items-center gap-1"
            >
              <FiStopCircle /> End Ride
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardSkeleton = () => (
  <div className="p-4 space-y-6">
    <div className="flex justify-end gap-3">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-6">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const DriverDashboard = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [availableRides, setAvailableRides] = useState([]);
  const [currentRides, setCurrentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingRideId, setAcceptingRideId] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [togglingOnline, setTogglingOnline] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: "", message: "" });
  const [supportLoading, setSupportLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [analyticsRes, ridesRes, currentRes] = await Promise.all([
        api.get("/api/v1/driver/analytics"),
        api.get("/api/v1/driver/rides/available"),
        api.get("/api/v1/driver/rides/current"),
      ]);
      setData(analyticsRes.data.data);
      setAvailableRides(ridesRes.data);
      setCurrentRides(currentRes.data?.currentRides || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAcceptRide = async (rideId) => {
    try {
      setAcceptingRideId(rideId);
      await api.patch(`/api/v1/driver/rides/${rideId}/accept`);
      await fetchData();
    } catch (err) {
      console.error("Failed to accept ride:", err);
      alert("Failed to accept ride.");
    } finally {
      setAcceptingRideId(null);
    }
  };

  const handleStartRide = async (rideId) => {
    try {
      await api.patch(`/api/v1/driver/rides/${rideId}/start`);
      await fetchData();
    } catch (err) {
      console.error("Failed to start ride:", err);
      alert("Failed to start ride.");
    }
  };

  const handleEndRide = async (rideId) => {
    try {
      await api.patch(`/api/v1/driver/rides/${rideId}/end`);
      await fetchData();
    } catch (err) {
      console.error("Failed to end ride:", err);
      alert("Failed to end ride.");
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      setTogglingOnline(true);
      const endpoint = isOnline
        ? "/api/v1/driver/offline"
        : "/api/v1/driver/online";
      await api.patch(endpoint);
      setIsOnline((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle online status:", err);
      alert("Failed to toggle online status.");
    } finally {
      setTogglingOnline(false);
    }
  };

  const submitSupportTicket = async () => {
    try {
      setSupportLoading(true);
      await api.post("/api/v1/support/", supportForm);
      alert("Support ticket submitted.");
      setShowSupportModal(false);
      setSupportForm({ subject: "", message: "" });
    } catch (err) {
      console.error("Failed to submit support ticket:", err);
      alert("Failed to submit support ticket.");
    } finally {
      setSupportLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!data) return <p className="p-4">No data available</p>;

  const stats = [
    {
      title: "Total Earnings",
      value: `₦${data.totalEarnings?.toLocaleString() || "0"}`,
      icon: <FiDollarSign className="text-green-600" />,
    },
    {
      title: "Monthly Earnings",
      value: `₦${data.monthlyEarnings?.toLocaleString() || "0"}`,
      icon: <FiTrendingUp className="text-blue-500" />,
    },
    {
      title: "Daily Earnings",
      value: `₦${data.dailyEarnings?.toLocaleString() || "0"}`,
      icon: <FiActivity className="text-yellow-500" />,
    },
    {
      title: "Completed Rides",
      value: data.completedRides || 0,
      icon: <FiCheckCircle className="text-emerald-600" />,
    },
    {
      title: "Total Rides",
      value: data.totalRides || 0,
      icon: <FiClock className="text-gray-500" />,
    },
    {
      title: "Pending Withdrawals",
      value: data.pendingWithdrawals || 0,
      icon: <FiXOctagon className="text-red-500" />,
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-end gap-3">
        <Button onClick={() => router.push("/driver/withdrawals")} variant="outline" className="flex items-center gap-2">
          <FiSend className="text-indigo-600" /> Withdraw
        </Button>
        <Button onClick={() => setShowSupportModal(true)} variant="outline" className="flex items-center gap-2">
          <FiHelpCircle className="text-orange-500" /> Support
        </Button>
        <Button onClick={toggleOnlineStatus} disabled={togglingOnline} variant={isOnline ? "destructive" : "default"} className="text-sm flex items-center gap-2">
          {isOnline ? <FiWifiOff /> : <FiWifi />}
          {togglingOnline ? "Updating..." : isOnline ? "Go Offline" : "Go Online"}
        </Button>
      </div>

      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold">Support Ticket</h2>
            <input
              type="text"
              placeholder="Subject"
              value={supportForm.subject}
              onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
              className="w-full border p-2 rounded-md"
            />
            <textarea
              rows={4}
              placeholder="Describe your issue..."
              value={supportForm.message}
              onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
              className="w-full border p-2 rounded-md"
            />
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowSupportModal(false)} variant="outline">Cancel</Button>
              <Button onClick={submitSupportTicket} disabled={supportLoading}>
                {supportLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} icon={stat.icon} title={stat.title} value={stat.value} />
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Available Rides</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {availableRides.length === 0 ? (
            <p className="text-gray-600 col-span-full">No available rides at the moment.</p>
          ) : (
            availableRides.map((ride) => (
              <AvailableRideCard key={ride._id} ride={ride} acceptingRideId={acceptingRideId} onAccept={handleAcceptRide} />
            ))
          )}
        </div>
      </div>

      {currentRides.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mt-6 mb-2">Current Rides</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {currentRides.map((ride) => (
              <CurrentRideCard key={ride._id} ride={ride} onStart={handleStartRide} onEnd={handleEndRide} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
