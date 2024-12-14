export const raw = Symbol("raw");
export type OGP = FullOGP | PartialOGP;

export type FullOGP = {
  $kind: "full";
} & { [P in keyof Omit<PartialOGP, "$kind">]-?: PartialOGP[P] };

export type PartialOGP = {
  $kind: "partial";
  ogTitle?: string;
  ogSiteName?: string;
  ogUrl?: string;
  ogDescription?: string;

  ogImage?: string;

  [raw]: {
    [key: string]: string;
  };
};

/** Get raw properties, not typed */
export function rawProperties(ogp: OGP): Record<string, string> {
  return ogp[raw];
}
