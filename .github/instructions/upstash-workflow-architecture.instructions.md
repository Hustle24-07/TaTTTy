---
alwaysApply: true
applyTo: "**/*.ts,**/*.tsx"
description: Upstash Search + Vercel Workflow Architecture Guide
---

# Upstash Search + Vercel Workflow Architecture

## Tech Stack Overview

This project uses a serverless architecture for image processing and search:

| Component           | Package                  | Purpose                                                         |
| ------------------- | ------------------------ | --------------------------------------------------------------- |
| **Upstash Search**  | `@upstash/search ^0.1.6` | Semantic search with metadata filtering (NOT Redis, NOT Vector) |
| **Vercel Workflow** | `workflow 4.0.1-beta.32` | Durable workflows with automatic retries                        |
| **Vercel Blob**     | `@vercel/blob`           | Large image storage                                             |
| **Grok 2 Vision**   | `@ai-sdk/xai`            | AI-powered image descriptions                                   |

## Architecture Flow

```
Upload Request → Vercel Blob Storage → Grok AI Description → Upstash Search Index
                      ↓                        ↓                      ↓
               (stores image)         (generates text)         (stores metadata)
```

## Key Files & Their Roles

### 1. Upload Route (`app/api/upload/route.ts`)

- Entry point for image uploads
- Starts the durable workflow using `start(processImage, [fileData])`

### 2. Process Image Workflow (`app/api/upload/process-image.ts`)

- Uses `"use workflow"` directive for durable execution
- Three steps: Upload → Describe → Index
- Automatic retries on transient failures

### 3. Upload Step (`app/api/upload/upload-image.ts`)

- Uses `"use step"` directive
- Uploads to Vercel Blob storage
- Returns `PutBlobResult` with `url`, `downloadUrl`, `pathname`

### 4. Generate Description (`app/api/upload/generate-description.ts`)

- Uses `"use step"` directive
- Calls Grok 2 Vision API via Vercel AI SDK
- Returns semantic text description of the image

### 5. Index Image (`app/api/upload/index-image.ts`)

- Uses `"use step"` directive
- Indexes in Upstash Search with rich metadata
- Returns search document result

### 6. Search Action (`app/actions/search.ts`)

- Server action for querying images
- Supports metadata filtering with filter strings

## Upstash Search API

### Initialization

```typescript
import { Search } from "@upstash/search";

const upstash = Search.fromEnv(); // Uses UPSTASH_SEARCH_REST_URL & TOKEN
const index = upstash.index("images");
```

### Indexing Documents

```typescript
await index.upsert({
  id: blob.pathname, // Unique identifier
  content: { text }, // Semantic search content
  metadata: {
    // Filterable metadata
    ...blob, // url, downloadUrl, pathname, contentType
    tattooMetadata: {
      // Custom business metadata
      style: "traditional",
      placement: "arm",
      visibility: "public", // "public" | "private"
      userId: "user_123", // For user-specific queries
      liked: false, // Like status
      // ... more fields
    },
  },
});
```

### Searching with Filters

```typescript
const results = await index.search({
  query: "dragon tattoo",
  filter:
    "tattooMetadata.visibility = 'public' AND tattooMetadata.style = 'japanese'",
});

// Results structure
results.map((result) => ({
  id: result.id,
  score: result.score,
  metadata: result.metadata, // Contains full blob + tattooMetadata
}));
```

### Filter Syntax

| Operator           | Example                         |
| ------------------ | ------------------------------- |
| Equals             | `field = 'value'`               |
| Numeric comparison | `field >= 100`                  |
| Contains (arrays)  | `field CONTAINS 'value'`        |
| AND                | `field1 = 'a' AND field2 = 'b'` |
| OR                 | `field1 = 'a' OR field2 = 'b'`  |

## Vercel Workflow Directives

### `"use workflow"`

Place at the top of the main workflow function. Enables:

- Durable execution across multiple invocations
- State persistence between steps
- Automatic retry on workflow-level failures

### `"use step"`

Place at the top of step functions. Enables:

- Each step runs exactly once (idempotent)
- Results are cached and reused on retry
- Step-level retry with exponential backoff

### Error Handling

```typescript
import { FatalError, RetryableError } from "workflow";

// Fatal errors stop the workflow immediately
throw new FatalError("Invalid data - cannot recover");

// Retryable errors will be retried with backoff
throw new RetryableError("Rate limited", { retryAfter: "1m" });
```

## Metadata Schema

The `tattooMetadata` object structure:

```typescript
{
  // Classification
  style: string;           // traditional, japanese, realism, etc.
  placement: string;       // arm, leg, back, etc.
  size: string;            // small, medium, large, sleeve, etc.
  colors: string[];        // ["black", "red", "blue"]
  themes: string[];        // ["nature", "mythology"]

  // Business
  price: number;           // Estimated cost in USD
  artist: string;
  studio: string;

  // Access Control
  visibility: "public" | "private";
  userId: string;          // Owner's user ID

  // Engagement
  liked: boolean;          // Like status (for user favorites)
  likedBy: string[];       // Array of user IDs who liked

  // Timestamps
  uploadDate: string;      // ISO date string
}
```

## Common Query Patterns

### Public Gallery

```typescript
filter: "tattooMetadata.visibility = 'public'";
```

### User's Private Images

```typescript
filter: `tattooMetadata.userId = '${userId}' AND tattooMetadata.visibility = 'private'`;
```

### User's Liked Images

```typescript
filter: `tattooMetadata.likedBy CONTAINS '${userId}'`;
// OR for simple boolean:
filter: `tattooMetadata.liked = true AND tattooMetadata.userId = '${userId}'`;
```

### Admin Access (All Images)

```typescript
// No filter - returns all documents
```

## IMPORTANT: Image Storage Rules

1. **NEVER store images in localStorage** - Images are too large, will cause quota errors
2. **Images live in Vercel Blob** - Access via `blob.url` or `blob.downloadUrl`
3. **Only metadata in Upstash Search** - Including like status, user associations
4. **Only IDs/URLs in localStorage** - If needed for session state, store pathnames only

## Updating Document Metadata

To update metadata (e.g., toggling a like):

```typescript
// Re-upsert with same ID updates the document
await index.upsert({
  id: existingPathname,
  content: { text: existingDescription },
  metadata: {
    ...existingMetadata,
    tattooMetadata: {
      ...existingMetadata.tattooMetadata,
      liked: true, // Updated field
    },
  },
});
```

## Environment Variables Required

```env
UPSTASH_SEARCH_REST_URL=https://...
UPSTASH_SEARCH_REST_TOKEN=...
BLOB_READ_WRITE_TOKEN=...
XAI_API_KEY=...  # For Grok
```

---

## Vercel Workflow Deep Dive

### Core Concepts

Vercel Workflow (WDK - Workflow Development Kit) turns async functions into **durable workflows** that:

- **Survive crashes & deploys** - Replays from event log
- **Suspend without compute cost** - Sleep for days/months FREE
- **Auto-retry on failure** - Built-in resilience

### The Two Directives

| Directive        | Purpose                          | Runtime                           |
| ---------------- | -------------------------------- | --------------------------------- |
| `"use workflow"` | Orchestrator - coordinates steps | **Sandboxed** - No full Node.js   |
| `"use step"`     | Worker - does actual work        | **Full Node.js** - All npm access |

### How It Works Under the Hood

```
┌─────────────────────────────────────────────────────────┐
│  Workflow compiles to: API route + Event Log            │
│                                                          │
│  1. Each step → isolated API route                       │
│  2. Workflow SUSPENDS while step runs (no compute!)      │
│  3. All inputs/outputs → persisted to event log          │
│  4. If crash/deploy → replays deterministically          │
└─────────────────────────────────────────────────────────┘
```

### Step Metadata API

```typescript
import { getStepMetadata } from "workflow";

async function myStep() {
  "use step";

  const { stepId, attempt, stepStartedAt } = getStepMetadata();

  // stepId: string      - Unique ID (use for idempotency keys!)
  // attempt: number     - 1, 2, 3... increases with retries
  // stepStartedAt: Date - When this attempt started
}
```

### Retry Configuration

```typescript
async function callExternalAPI() {
  "use step";
  // ... do work
}
callExternalAPI.maxRetries = 5; // Default is 3
```

### Error Types

```typescript
import { FatalError, RetryableError, getStepMetadata } from "workflow";

async function robustStep() {
  "use step";
  const { attempt } = getStepMetadata();

  try {
    const response = await fetch("...");

    if (response.status === 429) {
      // Rate limited - retry with delay
      throw new RetryableError("Rate limited", { retryAfter: "1m" });
    }

    if (response.status === 404) {
      // Not found - DON'T retry (fatal)
      throw new FatalError("Resource not found");
    }

    if (response.status >= 500) {
      // Server error - exponential backoff
      throw new RetryableError("Server error", {
        retryAfter: attempt ** 2 * 1000, // 1s, 4s, 9s, 16s...
      });
    }

    return await response.json();
  } catch (error) {
    // Unknown errors auto-retry up to maxRetries
    throw error;
  }
}
robustStep.maxRetries = 5;
```

### Sleep (FREE - No Compute!)

```typescript
import { sleep } from "workflow";

export async function reminderWorkflow(userId: string) {
  "use workflow";

  await sendInitialEmail(userId);
  await sleep("24 hours"); // ← PAUSES, costs NOTHING
  await sendFollowUp(userId);
  await sleep("7 days"); // ← Can be days, weeks, MONTHS!
  await sendFinalReminder(userId);
}

// Sleep formats:
// Duration: "30s", "5m", "1 hour", "24 hours", "7 days", "1 month"
// Date: await sleep(new Date("2025-12-25"))
```

### Hooks (Human-in-the-Loop)

```typescript
import { createHook } from "workflow";
import { resumeHook } from "workflow/api";

// In workflow:
export async function approvalWorkflow(docId: string) {
  "use workflow";

  const hook = createHook<{ approved: boolean; comment: string }>();
  console.log("Token:", hook.token);

  const result = await hook; // SUSPENDS until resumed

  if (result.approved) {
    await processApproval(docId);
  }
}

// In API route to resume:
await resumeHook(token, { approved: true, comment: "Looks good!" });
```

### Webhooks (HTTP Resume)

```typescript
import { createWebhook } from "workflow";

export async function paymentWorkflow(orderId: string) {
  "use workflow";

  const webhook = createWebhook();
  console.log("Callback URL:", webhook.url); // Auto-generated!

  await initiatePayment(orderId, webhook.url);

  const request = await webhook; // SUSPENDS until HTTP POST
  const data = await request.json();

  if (data.status === "success") {
    await fulfillOrder(orderId);
  }
}
```

### Starting Workflows

```typescript
import { start } from "workflow/api";
import { processImage } from "./workflows/process-image";

export async function POST(request: Request) {
  const data = await request.json();

  const run = await start(processImage, data);

  return Response.json({
    runId: run.id,
    status: run.status,
  });
}
```

### Control Flow Patterns

```typescript
export async function batchWorkflow(items: Item[]) {
  "use workflow";

  // Sequential
  for (const item of items) {
    await processItem(item);
  }

  // Parallel
  await Promise.all([stepA(), stepB(), stepC()]);

  // Conditional
  const result = await checkCondition();
  if (result.needsReview) {
    await humanReviewStep();
  }
}
```

### Observability

**Dashboard:** Vercel Dashboard → Your Project → AI → Workflows

Shows:

- All runs with status (pending, completed, failed)
- Each step's input/output
- Retry attempts & timing

**CLI:**

```bash
npx workflow inspect runs --limit 10
npx workflow inspect runs --json
npx workflow web  # Opens web UI
```

### Workflow Limitations

❌ **Cannot cancel programmatically** - No API yet  
❌ **Cannot pause manually** - Only via `sleep()` or hooks  
❌ **Steps can't call steps** - Must be called from workflow  
❌ **Workflow function is sandboxed** - No full Node.js access

### Best Practices

1. **Keep workflow functions simple** - Just orchestration logic
2. **Put all I/O in steps** - API calls, DB, file operations
3. **Use `stepId` for idempotency** - Especially for payments
4. **Handle errors explicitly** - FatalError vs RetryableError
5. **Log with `[stepId]`** - For debugging in observability
