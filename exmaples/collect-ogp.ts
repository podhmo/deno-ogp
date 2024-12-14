import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.48";
import { parseArgs } from "jsr:@podhmo/with-help@0.5.2";
import { withTrace } from "jsr:@podhmo/build-fetch@0.1.0";

import { collect as collectOGP, fill as fillOGP } from "../mod.ts";

const FETCH_TIMEOUT = 5000; // 5s

async function main() {
  const options = parseArgs(Deno.args, {
    name: "ogp",
    string: ["save"],
    boolean: ["debug"],
    envvar: {
      debug: "DEBUG",
    },
  });

  const fetch = options.debug ? withTrace(globalThis.fetch) : globalThis.fetch;

  for (const url of options._) {
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), FETCH_TIMEOUT);

    try {
      console.debug(`%cfetch %c${url}`, "color: blue", "color: white");
      const startTime = performance.now();
      const response = await fetch(url, {
        signal: ac.signal,
        method: "GET",
        headers: {
          "User-Agent": "Deno",
        },
      });
      const endTime = performance.now();
      console.debug(
        `%cdone  %c${url} ${endTime - startTime}ms`,
        "color: green",
        "color: white",
      );

      const html = await response.text();

      if (options.save) {
        await Deno.writeTextFile(options.save, html);
        console.debug("saved to %s", options.save);
      }

      // collect OGP data
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const ogp = collectOGP(doc as unknown as Document); // hack: treat as lib.dom.d.ts Document

      // output
      // console.log("%o", ogp);
      // console.log(JSON.stringify(ogp, null, 2));
      console.log(JSON.stringify(fillOGP(ogp, { url }), null, 2));
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
