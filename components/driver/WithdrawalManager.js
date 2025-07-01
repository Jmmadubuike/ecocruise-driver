"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { FiDollarSign, FiClock, FiCheckCircle, FiXOctagon } from "react-icons/fi";

const WithdrawalStatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-yellow-200 text-yellow-800",
    approved: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-800",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-200 text-gray-800"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function WithdrawalManager() {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, withdrawalsRes] = await Promise.all([
          axios.get("/api/v1/driver/analytics"), // reuse existing analytics for balance
          axios.get("/api/v1/driver/withdrawals"),
        ]);
        setBalance(balanceRes.data.data.walletBalance || 0);
        setWithdrawals(withdrawalsRes.data.data);
      } catch {
        setError("Failed to load withdrawal data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setSuccessMsg(null);

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (numericAmount > balance) {
      setError("Insufficient balance for this withdrawal amount.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/api/v1/driver/withdraw", { amount: numericAmount });
      setSuccessMsg("Withdrawal request submitted successfully.");
      setAmount("");
      // Refresh data
      const withdrawalsRes = await axios.get("/api/v1/driver/withdrawals");
      setWithdrawals(withdrawalsRes.data.data);
      const balanceRes = await axios.get("/api/v1/driver/analytics");
      setBalance(balanceRes.data.data.walletBalance || 0);
    } catch {
      setError("Failed to submit withdrawal request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-4">Loading withdrawal information...</p>;

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Wallet Balance: ₦{balance.toLocaleString()}</h2>

      <div className="max-w-sm">
        <input
          type="number"
          min="1"
          max={balance}
          placeholder="Enter withdrawal amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered w-full"
          disabled={submitting || balance <= 0}
        />
        <Button
          onClick={handleSubmit}
          disabled={submitting || balance <= 0}
          className="mt-2 w-full"
        >
          {submitting ? "Submitting..." : "Request Withdrawal"}
        </Button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
      </div>

      <h3 className="text-xl font-semibold">Withdrawal History</h3>
      {withdrawals.length === 0 ? (
        <p>No withdrawal requests yet.</p>
      ) : (
        withdrawals.map((w) => (
          <Card key={w._id} className="mb-3 shadow-sm">
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="font-semibold">₦{w.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  Requested on {new Date(w.createdAt).toLocaleDateString()}
                </p>
              </div>
              <WithdrawalStatusBadge status={w.status} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
