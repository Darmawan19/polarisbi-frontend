"use client";

import { useState, useSyncExternalStore, type CSSProperties, type FocusEvent } from "react";
import Link from "next/link";
import { ArrowRight, CircleX, Newspaper, Pause, Play, RotateCcw } from "lucide-react";
import { CATEGORY_ICON } from "@/components/insight/category-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";
import { formatDateTime, formatRelativeTime, safeExternalUrl } from "@/lib/insight/format";
import type { FeedItem, SeverityLabel } from "@/lib/insight/types";
import { useNow, type RecentFeed, type Resource } from "@/hooks/use-insight";
import { cn } from "@/lib/utils";

const MAX_ITEMS = 12;
const MIN_SCORE = 40;
/** detik per item; durasi total mengikuti jumlah item supaya kecepatan terasa sama */
const SECONDS_PER_ITEM = 7;

const DOT: Record<SeverityLabel, string> = {
  rendah: "bg-sev-low-fg",
  sedang: "bg-sev-medium-fg",
  tinggi: "bg-sev-high-fg",
  sangat_tinggi: "bg-sev-critical-fg",
};

// ------------------------------------------------------------------ prefers-reduced-motion

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false
  );
}

// ------------------------------------------------------------------ item

function TickerItem({ item, now, copy }: { item: FeedItem; now: number; copy?: boolean }) {
  const { t, lang } = useI18n();
  const href = safeExternalUrl(item.url);
  const Icon = CATEGORY_ICON[item.category];
  const content = (
    <>
      <span className={cn("h-2 w-2 shrink-0 rounded-full", DOT[item.severity_label] ?? DOT.rendah)} aria-hidden="true" />
      {!copy && (
        <span className="sr-only">
          {t("insight.severity.label")}: {t(`insight.severity.${item.severity_label}` as const)}.
        </span>
      )}
      <span className="inline-flex shrink-0 items-center gap-1 rounded border border-border bg-muted/60 px-1 py-px text-[10px] font-medium text-foreground/85">
        {Icon && <Icon className="h-3 w-3 text-muted-foreground" aria-hidden="true" />}
        {t(`insight.categoryShort.${item.category}` as const)}
      </span>
      <span className="max-w-[22rem] truncate text-foreground">{item.title}</span>
      <time
        dateTime={item.published_at}
        title={formatDateTime(item.published_at, lang)}
        className="shrink-0 text-[11px] text-muted-foreground"
      >
        {formatRelativeTime(item.published_at, lang, now || undefined)}
      </time>
      {href && !copy && <span className="sr-only">{t("insight.feed.opensNewTab")}</span>}
    </>
  );
  const cls =
    "inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded px-1 text-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";
  return (
    <li className="shrink-0">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={copy ? -1 : undefined}
          className={cn(cls, "hover:bg-muted/70")}
        >
          {content}
        </a>
      ) : (
        <span className={cls}>{content}</span>
      )}
    </li>
  );
}

// ------------------------------------------------------------------ bar

function ThinBar({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "error" }) {
  const { t } = useI18n();
  return (
    <section
      aria-label={t("dash.ticker.label")}
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1 rounded-md border px-3 py-1 text-[12px]",
        tone === "error"
          ? "border-chip-down-fg/25 bg-chip-down/60 text-chip-down-fg dark:bg-chip-down/10"
          : "border-border bg-card text-muted-foreground"
      )}
    >
      {children}
    </section>
  );
}

function ViewAllLink() {
  const { t } = useI18n();
  return (
    <Link
      href="/insight"
      aria-label={t("dash.ticker.viewAll")}
      className="inline-flex min-h-7 shrink-0 items-center gap-1 rounded px-1.5 text-[12px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="hidden sm:inline">{t("dash.ticker.viewAll")}</span>
      <span className="sm:hidden">{t("dash.ticker.viewAllShort")}</span>
      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

/**
 * Pita headline: item 24 jam terakhir dengan skor tertinggi (maks. 12, skor >= 40).
 * Bergulir pelan; berhenti saat hover (CSS), saat fokus keyboard, atau lewat tombol Jeda.
 * Saat dijeda / fokus / prefers-reduced-motion: tanpa animasi, tampil sebagai daftar statis
 * yang bisa digeser horizontal. Daftar asli dirender sekali untuk pembaca layar;
 * salinan untuk loop bertanda aria-hidden dan tidak bisa difokus.
 */
export function HeadlineTicker({ feed }: { feed: Resource<RecentFeed> }) {
  const { t } = useI18n();
  const now = useNow();
  const reduced = useReducedMotion();
  const [userPaused, setUserPaused] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  const data = feed.data;

  if (!data) {
    if (feed.error) {
      return (
        <ThinBar tone="error">
          <CircleX className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span role="alert" className="min-w-0 flex-1">
            {t("dash.ticker.error")}
          </span>
          <button
            type="button"
            onClick={feed.reload}
            className="inline-flex min-h-7 items-center gap-1 rounded-md border border-border bg-card px-2 font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {t("insight.retry")}
          </button>
        </ThinBar>
      );
    }
    return (
      <ThinBar>
        <Skeleton className="h-3.5 w-full" />
      </ThinBar>
    );
  }

  const items = data.items.filter((i) => i.score >= MIN_SCORE).slice(0, MAX_ITEMS);

  if (items.length === 0) {
    return (
      <ThinBar>
        <Newspaper className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1">{t("dash.ticker.empty")}</span>
        <ViewAllLink />
      </ThinBar>
    );
  }

  const animated = !reduced && !userPaused && !focusWithin;

  function onBlur(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
  }

  const style = { "--ticker-duration": `${Math.max(30, items.length * SECONDS_PER_ITEM)}s` } as CSSProperties;

  return (
    <section
      aria-label={t("dash.ticker.label")}
      className="insight-ticker flex min-h-9 items-center gap-2 rounded-md border border-border bg-card px-2 py-0.5"
    >
      <span className="hidden shrink-0 items-center gap-1 pl-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:inline-flex">
        <Newspaper className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        {t("dash.ticker.heading")}
      </span>

      {/* `relative`: sr-only di dalam item terpotong di sini, tidak memperpanjang scroll halaman. */}
      <div
        className={cn(
          "relative min-w-0 flex-1",
          animated
            ? "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)]"
            : "overflow-x-auto overflow-y-hidden"
        )}
        onFocus={() => setFocusWithin(true)}
        onBlur={onBlur}
      >
        <div className={cn("flex w-max", animated && "insight-ticker-track")} style={animated ? style : undefined}>
          <ul aria-label={t("dash.ticker.listLabel")} className="flex shrink-0 items-center gap-5 pr-5">
            {items.map((it) => (
              <TickerItem key={it.id} item={it} now={now} />
            ))}
          </ul>
          {animated && (
            <ul aria-hidden="true" className="flex shrink-0 items-center gap-5 pr-5">
              {items.map((it) => (
                <TickerItem key={it.id} item={it} now={now} copy />
              ))}
            </ul>
          )}
        </div>
      </div>

      {!reduced && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-pressed={userPaused}
          aria-label={userPaused ? t("dash.ticker.play") : t("dash.ticker.pause")}
          className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center gap-1 rounded-md border border-border bg-background px-1.5 text-[11px] font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {userPaused ? (
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span className="hidden md:inline">{userPaused ? t("dash.ticker.playShort") : t("dash.ticker.pauseShort")}</span>
        </button>
      )}

      <ViewAllLink />
    </section>
  );
}
