import { Router } from "express";
import { Connection, Client } from "@temporalio/client";
import { hotelWorkflow } from "../workflows/hotelWorkflow.js";
import { getHotelsByPrice } from "../redis/hotelCache.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const city = req.query.city as string;

    if (!city) {
      return res.status(400).json({
        error: "city is required",
      });
    }

    const minPrice = req.query.minPrice
      ? Number(req.query.minPrice)
      : undefined;

    const maxPrice = req.query.maxPrice
      ? Number(req.query.maxPrice)
      : undefined;

    const connection = await Connection.connect({
      address: process.env.TEMPORAL_ADDRESS || "localhost:7233",
    });

    const client = new Client({ connection });

    // Refresh supplier data and Redis
    await client.workflow.execute(hotelWorkflow, {
      taskQueue: "hotel-task-queue",
      workflowId: `hotel-${city}-${Date.now()}`,
      args: [city],
    });

    // If filtering is requested, let Redis perform the filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      const hotels = await getHotelsByPrice(
        city,
        minPrice ?? 0,
        maxPrice ?? Number.MAX_SAFE_INTEGER
      );

      return res.json(hotels);
    }

    // Otherwise return all hotels from the workflow
    const hotels = await getHotelsByPrice(
      city,
      0,
      Number.MAX_SAFE_INTEGER
    );

    res.json(hotels);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch hotels",
    });
  }
});

export default router;