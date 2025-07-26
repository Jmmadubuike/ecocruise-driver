"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const WithdrawalManagement = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await api.get("/api/v1/driver/withdrawals");
        setWithdrawals(res.data.data);
        setBalance(typeof res.data.balance === "number" ? res.data.balance : 0);
      } catch (err) {
        setError("Failed to fetch withdrawal history.");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await api.post("/api/v1/driver/withdrawals", { amount });
      setSuccessMessage(res.data.message);
      setAmount(0);

      const updated = await api.get("/api/v1/driver/withdrawals");
      setWithdrawals(updated.data.data);
      setBalance(updated.data.balance); // Refresh balance
      setPage(1); // Reset to first page
    } catch (err) {
      setError(err.response?.data?.error || "Withdrawal failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const paginatedData = withdrawals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(withdrawals.length / itemsPerPage);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#004aad] mb-1">
          Withdrawal Management
        </h2>
        <div className="mt-2 text-sm text-gray-700 font-medium">
          Wallet Balance:{" "}
          <span className="text-[#004aad] font-bold">
            ₦{balance.toLocaleString("en-NG")}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track your wallet withdrawals
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 space-y-4 border-l-4 border-[#004aad]">
        <label className="block text-sm font-semibold text-gray-700">
          Amount to Withdraw
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#004aad]"
          placeholder="Enter amount"
        />
        <Button
          onClick={handleSubmit}
          disabled={submitting || !amount}
          className="w-full bg-[#004aad] hover:bg-[#f80b0b] text-white transition-colors duration-200"
        >
          {submitting ? "Submitting..." : "Request Withdrawal"}
        </Button>
        {error && <p className="text-sm text-[#f80b0b]">{error}</p>}
        {successMessage && (
          <p className="text-sm text-green-600">{successMessage}</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3 text-[#004aad]">
          Withdrawal History
        </h3>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : withdrawals.length === 0 ? (
          <p className="text-sm text-gray-500">No withdrawal requests yet.</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {paginatedData.map((w) => (
                <Card
                  key={w._id}
                  className="bg-white border-l-4 shadow-sm"
                  style={{
                    borderColor:
                      w.status === "approved"
                        ? "#22c55e"
                        : w.status === "rejected"
                        ? "#f80b0b"
                        : "#eab308",
                  }}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="font-semibold text-lg text-gray-800">
                        ₦{w.amount.toLocaleString("en-NG")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(w.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${
                        w.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : w.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {w.status}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="flex items-center gap-1"
              >
                <FiArrowLeft className="text-sm" />
                Prev
              </Button>
              <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <FiArrowRight className="text-sm" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WithdrawalManagement;
