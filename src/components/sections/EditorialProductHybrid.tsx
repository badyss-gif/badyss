"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ProductImage } from "@/components/commerce/ProductImage";
import { formatPrice } from "@/lib/format";
import { routes } from "@/config/routes";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import type { Product } from "@/types/product";

interface EditorialProductHybridProps {
  product: Product;
}

// Ties editorial storytelling directly to a shoppable product, rather than
// leaving campaign imagery and commerce in separate, disconnected sections:
// a large campaign image parallaxes gently as the user scrolls past, while a
// real product — price, name, CTA — floats in as its own card over the
// bottom edge. The product data is real (mock, clearly labeled elsewhere,
// same domain `Product` type as the rest of the site) — nothing about the
// product itself is invented here, only which one gets this spotlight.
export function EditorialProductHybrid({ product }: EditorialProductHybridProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const t = useTranslations("home.editorialProductHybrid");
  const tAlt = useTranslations("imageAlt");

  return (
    <Section spacing="editorial">
      <div ref={sectionRef} className="relative overflow-hidden">
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9]">
          <motion.div className="absolute inset-0 -my-10" style={shouldReduceMotion ? undefined : { y: imageY }}>
            <Image
              src="/images/categories/t-shirts.png"
              alt={tAlt("tshirtPremiumUrbain")}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

          <Reveal className="absolute left-6 top-6 max-w-xs sm:left-10 sm:top-10">
            <p className="text-xs uppercase tracking-widest text-white/70">{t("eyebrow")}</p>
            <h2 className="mt-2 font-display text-display-sm font-extrabold leading-[1.05] tracking-tight text-white sm:text-display-md">
              {t("heading")}
            </h2>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-6 right-6 w-48 bg-surface p-3 shadow-xl sm:bottom-10 sm:right-10 sm:w-56"
          >
            <Link href={routes.product(product.slug)} className="group block">
              <ProductImage image={product.images[0] ?? null} className="w-full" />
              <div className="mt-3 space-y-1">
                <p className="text-sm text-foreground">{product.name}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className={product.price.onSale ? "text-error" : "text-foreground"}>
                    {formatPrice(product.price.amount, product.price.currency)}
                  </span>
                  {product.price.onSale && product.price.regularAmount ? (
                    <span className="text-muted-foreground line-through">
                      {formatPrice(product.price.regularAmount, product.price.currency)}
                    </span>
                  ) : null}
                </div>
                <span className="inline-flex items-center gap-1.5 pt-1 text-xs font-medium text-foreground underline-offset-4 group-hover:underline">
                  {t("viewProduct")}
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
