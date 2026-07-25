"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { FaqAccordion } from "./FaqAccordion";

interface FaqCategory {
  id: string;
  title: string;
  items: { question: string; answer: string }[];
}

interface FaqSearchExperienceProps {
  categories: FaqCategory[];
}

// Live client-side search over the already-rendered FAQ data (small enough
// that a server round-trip would only add latency) — while searching, the
// category anchors give way to a single flattened, matching result list;
// clearing the query restores the normal per-category browsing view.
export function FaqSearchExperience({ categories }: FaqSearchExperienceProps) {
  const t = useTranslations("faq");
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const isSearching = normalized.length > 0;

  const results = useMemo(() => {
    if (!isSearching) return [];
    return categories.flatMap((category) =>
      category.items
        .filter(
          (item) =>
            item.question.toLowerCase().includes(normalized) || item.answer.toLowerCase().includes(normalized)
        )
        .map((item) => ({ ...item, categoryTitle: category.title }))
    );
  }, [categories, normalized, isSearching]);

  return (
    <div>
      <div className="max-w-md">
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchAria")}
        />
      </div>

      {isSearching ? (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="mt-10 max-w-3xl"
        >
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("noResultsPrefix")} {query}
              {t("noResultsSuffix")}{" "}
              <button type="button" onClick={() => setQuery("")} className="underline underline-offset-2">
                {t("browseAllCategories")}
              </button>
              .
            </p>
          ) : (
            <>
              <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
                {t("resultCount", { count: results.length })}
              </p>
              <FaqAccordion
                items={results.map((result) => ({
                  question: result.question,
                  answer: (
                    <>
                      <span className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">
                        {result.categoryTitle}
                      </span>
                      {result.answer}
                    </>
                  ),
                }))}
              />
            </>
          )}
        </motion.div>
      ) : (
        <motion.nav
          key="categories"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          aria-label={t("categoriesAria")}
          className="mt-8 flex flex-wrap gap-2"
        >
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              {category.title}
            </a>
          ))}
        </motion.nav>
      )}

      {isSearching ? null : (
        <div className="mt-12 flex max-w-3xl flex-col gap-14">
          {categories.map((category) => (
            <div key={category.id} id={category.id} className="scroll-mt-28">
              <h2 className="font-display text-xl font-extrabold tracking-tight">{category.title}</h2>
              <div className="mt-4">
                <FaqAccordion items={category.items} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
