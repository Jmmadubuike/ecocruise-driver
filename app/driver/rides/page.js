'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AvailableRides() {
  const [rides, setRides] = useState([]);
  const router = useRouter();

  const fetchRides = async () => {
    const res = await axios.get('/api/v1/driver/rides/available');
    setRides(res.data);
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleAccept = async (id) => {
    await axios.post(`/api/v1/driver/rides/${id}/accept`);
    fetchRides();
  };

  const handleReject = async (id) => {
    await axios.post(`/api/v1/driver/rides/${id}/reject`);
    fetchRides();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Rides</h1>
      {rides.length === 0 ? (
        <p>No available rides</p>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride._id} className="card p-4 bg-base-100 shadow">
              <h3 className="font-semibold">
                {ride.route.startPoint} → {ride.route.endPoint}
              </h3>
              <p>Customer: {ride.customer.name}</p>
              <p>Passengers: {ride.passengers}</p>
              <p>Amount: ₦{ride.amount}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleAccept(ride._id)}
                  className="btn btn-sm btn-success"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(ride._id)}
                  className="btn btn-sm btn-error"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
