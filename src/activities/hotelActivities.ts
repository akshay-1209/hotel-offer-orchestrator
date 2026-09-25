import { Hotel, SupplierHotel } from "../types/hotel.js";
import { saveHotels } from "../redis/hotelCache.js";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function getSupplierAHotels(
  city: string
): Promise<SupplierHotel[]> {
  const response = await fetch(
    `${APP_URL}/supplierA/hotels?city=${city}`
  );

  if (!response.ok) {
    throw new Error(
      `Supplier A failed with status ${response.status}`
    );
  }

  return await response.json();
}

export async function getSupplierBHotels(
  city: string
): Promise<SupplierHotel[]> {
  const response = await fetch(
    `${APP_URL}/supplierB/hotels?city=${city}`
  );

  if (!response.ok) {
    throw new Error(
      `Supplier B failed with status ${response.status}`
    );
  }

  return await response.json();
}

export async function saveHotelsToRedis(
  city: string,
  hotels: Hotel[]
): Promise<void> {
  await saveHotels(city, hotels);
}