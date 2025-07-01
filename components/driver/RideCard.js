// ✅ RideCard Component Example with RejectRideModal usage
import { RejectRideModal } from './RejectRideModal';

export function RideCard({ ride, onReject }) {
  return (
    <div className="card bg-base-100 shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold">From: {ride.route.startPoint} → To: {ride.route.endPoint}</h2>
      <p className="text-sm">Passenger: {ride.customer.name} | Phone: {ride.customer.phone}</p>
      <div className="flex justify-end mt-2 gap-2">
        <button className="btn btn-success btn-sm">Accept</button>
        <RejectRideModal rideId={ride._id} onConfirm={onReject} />
      </div>
    </div>
  );
}
