import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.48";
import { parseArgs } from "jsr:@podhmo/with-help@0.5.2";

import { fetchOGP } from "../mod.ts";

const FETCH_TIMEOUT = 5000; // 5s

const getDocument = (html: string) =>
  new DOMParser().parseFromString(
    html,
    "text/html",
  ) as unknown as Document; // hack: treat as lib.dom.d.ts Document

async function main() {
  const options = parseArgs(Deno.args, {
    name: "ogp",
    string: ["save"],
    boolean: ["debug"],
    envvar: {
      debug: "DEBUG",
    },
  });

  for (const url of options._) {
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), FETCH_TIMEOUT);

    try {
      console.debug(`%cfetch %c${url}`, "color: blue", "color: white");
      const startTime = performance.now();

      // collect ogp
      const ogp = await fetchOGP(url, {
        getDocument,
        signal: ac.signal,
      });

      switch (ogp.$kind) {
        case "partial":
          console.warn(`%cpartial %c${url}`, "color: orange", "color: white");
          /* falls through */
        case "full": {
          const endTime = performance.now();
          console.debug(
            `%cdone  %c${url} ${endTime - startTime}ms`,
            "color: green",
            "color: white",
          );

          // output
          console.log(JSON.stringify(ogp, null, 2)); // console.log("%o", ogp);
          break;
        }
        case "broken": {
          const res = ogp.response;
          console.error(
            `!! %c${url} %c${res.status} %c${res.statusText}`,
            "color: red",
            "color: white",
            "color: red",
          );
          console.error(await res.text());
          break;
        }
        default: {
          const _: never = ogp;
          throw new Error("unreachable");
        }
      }
    } catch (e) {
      console.error("!! %o", e);
    } finally {
      clearTimeout(timeout);
    }
  }
}

if (import.meta.main) {
  await main();
}
