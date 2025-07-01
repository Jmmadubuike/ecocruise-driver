// ✅ /app/driver/earnings/withdrawals/page.js
'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/api';

export default function WithdrawalPage() {
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const fetchWithdrawals = async () => {
    const res = await axios.get('/driver/withdrawals');
    setHistory(res.data.data);
  };

  const requestWithdrawal = async () => {
    try {
      await axios.post('/driver/withdrawals/request', { amount });
      setMessage('Request submitted');
      fetchWithdrawals();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error');
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Withdraw Earnings</h1>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input input-bordered w-full max-w-sm"
      />
      <button onClick={requestWithdrawal} className="btn btn-primary mt-2">Request</button>
      {message && <p className="mt-2 text-sm text-info">{message}</p>}
      <h2 className="mt-6 font-semibold">History</h2>
      <ul className="mt-2 space-y-2">
        {history.map((w) => (
          <li key={w._id} className="card p-4 bg-base-100 shadow">
            ₦{w.amount} — <span className="badge">{w.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
