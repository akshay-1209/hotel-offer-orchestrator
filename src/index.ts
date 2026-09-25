import express from "express";
import supplierARouter from "./api/supplierA.js";
import supplierBRouter from "./api/supplierB.js";
import hotelRouter from "./api/hotels.js";
import { connectRedis } from "./redis.js";

const app = express();

const PORT = 3000;

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/supplierA", supplierARouter);
app.use("/supplierB", supplierBRouter);
app.use("/api/hotels", hotelRouter);

async function startServer() {
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();