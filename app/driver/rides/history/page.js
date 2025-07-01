"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api";
import dayjs from "dayjs";

export default function DriverRideHistoryPage() {
  const [rides, setRides] = useState([]);
  const [statusFilter, setStatusFilter] = useState("completed");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchRides = async (status = "completed", type = "all", page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `/api/v1/driver/rides?status=${status}&page=${page}&type=${type}`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      const { data, meta } = res.data || {};
      if (!Array.isArray(data)) {
        throw new Error("Invalid API response structure: data not array");
      }

      setRides(data);
      setPagination({
        page: meta?.page || 1,
        totalPages: meta?.totalPages || 1,
      });
    } catch (err) {
      console.error("Error loading rides:", err);
      setError("Failed to load ride history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides(statusFilter, typeFilter, 1);
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchRides(statusFilter, typeFilter, pagination.page);
  }, [pagination.page]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#004aad] border-b-4 border-[#f80b0b] pb-2 w-fit">
        Ride History
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 border border-gray-200">
          <div className="stat-title text-[#004aad]">Total Rides</div>
          <div className="stat-value">{rides.length}</div>
        </div>
        <div className="stat bg-base-100 border border-gray-200">
          <div className="stat-title text-[#004aad]">Completed</div>
          <div className="stat-value">{rides.filter(r => r.status === "completed").length}</div>
        </div>
        <div className="stat bg-base-100 border border-gray-200">
          <div className="stat-title text-[#004aad]">Cancelled</div>
          <div className="stat-value">{rides.filter(r => r.status === "cancelled").length}</div>
        </div>
        <div className="stat bg-base-100 border border-gray-200">
          <div className="stat-title text-[#004aad]">In Progress</div>
          <div className="stat-value">{rides.filter(r => r.status === "in-progress").length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-start items-center mb-4">
        <label className="form-control w-full max-w-xs">
          <span className="label-text">Filter by Status</span>
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="completed">Completed</option>
            <option value="accepted">Accepted</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        <label className="form-control w-full max-w-xs">
          <span className="label-text">Filter by Ride Type</span>
          <select
            className="select select-bordered"
            value={typeFilter}
            onChange={handleTypeChange}
          >
            <option value="all">All</option>
            <option value="single">Single Ride</option>
            <option value="multi">Multi Ride</option>
          </select>
        </label>
      </div>

      {/* Data or feedback */}
      {loading ? (
        <div className="text-center">Loading rides...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : rides.length === 0 ? (
        <div className="text-center text-gray-500">No rides found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-[#004aad] text-white">
                <th>#</th>
                <th>Customer</th>
                <th>Route</th>
                <th>Passengers</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride, index) => (
                <tr key={ride._id}>
                  <td>{(pagination.page - 1) * 10 + index + 1}</td>
                  <td>{ride.customer?.firstName} {ride.customer?.lastName}</td>
                  <td>{ride.route?.startPoint} → {ride.route?.endPoint}</td>
                  <td>{ride.passengers}</td>
                  <td className="capitalize">{ride.type}</td>
                  <td>₦{ride.amount?.toLocaleString()}</td>
                  <td>
                    <span className={`badge capitalize ${
                      ride.status === "completed"
                        ? "badge-success"
                        : ride.status === "pending"
                        ? "badge-warning"
                        : ride.status === "cancelled"
                        ? "badge-error"
                        : "badge-info"
                    }`}>
                      {ride.status}
                    </span>
                  </td>
                  <td>{dayjs(ride.createdAt).format("DD MMM, YYYY hh:mm A")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prevPage}
            className="btn btn-outline text-[#004aad] border-[#004aad] hover:bg-[#004aad] hover:text-white"
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={nextPage}
            className="btn btn-outline text-[#f80b0b] border-[#f80b0b] hover:bg-[#f80b0b] hover:text-white"
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
