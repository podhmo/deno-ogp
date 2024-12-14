import type { FullOGP, OGP } from "./types.ts";

/** Fill missing properties with empty string */
export function fill(ogp: OGP, options: { url?: string }): FullOGP {
  if (ogp.$kind === "full") {
    return ogp;
  }

  if (options.url !== undefined) {
    const url = options.url;
    // for Amazon product page
    if (url.startsWith("https://www.amazon.") && url.includes("/dp/")) {
      // e.g. https://www.amazon.com/{description}/dp/{asin}/...
      const u = new URL(url);
      const parts = u.pathname.split("/dp/");

      const asin = parts[1].split("/")[0];
      const description = decodeURIComponent(parts[0].substring(1)).replaceAll(
        "-",
        " ",
      );
      if (ogp.ogSiteName === undefined) {
        ogp.ogSiteName = u.hostname;
      }
      if (ogp.ogType === undefined) {
        ogp.ogType = "website";
      }
      if (ogp.ogTitle === undefined) {
        ogp.ogTitle = `${u.hostname} -- ${description}`;
      }
      if (ogp.ogUrl === undefined) {
        ogp.ogUrl = `${u.origin}/dp/${asin}`;
      }
      if (ogp.ogDescription === undefined) {
        ogp.ogDescription = description;
      }
    }
  }

  return {
    ...ogp,
    $kind: "full",
    ogTitle: ogp.ogTitle ?? "",
    ogType: ogp.ogType ?? "",
    ogSiteName: ogp.ogSiteName ?? "",
    ogUrl: ogp.ogUrl ?? (options.url ?? ""),
    ogDescription: ogp.ogDescription ?? "",
    ogImage: ogp.ogImage ?? "",
  };
}
