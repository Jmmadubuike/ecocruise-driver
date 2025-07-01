// ✅ /app/driver/rides/[id]/start/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/api';

export default function StartRidePage() {
  const { id } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    axios.get(`/api/v1/driver/rides/${id}`).then(res => setRide(res.data));
  }, [id]);

  const handleStart = async () => {
    await axios.post(`/api/v1/driver/rides/${id}/start`);
    router.push('/api/v1/driver/rides/history');
  };

  if (!ride) return <div>Loading...</div>;

  return (
    <div className="card bg-base-100 p-6 shadow">
      <h1 className="text-xl font-bold mb-2">Start Ride</h1>
      <p>{ride.route.startPoint} → {ride.route.endPoint}</p>
      <p>Customer: {ride.customer.name}</p>
      <button onClick={handleStart} className="btn btn-primary mt-4">Start Ride</button>
    </div>
  );
}

