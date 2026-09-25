import { Router } from "express";

const router = Router();

const hotels = [
  {
    hotelId: "a1",
    name: "Holtin",
    price: 6000,
    city: "delhi",
    commissionPct: 10,
  },
  {
    hotelId: "a2",
    name: "Radison",
    price: 5900,
    city: "delhi",
    commissionPct: 13,
  },
  {
    hotelId: "a3",
    name: "Taj Palace",
    price: 8500,
    city: "delhi",
    commissionPct: 15,
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