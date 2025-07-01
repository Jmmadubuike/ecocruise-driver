// ✅ /app/driver/notifications/page.js
'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get('/notifications').then(res => setNotifications(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 && <p className="text-sm">No new notifications.</p>}
        {notifications.map((note, i) => (
          <div key={i} className="alert alert-info">
            <span>{note.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
