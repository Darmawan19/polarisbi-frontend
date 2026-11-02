"use client";

import { ExternalLink, LoaderCircle, MapPin, ShieldQuestion, Newspaper } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { formatDateTime, formatNumber, formatRelativeTime, safeExternalUrl } from "@/lib/insight/format";
import type { FeedItem } from "@/lib/insight/types";
import { useNow, type FeedResource } from "@/hooks/use-insight";
import { CategoryBadge } from "./category-badge";
import { SeverityBadge } from "./severity-badge";
import { SectionEmpty, SectionError, SectionSkeleton, useErrorMessage } from "./section-state";

function FeedCard({ item, now }: { item: FeedItem; now: number }) {
  const { t, lang } = useI18n();
  const href = safeExternalUrl(item.url);
  const published = item.published_at || item.fetched_at;
  const titleId = `insight-feed-item-${item.id}`;

  return (
    <article aria-labelledby={titleId} className="rounded-md border border-border bg-card px-3 py-2.5 hover:bg-muted/30">
      <div className="mb-1.5 flex flex-wrap items-center gap-1">
        <SeverityBadge label={item.severity_label} score={item.score} />
        <CategoryBadge category={item.category} />
        {!item.severity_verified && (
          <span
            title={t("insight.feed.unverifiedTitle")}
            className="inline-flex items-center gap-1 rounded border border-dashed border-chip-warn-fg/40 px-1.5 py-0.5 text-[10px] font-semibold text-chip-warn-fg dark:border-chip-warn/50"
          >
            <ShieldQuestion className="h-3 w-3" aria-hidden="true" />
            {t("insight.feed.unverified")}
          </span>
        )}
      </div>

      <h3 id={titleId} className="text-[13px] font-semibold leading-snug text-foreground">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded hover:text-primary hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {item.title || href}
            <ExternalLink className="ml-1 inline h-3 w-3 align-[-1px] text-muted-foreground" aria-hidden="true" />
            <span className="sr-only"> {t("insight.feed.opensNewTab")}</span>
          </a>
        ) : (
          item.title || "—"
        )}
      </h3>

      {item.snippet && <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-foreground/80">{item.snippet}</p>}

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
        <span className="font-medium text-foreground/85">{item.source_label}</span>
        {published && (
          <>
            <span aria-hidden="true">·</span>
            <time dateTime={published} title={formatDateTime(published, lang)}>
              {formatRelativeTime(published, lang, now || undefined)}
            </time>
          </>
        )}
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-0.5">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {item.province ?? t("insight.feed.noProvince")}
        </span>
        <span className="sr-only">
          {" · "}
          {t("insight.feed.score", { n: formatNumber(item.score, lang) })}
        </span>
      </div>

      {item.attribution && <p className="mt-1 text-[10px] text-muted-foreground">{item.attribution}</p>}
    </article>
  );
}

export function FeedList({ feed }: { feed: FeedResource }) {
  const { t, lang } = useI18n();
  const now = useNow();
  const errMsg = useErrorMessage();

  if (feed.loading && feed.items.length === 0) {
    return (
      <div className="space-y-2" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-md border border-border px-3 py-2.5">
            <SectionSkeleton lines={3} />
          </div>
        ))}
      </div>
    );
  }

  if (feed.error && feed.items.length === 0) {
    return <SectionError message={errMsg(feed.error, "insight.feed.error")} onRetry={feed.reload} />;
  }

  if (feed.items.length === 0) {
    return (
      <SectionEmpty title={t("insight.feed.empty")} icon={<Newspaper className="h-5 w-5" />}>
        {t("insight.feed.emptyHint")}
      </SectionEmpty>
    );
  }

  return (
    <div className="space-y-2">
      <ul className="space-y-2">
        {feed.items.map((it) => (
          <li key={it.id}>
            <FeedCard item={it} now={now} />
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-1.5 pt-1">
        <p className="text-[11px] text-muted-foreground" aria-live="polite">
          {t("insight.feed.showing", {
            n: formatNumber(feed.items.length, lang),
            total: formatNumber(feed.total, lang),
          })}
        </p>
        {feed.loadMoreError && (
          <SectionError message={errMsg(feed.loadMoreError, "insight.feed.loadMoreError")} onRetry={feed.loadMore} />
        )}
        {feed.hasMore && !feed.loadMoreError && (
          <button
            type="button"
            onClick={feed.loadMore}
            disabled={feed.loadingMore}
            aria-busy={feed.loadingMore || undefined}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1 text-[12px] font-medium text-foreground hover:bg-muted disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {feed.loadingMore && <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
            {feed.loadingMore ? t("insight.feed.loadingMore") : t("insight.feed.loadMore")}
          </button>
        )}
      </div>
    </div>
  );
}
