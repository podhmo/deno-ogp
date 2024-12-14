// todo: metadata https://ogp.me/#metadata

// Helper function to fetch OGP data
export function collectOGP<T extends Document = Document>(doc: T): OGP {
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

// types

const raw = Symbol("raw");
export type OGP = FullOGP | PartialOGP;

export type FullOGP = {
  $kind: "full";

  ogImage: string;
} & { [P in keyof UnknownOGP]-?: UnknownOGP[P] };

export type PartialOGP = {
  $kind: "partial";
} & { [P in keyof Omit<UnknownOGP, "ogImage">]-?: UnknownOGP[P] };

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
