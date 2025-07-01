// ✅ /app/driver/earnings/page.js
'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/api';

export default function EarningsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/driver/analytics').then(res => setData(res.data.data));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card p-4 bg-primary text-primary-content">
        <h2>Total Earnings</h2>
        <p className="text-2xl">₦{data.totalEarnings}</p>
      </div>
      <div className="card p-4 bg-secondary text-secondary-content">
        <h2>Monthly Earnings</h2>
        <p className="text-2xl">₦{data.monthlyEarnings}</p>
      </div>
      <div className="card p-4 bg-accent text-accent-content">
        <h2>Daily Earnings</h2>
        <p className="text-2xl">₦{data.dailyEarnings}</p>
      </div>
    </div>
  );
}
