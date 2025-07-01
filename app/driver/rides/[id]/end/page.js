// ✅ /app/driver/rides/[id]/end/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/api';

export default function EndRidePage() {
  const { id } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    axios.get(`/api/v1/driver/rides/${id}`).then(res => setRide(res.data));
  }, [id]);

  const handleEnd = async () => {
    await axios.post(`/api/v1/driver/rides/${id}/end`);
    router.push('/driver/rides/history');
  };

  if (!ride) return <div>Loading...</div>;

  return (
    <div className="card bg-base-100 p-6 shadow">
      <h1 className="text-xl font-bold mb-2">End Ride</h1>
      <p>{ride.route.startPoint} → {ride.route.endPoint}</p>
      <p>Amount: ₦{ride.amount}</p>
      <button onClick={handleEnd} className="btn btn-success mt-4">End Ride</button>
    </div>
  );
}

