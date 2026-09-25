import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/hotelActivities.js";
import type { Hotel } from "../types/hotel.js";

const {
  getSupplierAHotels,
  getSupplierBHotels,
  saveHotelsToRedis,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

export async function hotelWorkflow(
  city: string
): Promise<Hotel[]> {
  const [hotelsA, hotelsB] = await Promise.all([
    getSupplierAHotels(city),
    getSupplierBHotels(city),
  ]);

  const hotels: Hotel[] = [
    ...hotelsA.map((hotel) => ({
      ...hotel,
      supplier: "Supplier A",
    })),
    ...hotelsB.map((hotel) => ({
      ...hotel,
      supplier: "Supplier B",
    })),
  ];

  const bestHotels = new Map<string, Hotel>();

  for (const hotel of hotels) {
    const existing = bestHotels.get(hotel.name);

    if (!existing || hotel.price < existing.price) {
      bestHotels.set(hotel.name, hotel);
    }
  }

  const result = Array.from(bestHotels.values());

  await saveHotelsToRedis(city, result);

  return result;
}