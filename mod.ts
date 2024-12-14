/** Collect OGP data */

// todo: metadata https://ogp.me/#metadata

const raw = Symbol("raw");

/** Get raw properties, not typed */
export function rawProperties(ogp: OGP): Record<string, string> {
  return ogp[raw];
}

/** Collect OGP data from  html text */
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

/** Fetch and collect OGP data */
export async function fetchOGP<T extends Document = Document>(
  url: string,
  options: {
    getDocument: (html: string) => T;
    fetch?: typeof globalThis.fetch;
  } & Parameters<typeof globalThis.fetch>[1],
): Promise<OGP> {
  // todo: amazon support (generate from url)

  const fetch = options.fetch ?? globalThis.fetch;
  const response = await fetch(url, {
    signal: options.signal,
    method: "GET",
    headers: {
      "User-Agent": "Deno",
      ...options.headers,
    },
  });

  if (!response.ok) {
    return { "$kind": "broken", response, [raw]: {} };
  }

  const doc = options.getDocument(await response.text());
  return collectOGP(doc);
}

////////////////////////////////////////
// types
////////////////////////////////////////

export type OGP = FullOGP | PartialOGP | BrokenOGP;

export type BrokenOGP = {
  $kind: "broken";

  response: Response; // status != 200
  [raw]: {
    [key: string]: string;
  };
};

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
