"use client";

import { useEffect, useState } from 'react';
import axios from '@/lib/api';

export default function DriverProfilePage() {
  const [driver, setDriver] = useState(null);
  const [form, setForm] = useState({ phone: '', department: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/v1/driver/profile');
        setDriver(res.data);
        setForm({
          phone: res.data.phone || '',
          department: res.data.department || '',
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    if (!form.phone.trim() || !form.department.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setSaving(true);
      await axios.put('/api/v1/driver/profile', form);
      alert('Profile updated successfully.');
    } catch (err) {
      console.error('Profile update failed:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="p-4 text-center text-[#004aad]">Loading profile...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="card p-6 bg-base-100 shadow-lg max-w-xl mx-auto mt-10 border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-[#004aad] border-b-4 border-[#f80b0b] pb-2 w-fit">
        Driver Profile
      </h1>

      <div className="grid gap-3 mb-6">
        <div><strong className="text-[#004aad]">Full Name:</strong> {driver.firstName} {driver.lastName}</div>
        <div><strong className="text-[#004aad]">Email:</strong> {driver.email}</div>
        <div><strong className="text-[#004aad]">Username:</strong> {driver.username}</div>
        <div><strong className="text-[#004aad]">Department:</strong> {driver.department || 'N/A'}</div>
      </div>

      <div className="form-control mb-4">
        <label className="label text-[#004aad]" htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="text"
          className="input input-bordered"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label text-[#004aad]" htmlFor="department">Department</label>
        <input
          id="department"
          type="text"
          className="input input-bordered"
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
        />
      </div>

      <button
        onClick={updateProfile}
        className="btn bg-[#004aad] hover:bg-[#f80b0b] text-white w-full"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Update Profile'}
      </button>
    </div>
  );
}
