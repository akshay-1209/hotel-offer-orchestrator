import redis, { connectRedis } from "../redis.js";
import type { Hotel } from "../types/hotel.js";

export async function saveHotels(
  city: string,
  hotels: Hotel[]
): Promise<void> {
  await connectRedis();

  const dataKey = `hotels:${city}:data`;
  const priceKey = `hotels:${city}:prices`;

  // Clear old data for this city
  await redis.del(dataKey);
  await redis.del(priceKey);

  for (const hotel of hotels) {
    // Store complete hotel object
    await redis.hSet(
      dataKey,
      hotel.name,
      JSON.stringify(hotel)
    );

    // Store hotel name with price as the sorted-set score
    await redis.zAdd(priceKey, {
      score: hotel.price,
      value: hotel.name,
    });
  }
}

export async function getHotelsByPrice(
  city: string,
  minPrice: number,
  maxPrice: number
): Promise<Hotel[]> {
  await connectRedis();

  const dataKey = `hotels:${city}:data`;
  const priceKey = `hotels:${city}:prices`;

  // Ask Redis for hotel names whose price is in the range
  const hotelNames = await redis.zRange(
    priceKey,
    minPrice,
    maxPrice,
    { BY: "SCORE" }
  );

  if (hotelNames.length === 0) {
    return [];
  }

  // Fetch the corresponding hotel objects from Redis
  const hotelData = await redis.hmGet(dataKey, hotelNames);

  return hotelData
    .filter((hotel): hotel is string => hotel !== undefined)
    .map((hotel) => JSON.parse(hotel));
}