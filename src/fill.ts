import type { FullOGP, OGP } from "./types.ts";

/** Fill missing properties with empty string */
export function fill(ogp: OGP, options: { url?: string }): FullOGP {
  if (ogp.$kind === "full") {
    return ogp;
  }
  return {
    ...ogp,
    $kind: "full",
    ogTitle: ogp.ogTitle ?? "",
    ogSiteName: ogp.ogSiteName ?? "",
    ogUrl: ogp.ogUrl ?? (options.url ?? ""),
    ogDescription: ogp.ogDescription ?? "",
    ogImage: ogp.ogImage ?? "",
  };
}
