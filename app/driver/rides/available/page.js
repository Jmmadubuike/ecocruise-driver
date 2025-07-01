"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { RideCard } from "@/components/driver/RideCard";

export default function AvailableRidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = async () => {
    try {
      const res = await axios.get("/api/v1/driver/rides/available");
      setRides(res.data.data); // Adjust depending on your API response
    } catch (error) {
      console.error("Error fetching rides:", error);
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleRejectRide = async (rideId) => {
    try {
      await axios.post(`/api/v1/driver/rides/${rideId}/reject`);
      // Refresh rides list after rejection
      fetchRides();
    } catch (error) {
      console.error("Error rejecting ride:", error);
    }
  };

  if (loading) {
    return <div>Loading rides...</div>;
  }

  if (rides.length === 0) {
    return <div>No rides available</div>;
  }

  return (
    <div>
      {rides.map((ride) => (
        <RideCard key={ride._id} ride={ride} onReject={handleRejectRide} />
      ))}
    </div>
  );
}
