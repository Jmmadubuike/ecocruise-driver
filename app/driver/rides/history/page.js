"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api";
import dayjs from "dayjs";

export default function DriverRideHistoryPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("completed");
  const [typeFilter, setTypeFilter] = useState("all");

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  const fetchRides = async (status = "completed", type = "all", page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `/api/v1/driver/rides?status=${status}&type=${type}&page=${page}&limit=${pagination.limit}`,
        {
          headers: { "Cache-Control": "no-cache" },
        }
      );

      const { data, meta } = res.data || {};

      if (!Array.isArray(data)) {
        throw new Error("Invalid API response: data must be an array.");
      }

      setRides(data);
      setPagination((prev) => ({
        ...prev,
        page: meta?.page || 1,
        totalPages: meta?.totalPages || 1,
        totalItems: meta?.totalItems || 0, // ✅ correctly fetch totalItems
      }));
    } catch (err) {
      console.error("Error loading rides:", err);
      setError("Failed to load ride history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides(statusFilter, typeFilter, pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter, pagination.page]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setStatusFilter("completed");
    setTypeFilter("all");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const exportCSV = () => {
    const headers = [
      "Customer",
      "Route",
      "Passengers",
      "Type",
      "Amount",
      "Status",
      "Date",
    ];
    const rows = rides.map((ride) => [
      ride.customer?.firstName
        ? `${ride.customer.firstName} ${ride.customer.lastName}`
        : ride.customer?.name || "N/A",
      ride.route
        ? `${ride.route.startPoint || "?"} → ${ride.route.endPoint || "?"}`
        : "N/A",
      ride.passengers ?? 0,
      ["single", "multi"].includes(ride.type) ? ride.type : "single",
      ride.amount ?? 0,
      ride.status?.toUpperCase() || "UNKNOWN",
      dayjs(ride.createdAt).format("DD MMM YYYY, hh:mm A"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ride_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#004aad] border-b-4 border-[#f80b0b] pb-2 w-fit">
        Ride History
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 border border-gray-200">
          <div className="stat-title text-[#004aad]">Total Rides (All)</div>
          <div className="stat-value">{pagination.totalItems}</div>
        </div>
        <div className="stat bg-base-100 border border-gray-200">
          <div className="stat-title text-[#004aad]">Completed (Page)</div>
          <div className="stat-value">
            {rides.filter((r) => r.status === "completed").length}
          </div>
        </div>
        <div className="stat bg-base-100 border border-gray-200">
          <div className="stat-title text-[#004aad]">Cancelled (Page)</div>
          <div className="stat-value">
            {rides.filter((r) => r.status === "cancelled").length}
          </div>
        </div>
        <div className="stat bg-base-100 border border-gray-200">
          <div className="stat-title text-[#004aad]">In Progress (Page)</div>
          <div className="stat-value">
            {rides.filter((r) => r.status === "in-progress").length}
          </div>
        </div>
      </div>

      {/* Filters + Actions */}
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

        <button
          onClick={resetFilters}
          className="btn btn-outline border-[#004aad] text-[#004aad] hover:bg-[#004aad] hover:text-white"
        >
          Reset Filters
        </button>

        <button
          onClick={exportCSV}
          className="btn btn-outline border-[#f80b0b] text-[#f80b0b] hover:bg-[#f80b0b] hover:text-white"
        >
          Export CSV
        </button>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner text-[#004aad]"></span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-6">{error}</div>
      ) : rides.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No rides found for the selected filters.
          <br />
          <span className="text-sm text-[#004aad]">
            Try adjusting your filters or refreshing.
          </span>
        </div>
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
                  <td>
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </td>
                  <td>
                    {ride.customer?.firstName
                      ? `${ride.customer.firstName} ${ride.customer.lastName}`
                      : ride.customer?.name || "N/A"}
                  </td>
                  <td>
                    {ride.route?.startPoint} → {ride.route?.endPoint}
                  </td>
                  <td>{ride.passengers}</td>
                  <td className="capitalize">
                    {["single", "multi"].includes(ride.type)
                      ? ride.type
                      : "single"}
                  </td>
                  <td>₦{ride.amount?.toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge capitalize ${
                        ride.status === "completed"
                          ? "badge-success"
                          : ride.status === "pending"
                          ? "badge-warning"
                          : ride.status === "cancelled"
                          ? "badge-error"
                          : "badge-info"
                      }`}
                    >
                      {ride.status}
                    </span>
                  </td>
                  <td>
                    {dayjs(ride.createdAt).format("DD MMM, YYYY hh:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prevPage}
            className="btn btn-outline"
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={nextPage}
            className="btn btn-outline"
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
