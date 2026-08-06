"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/motion/Reveal";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { routes } from "@/config/routes";

interface VideoSectionProps {
  /** Real video source — omit until a real BADYSS film exists (never fake a source). */
  src?: string;
  poster: string;
  posterAlt: string;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  );
}

// A cinematic video moment, not a rectangular video-in-a-card: the frame
// scales up (and its corners flatten) as it nears the center of the
// viewport, then eases back down leaving the section — built with a
// contained aspect-ratio box rather than a true 100vw/100vh breakout, which
// gets the same "expanding" sensation without fighting the rest of the
// page's layout/z-index model.
//
// Ready for a real BADYSS film: pass `src` and it renders an actual
// `<video>` with working play/pause. Until then (no real asset exists yet —
// never fake one), it shows the poster with a slow static zoom and an
// honestly-disabled control, the same pattern already used elsewhere on this
// site (SearchButton, NewsletterForm) for features that aren't live yet.
export function VideoSection({ src, poster, posterAlt }: VideoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const t = useTranslations("home.videoSection");
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1, 0.88]);
  const radius = useTransform(scrollYProgress, [0, 0.5, 1], [32, 0, 32]);

  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggle() {
    if (!src || !videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying((value) => !value);
  }

  return (
    <Section spacing="tight" withContainer={false}>
      <div ref={sectionRef} className="px-4 sm:px-6 lg:px-8">
        <motion.div
          style={shouldReduceMotion ? undefined : { scale, borderRadius: radius }}
          className="relative mx-auto aspect-[4/5] w-full max-w-6xl overflow-hidden bg-foreground sm:aspect-[16/9]"
        >
          {src ? (
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              autoPlay={!shouldReduceMotion}
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={poster}
              alt={posterAlt}
              fill
              sizes="100vw"
              className={shouldReduceMotion ? "object-cover" : "object-cover hero-image-drift"}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-10 lg:p-14">
            <Reveal>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/70">{t("eyebrow")}</p>
                <h2 className="mt-2 font-display text-display-md font-extrabold leading-[0.95] tracking-tight text-white sm:text-display-lg">
                  {t("headingLine1")}
                  <br />
                  {t("headingLine2")}
                </h2>
                <LinkButton
                  href={routes.about}
                  className="mt-6 bg-white text-foreground hover:bg-white/90 hover:text-foreground"
                >
                  {t("cta")}
                </LinkButton>
              </div>
            </Reveal>

            <div className="flex shrink-0 flex-col items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                disabled={!src}
                aria-label={src ? (playing ? t("pauseAria") : t("playAria")) : t("comingSoonAria")}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                {src && playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              {!src ? (
                <span className="text-[10px] uppercase tracking-widest text-white/50">{t("comingSoonLabel")}</span>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
