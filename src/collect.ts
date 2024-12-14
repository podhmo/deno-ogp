import { raw } from "./types.ts";
import type { OGP, PartialOGP } from "./types.ts";

/** Collect OGP data from  html text */
export function collect<T extends Document = Document>(doc: T): OGP {
  const ogp: PartialOGP = { $kind: "partial", [raw]: {} };
  const props = ogp[raw];

  // @ts-expect-error webbrowsers have this method
  for (const meta of doc.querySelectorAll("meta[property^='og:']")) {
    const name = meta.getAttribute("property");
    switch (name) {
      case "og:title":
        ogp.ogTitle = meta.getAttribute("content")!;
        break;
      case "og:type":
        ogp.ogType = meta.getAttribute("content")!;
        break;
      case "og:url":
        ogp.ogUrl = meta.getAttribute("content")!;
        break;
      case "og:image":
        ogp.ogImage = meta.getAttribute("content")!;
        break;
      case "og:site_name":
        ogp.ogSiteName = meta.getAttribute("content")!;
        break;
      case "og:description":
        ogp.ogDescription = meta.getAttribute("content")!;
        break;
    }
    props[name] = meta.getAttribute("content")!;
  }
  if (
    ogp.ogTitle && ogp.ogType && ogp.ogUrl && ogp.ogImage &&
    ogp.ogSiteName && ogp.ogDescription
  ) {
    return {
      $kind: "full",
      ogTitle: ogp.ogTitle,
      ogType: ogp.ogType,
      ogImage: ogp.ogImage,
      ogUrl: ogp.ogUrl,
      ogDescription: ogp.ogDescription,
      ogSiteName: ogp.ogSiteName,
      [raw]: props,
    };
  }
  return ogp;
}
