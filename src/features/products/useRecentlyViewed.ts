"use client";

import { useEffect, useReducer } from "react";

const STORAGE_KEY = "badyss-recently-viewed";
const MAX_ENTRIES = 12;

function readIds(): number[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Records `productId` as viewed (most-recent-first, deduped, capped) — call once on a product page. */
export function useRecordProductView(productId: number) {
  useEffect(() => {
    const ids = readIds().filter((id) => id !== productId);
    ids.unshift(productId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_ENTRIES)));
  }, [productId]);
}

/** Product IDs viewed so far (most-recent-first), read once on mount — a hydration-safe empty array on first render. */
export function useRecentlyViewedIds(): number[] {
  const [ids, restore] = useReducer((_current: number[], next: number[]) => next, []);

  useEffect(() => {
    restore(readIds());
  }, []);

  return ids;
}
