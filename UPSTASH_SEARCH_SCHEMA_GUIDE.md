# Upstash Search: Content vs. Metadata Schema Guide

This guide explains how to properly structure your data for Upstash Search to enable powerful semantic search capabilities while maintaining precise filtering options.

## The Core Concept

Upstash Search (and vector databases in general) distinguishes between two types of data for every record:

1.  **Content (`data`)**: The text that is "read" and understood by the AI.
2.  **Metadata**: Structured fields used for filtering, sorting, and grouping.

### 1. Content (The "Searchable" Part)
*   **Purpose**: This is what users search *against*. When a user types "vibrant colorful tattoo", the AI looks for records where the **Content** has similar meaning.
*   **How it works**: This text is converted into a "vector embedding" (a list of numbers representing meaning).
*   **Best Practice**: Combine all semantically relevant text into a single string or object.
*   **In our project**: Defined in `upstash_content.json`.

**Example:**
> "Neo-Traditional. Modern take on traditional tattoo styles with more dimension and detail."

### 2. Metadata (The "Filterable" Part)
*   **Purpose**: This is what you use to *refine* results. It is NOT semantically searched.
*   **How it works**: These are stored as exact values. You use them for SQL-like queries (e.g., `WHERE popularity_rank > 5` or `WHERE is_active = true`).
*   **Best Practice**: Keep this strictly for structured data (IDs, slugs, numbers, booleans, categories).
*   **In our project**: Defined in `upstash_filters.json`.

**Example:**
> `slug: "neo-traditional"`, `popularity_rank: 5`, `is_active: true`

---

## Schema Configuration

We have separated our schema definitions into two files to keep the separation of concerns clear.

### A. Content Schema (`upstash_content.json`)
This file defines **which fields** from our raw data should be concatenated to form the searchable context.

```json
{
  "tattoo_style": "title, description",
  "placement": "title, description, body_area",
  "color": "title, description",
  "mood": "title, description",
  "skin_tone": "title, undertone, category",
  "site_page": "title, description, keywords"
}
```
*   *Effect*: For a `tattoo_style`, the indexer will combine the `title` and `description` into one searchable block of text.

### B. Metadata Schema (`upstash_filters.json`)
This file defines **which fields** should be stored as structured metadata for filtering.

```json
{
  "tattoo_style": "slug, popularity_rank, is_active",
  "placement": "slug, pain_level, visibility_level, popularity_rank, is_common",
  "color": "slug, color_type, popularity_rank",
  "mood": "slug, intensity_level, popularity_rank, palette",
  "skin_tone": "slug, hex, fitzpatrick, popularity_rank",
  "site_page": "path, category"
}
```
*   *Effect*: You can perform queries like:
    *   "Find 'bold' styles (semantic search)..."
    *   "...but only where `popularity_rank` is top 10 (metadata filter)."

---

## Integration Flow

1.  **Raw Data**: We start with a CSV or Database record.
2.  **Mapping**:
    *   We pull fields listed in `upstash_content.json` -> Create the `data` string.
    *   We pull fields listed in `upstash_filters.json` -> Create the `metadata` object.
3.  **Indexing**: We send this pair to Upstash:
    ```typescript
    await index.upsert({
      id: "style-neo-traditional",
      data: "Neo-Traditional: Modern take on traditional tattoo styles...", // Content
      metadata: { // Metadata
        slug: "neo-traditional",
        popularity_rank: 5,
        type: "tattoo_style"
      }
    })
    ```
4.  **Searching**:
    *   User Query: "cool designs for arms"
    *   System: Searches `data` for "cool designs" + Filters `metadata` for `body_area = 'Arms'`.

## Why this separation matters?
If you put "popularity_rank: 5" into the **Content**, the AI might think the number "5" has some semantic meaning (like "5 stars" or "5 fingers"), which confuses the search. By keeping it in **Metadata**, it remains a strict mathematical value for sorting.
