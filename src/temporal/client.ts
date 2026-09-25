import { Connection, Client } from "@temporalio/client";
import { hotelWorkflow } from "../workflows/hotelWorkflow.js";

async function run() {
  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS || "localhost:7233",
  });

  const client = new Client({
    connection,
  });

const result = await client.workflow.execute(hotelWorkflow, {
  taskQueue: "hotel-task-queue",
  workflowId: `hotel-test-${Date.now()}`,
  args: ["delhi"],
});

  console.log("Workflow result:", result);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});