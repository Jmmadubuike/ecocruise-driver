'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  ArrowDownTrayIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function WithdrawalManagement() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/api/v1/driver/withdrawals');
      setWithdrawals(res.data.data || []);
      setBalance(Number(res.data.balance || 0));
    } catch (err) {
      setError('Failed to fetch withdrawal data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await api.post('/api/v1/driver/withdrawals', { amount });
      setSuccessMessage(res.data.message);
      setAmount('');
      await fetchWithdrawals();
      setPage(1);
    } catch (err) {
      setError(err?.response?.data?.error || 'Withdrawal request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const paginated = withdrawals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(withdrawals.length / itemsPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#004aad]">Withdrawal Wallet</h2>
        <p className="text-sm text-gray-500">
          Wallet Balance:{' '}
          <span className="text-[#004aad] font-semibold">
            ₦{balance.toLocaleString('en-NG')}
          </span>
        </p>
      </div> */}

      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border-l-4 border-[#004aad] shadow">
        <label className="text-sm font-semibold block mb-1">
          Amount to Withdraw
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-md p-2 mb-3 focus:ring-2 focus:ring-[#004aad]"
          placeholder="Enter amount"
        />
        <Button
          onClick={handleSubmit}
          disabled={submitting || !amount}
          className="w-full bg-[#004aad] hover:bg-[#00307a] text-white"
        >
          {submitting ? 'Submitting...' : 'Request Withdrawal'}
        </Button>
        {error && <p className="text-sm text-[#f80b0b] mt-2">{error}</p>}
        {successMessage && (
          <p className="text-sm text-green-600 mt-2">{successMessage}</p>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-[#004aad]">
          Withdrawal History
        </h3>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : withdrawals.length === 0 ? (
          <p className="text-sm text-gray-500">No withdrawals yet.</p>
        ) : (
          <>
            <div className="space-y-4">
              {paginated.map((w) => (
                <div
                  key={w._id}
                  className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow flex items-center justify-between border-l-4"
                  style={{
                    borderColor:
                      w.status === 'approved'
                        ? '#22c55e'
                        : w.status === 'rejected'
                        ? '#f80b0b'
                        : '#eab308',
                  }}
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      ₦{w.amount.toLocaleString('en-NG')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(w.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {w.status === 'approved' && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                    {w.status === 'pending' && (
                      <ClockIcon className="w-5 h-5 text-yellow-500" />
                    )}
                    {w.status === 'rejected' && (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        w.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : w.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
