'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/api';

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/support');
      setTickets(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;

    try {
      await axios.post('/api/v1/support', { subject, message });
      setSubject('');
      setMessage('');
      fetchTickets();
    } catch (err) {
      console.error('Failed to submit ticket:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const paginatedTickets = tickets.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#004aad] border-b-4 border-[#f80b0b] w-fit pb-2">
        Support Center
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-10 border-l-4 border-[#004aad]">
        <h2 className="text-xl font-semibold text-[#004aad] mb-4">Submit a Ticket</h2>
        <input
          className="input input-bordered w-full mb-4"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="textarea textarea-bordered w-full h-32 mb-4"
          placeholder="Describe your issue"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="btn bg-[#004aad] hover:bg-[#f80b0b] text-white w-full"
        >
          Submit Ticket
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#004aad] mb-4">Your Tickets</h2>

        {loading ? (
          <p className="text-center text-[#004aad]">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-gray-500">No tickets submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {paginatedTickets.map((t) => (
              <div
                key={t._id}
                className="card shadow-md bg-blue-50 p-4 rounded-lg border-l-4 border-[#f80b0b]"
              >
                <h3 className="font-semibold text-[#f80b0b]">{t.subject}</h3>
                <p className="text-gray-700 mb-2">{t.message}</p>
                <span
                  className={`badge ${
                    t.status === 'resolved'
                      ? 'badge-success'
                      : 'badge-warning'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="btn btn-outline"
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="btn btn-outline"
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
