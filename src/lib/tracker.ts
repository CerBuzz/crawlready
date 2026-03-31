/**
 * Client-side event tracking for report pages.
 *
 * Captures: page views, scroll-depth milestones, time-on-page,
 * CTA clicks — all tagged with the report slug and UTM params.
 */

export interface TrackPayload {
  type: "pageview" | "scroll" | "cta_click" | "time_on_page" | "page_leave";
  slug: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  data?: Record<string, string | number>;
  ts: string;
}

function getUtmParams(): Pick<
  TrackPayload,
  "utm_source" | "utm_medium" | "utm_campaign"
> {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  return {
    utm_source: sp.get("utm_source") || undefined,
    utm_medium: sp.get("utm_medium") || undefined,
    utm_campaign: sp.get("utm_campaign") || undefined,
  };
}

function send(payload: TrackPayload) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", body);
  } else {
    fetch("/api/track", {
      method: "POST",
      body,
      keepalive: true,
    });
  }
}

export function trackEvent(
  type: TrackPayload["type"],
  slug: string,
  data?: Record<string, string | number>,
) {
  send({
    type,
    slug,
    ...getUtmParams(),
    data,
    ts: new Date().toISOString(),
  });
}
