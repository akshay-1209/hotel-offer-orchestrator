import { Router } from "express";

const router = Router();

const hotels = [
  {
    hotelId: "b1",
    name: "Holtin",
    price: 5340,
    city: "delhi",
    commissionPct: 20,
  },
  {
    hotelId: "b2",
    name: "Radison",
    price: 6200,
    city: "delhi",
    commissionPct: 12,
  },
  {
    hotelId: "b3",
    name: "Leela Palace",
    price: 7500,
    city: "delhi",
    commissionPct: 18,
  },
];

router.get("/hotels", (req, res) => {
  const city = req.query.city as string;

  const result = hotels.filter(
    (hotel) => hotel.city === city
  );

  res.json(result);
});

export default router;