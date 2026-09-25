# Hotel Offer Orchestrator

A Node.js/TypeScript service that aggregates hotel offers from multiple suppliers, deduplicates hotels by name, selects the cheapest offer, stores the results in Redis, and supports price-based filtering.

## Tech Stack

* Node.js
* TypeScript
* Express.js
* Temporal
* Redis
* Docker & Docker Compose

## Features

* Fetches hotel offers from two mock suppliers
* Calls suppliers in parallel using Temporal Activities
* Deduplicates hotels by name
* Selects the cheapest offer when a hotel exists with multiple suppliers
* Stores deduplicated hotel data in Redis
* Supports filtering by minimum and maximum price using Redis
* Dockerized application with Docker Compose

## API

### Get Hotels

```http
GET /api/hotels?city=delhi
```

Returns all deduplicated hotel offers for the specified city.

### Filter by Price

```http
GET /api/hotels?city=delhi&minPrice=5000&maxPrice=7000
```

Returns hotels whose prices fall within the specified range.

Both `minPrice` and `maxPrice` are optional.

### Health Check

```http
GET /health
```

Returns the health status of the application.

## Mock Suppliers

The application includes two mock supplier endpoints:

```http
GET /supplierA/hotels?city=delhi
GET /supplierB/hotels?city=delhi
```

These are used by the Temporal workflow to simulate external hotel suppliers.

## Running Locally

Install dependencies:

```bash
npm install
```

Start Redis and Temporal separately, then start the API:

```bash
npm run dev
```

Start the Temporal Worker in another terminal:

```bash
npm run worker
```

## Running with Docker Compose

The complete application can be started using:

```bash
docker compose up --build
```

This starts:

* Express API
* Temporal Worker
* Temporal Server
* Redis

The API is available at:

```text
http://localhost:3000
```

The Temporal Web UI is available at:

```text
http://localhost:8233
```

## Project Structure

```text
src/
├── api/
│   ├── hotels.ts
│   ├── supplierA.ts
│   └── supplierB.ts
├── activities/
│   └── hotelActivities.ts
├── redis/
│   └── hotelCache.ts
├── temporal/
│   ├── client.ts
│   └── worker.ts
├── types/
│   └── hotel.ts
├── workflows/
│   └── hotelWorkflow.ts
├── redis.ts
└── index.ts
```

## Workflow

```text
Client
  ↓
Express API
  ↓
Temporal Workflow
  ├── Supplier A Activity
  └── Supplier B Activity
          ↓
    Deduplication
          ↓
    Cheapest Offer
          ↓
        Redis
          ↓
    Price Filtering
```

## Example

For the Delhi test data, if both suppliers provide the same hotel, the cheaper offer is selected.

For example:

```text
Supplier A: Holtin → ₹6000
Supplier B: Holtin → ₹5340

Selected: Supplier B → ₹5340
```

The resulting deduplicated offers are stored in Redis and can subsequently be filtered by price.
