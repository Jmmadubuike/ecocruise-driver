import { RideCard } from "@/components/driver/RideCard";

const handleRejectRide = async (rideId) => {
  await axios.post(`/api/v1/driver/rides/${rideId}/reject`);
  // optionally refresh list
};

{rides.map(ride => (
  <RideCard key={ride._id} ride={ride} onReject={handleRejectRide} />
))}
