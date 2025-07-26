"use client";

import { useState } from "react";

export default function DriverRegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    department: "danraph",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (Object.values(form).some((field) => !field)) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/driver/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            name: `${form.firstName} ${form.lastName}`,
            role: "driver",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        setSuccess("Registration successful. You can now login.");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          department: "danraph",
        });
      }
    } catch {
      setError("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-[#004aad] mb-6 text-center">
          Driver Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              className="input input-bordered w-full text-[#004aad]"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="input input-bordered w-full text-[#004aad]"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered w-full text-[#004aad]"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input input-bordered w-full text-[#004aad]"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            className="input input-bordered w-full text-[#004aad]"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-semibold text-[#004aad] mb-1">
              Department
            </label>
            <input
              name="department"
              type="text"
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed text-[#004aad]"
              value={form.department}
              readOnly
            />
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 border border-red-300 p-2 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-700 bg-green-50 border border-green-300 p-2 rounded-md text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-md bg-[#004aad] hover:bg-[#003a89] transition duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
