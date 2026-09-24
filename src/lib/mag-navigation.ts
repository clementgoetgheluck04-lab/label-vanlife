/** Public editorial destinations only: never member position or private trip data. */
export function googleMapsRoute(stops: readonly string[]): string {
  if (stops.length < 1 || stops.length > 5 || stops.some(stop => !stop.trim())) throw new Error("Invalid navigation stops");
  const query = new URLSearchParams({ api: "1", travelmode: "driving", destination: stops[stops.length - 1] });
  if (stops.length > 1) query.set("origin", stops[0]);
  if (stops.length > 2) query.set("waypoints", stops.slice(1, -1).join("|"));
  return `https://www.google.com/maps/dir/?${query}`;
}

export function wazeDestination(destination: string): string {
  if (!destination.trim()) throw new Error("Missing destination");
  // Name search deliberately asks the traveller to confirm the matching destination.
  return `https://www.waze.com/ul?${new URLSearchParams({ q: destination, utm_source: "labelvanlife" })}`;
}
