"use client";

import { useEffect, useReducer } from "react";

const STORAGE_KEY = "badyss-recent-searches";
const MAX_ENTRIES = 6;

type Action = { type: "RESTORE"; queries: string[] } | { type: "ADD"; query: string } | { type: "CLEAR" };

function reducer(state: string[], action: Action): string[] {
  switch (action.type) {
    case "RESTORE":
      return action.queries;
    case "ADD": {
      const trimmed = action.query.trim();
      if (!trimmed) return state;
      const withoutDupe = state.filter((entry) => entry.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...withoutDupe].slice(0, MAX_ENTRIES);
    }
    case "CLEAR":
      return [];
  }
}

function readQueries(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Real, locally-stored search history — only ever populated by the shopper's own completed searches (see SearchButton), never seeded with fake data. */
export function useRecentSearches() {
  const [queries, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    dispatch({ type: "RESTORE", queries: readQueries() });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queries));
  }, [queries]);

  return {
    queries,
    add: (query: string) => dispatch({ type: "ADD", query }),
    clear: () => dispatch({ type: "CLEAR" }),
  };
}
