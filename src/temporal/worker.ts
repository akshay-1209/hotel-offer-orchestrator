import { NativeConnection } from "@temporalio/worker";
import { Worker } from "@temporalio/worker";
import * as activities from "../activities/hotelActivities.js";

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || "localhost:7233",
  });

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve("../workflows/hotelWorkflow.js"),
    activities,
    taskQueue: "hotel-task-queue",
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});