import { permanentRedirect } from "next/navigation";

export default function RoadTripsRedirect() {
  permanentRedirect("/blog#itineraires");
}
