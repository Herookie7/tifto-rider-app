/**
 * Route Optimization Utility
 * Calculates optimal route for multiple deliveries using distance-based sorting
 */

export interface DeliveryLocation {
  orderId: string;
  latitude: number;
  longitude: number;
  address?: string;
  order?: any;
}

export interface OptimizedRoute {
  orderId: string;
  latitude: number;
  longitude: number;
  address?: string;
  estimatedTime: number; // in minutes
  distance: number; // in km
  order?: any;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Optimize delivery route using nearest neighbor algorithm
 * @param currentLocation - Current rider location
 * @param deliveries - Array of delivery locations
 * @returns Optimized route with estimated times
 */
export const optimizeRoute = (
  currentLocation: { latitude: number; longitude: number },
  deliveries: DeliveryLocation[]
): OptimizedRoute[] => {
  if (deliveries.length === 0) {
    return [];
  }

  if (deliveries.length === 1) {
    const delivery = deliveries[0];
    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      delivery.latitude,
      delivery.longitude
    );
    return [
      {
        orderId: delivery.orderId,
        latitude: delivery.latitude,
        longitude: delivery.longitude,
        address: delivery.address,
        estimatedTime: Math.ceil(distance * 2), // Assume 30 km/h average speed
        distance: distance,
        order: delivery.order
      }
    ];
  }

  // Nearest neighbor algorithm
  const optimized: OptimizedRoute[] = [];
  const remaining = [...deliveries];
  let currentLat = currentLocation.latitude;
  let currentLon = currentLocation.longitude;
  let totalTime = 0;

  while (remaining.length > 0) {
    // Find nearest delivery from current location
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(
      currentLat,
      currentLon,
      remaining[0].latitude,
      remaining[0].longitude
    );

    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(
        currentLat,
        currentLon,
        remaining[i].latitude,
        remaining[i].longitude
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    // Add nearest to optimized route
    const nearest = remaining[nearestIndex];
    const estimatedTime = Math.ceil(nearestDistance * 2); // Assume 30 km/h average speed
    totalTime += estimatedTime;

    optimized.push({
      orderId: nearest.orderId,
      latitude: nearest.latitude,
      longitude: nearest.longitude,
      address: nearest.address,
      estimatedTime: totalTime,
      distance: nearestDistance,
      order: nearest.order
    });

    // Update current location
    currentLat = nearest.latitude;
    currentLon = nearest.longitude;

    // Remove from remaining
    remaining.splice(nearestIndex, 1);
  }

  return optimized;
};

/**
 * Get total route distance and estimated time
 */
export const getRouteSummary = (route: OptimizedRoute[]) => {
  if (route.length === 0) {
    return { totalDistance: 0, totalTime: 0 };
  }

  const totalDistance = route.reduce((sum, stop) => sum + stop.distance, 0);
  const totalTime = route[route.length - 1]?.estimatedTime || 0;

  return {
    totalDistance: Math.round(totalDistance * 10) / 10, // Round to 1 decimal
    totalTime
  };
};
