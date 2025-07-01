// ✅ Ride Rejection Confirmation Modal (Reusable, with animation, toast, and auto-close)
import { useState } from 'react';
import toast from 'react-hot-toast';

export function RejectRideModal({ rideId, onConfirm }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    setLoading(true);
    try {
      await onConfirm(rideId);
      toast.success('Ride rejected successfully');
      setOpen(false);
    } catch (err) {
      toast.error('Failed to reject ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-error btn-sm" onClick={() => setOpen(true)}>Reject</button>
      {open && (
        <div className="modal modal-open animate-fade-in">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Reject Ride?</h3>
            <p className="py-2">Are you sure you want to reject this ride?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-error" onClick={handleReject} disabled={loading}>
                {loading ? 'Rejecting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

