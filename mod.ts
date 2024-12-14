/** Collect OGP data */

// todo: metadata https://ogp.me/#metadata

/** Get raw properties, not typed */
export function rawProperties(ogp: OGP): Record<string, string> {
  return ogp[raw];
}

/** Collect OGP data from  html text */
export function collect<T extends Document = Document>(doc: T): OGP {
  const ogp: UnknownOGP = { [raw]: {} };
  const props = ogp[raw];

  // @ts-expect-error webbrowsers have this method
  for (const meta of doc.querySelectorAll("meta[property^='og:']")) {
    const name = meta.getAttribute("property");
    switch (name) {
      case "og:title":
        ogp.ogTitle = meta.getAttribute("content")!;
        break;
      case "og:image":
        ogp.ogImage = meta.getAttribute("content")!;
        break;
      case "og:url":
        ogp.ogUrl = meta.getAttribute("content")!;
        break;
      case "og:description":
        ogp.ogDescription = meta.getAttribute("content")!;
        break;
      case "og:site_name":
        ogp.ogSiteName = meta.getAttribute("content")!;
        break;
    }
    props[name] = meta.getAttribute("content")!;
  }
  if (ogp.ogImage !== undefined) {
    return { $kind: "full", ...ogp } as FullOGP;
  }
  return { $kind: "partial", ...ogp } as PartialOGP;
}

/** Fill missing properties with empty string */
export function fill(ogp: OGP): FullOGP {
  if (ogp.$kind === "full") {
    return ogp;
  }
  return {
    ...ogp,
    $kind: "full",
    ogTitle: ogp.ogTitle ?? "",
    ogSiteName: ogp.ogSiteName ?? "",
    ogUrl: ogp.ogUrl ?? "",
    ogDescription: ogp.ogDescription ?? "",
    ogImage: ogp.ogImage ?? "",
  };
}

// types

const raw = Symbol("raw");
export type OGP = FullOGP | PartialOGP;

export type FullOGP = {
  $kind: "full";

  ogImage: string;
} & { [P in keyof UnknownOGP]-?: UnknownOGP[P] };

export type PartialOGP = {
  $kind: "partial";
} & UnknownOGP;

type UnknownOGP = {
  ogTitle?: string;
  ogSiteName?: string;
  ogUrl?: string;
  ogDescription?: string;

  ogImage?: string;

  [raw]: {
    [key: string]: string;
  };
};
