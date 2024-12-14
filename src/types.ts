// todo: metadata https://ogp.me/#metadata

export const raw = Symbol("raw");
export type OGP = FullOGP | PartialOGP;

export type FullOGP = {
  $kind: "full";
} & { [P in keyof Omit<PartialOGP, "$kind">]-?: PartialOGP[P] };

export type PartialOGP = {
  $kind: "partial";

  /** og:title - The title of your object as it should appear within the graph, e.g., "The Rock" */
  ogTitle?: string;
  /** og:type - The type of your object, e.g., "movie". Depending on the type you specify, other properties may also be required. */
  ogType?: string;
  /** og:url - The canonical URL of your object that will be used as its permanent ID in the graph, e.g., "http://www.imdb.com/title/tt0117500/" */
  ogUrl?: string;
  /** og:image - An image URL which should represent your object within the graph, e.g., "http://example.com/rock.jpg" */
  ogImage?: string;

  /** og:site_name - The name of the overall website, e.g., "IMDb" */
  ogSiteName?: string;
  /** og:description - A one to two sentence description of your object, e.g., "A group of U.S. Marines, under command of a renegade general, take over Alcatraz and */
  ogDescription?: string;

  [raw]: {
    [key: string]: string;
  };
};

/** Get raw properties, not typed */
export function rawProperties(ogp: OGP): Record<string, string> {
  return ogp[raw];
}
