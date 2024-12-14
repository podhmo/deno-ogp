import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.48";
import { parseArgs } from "jsr:@podhmo/with-help@0.5.2";
import { withTrace } from "jsr:@podhmo/build-fetch@0.1.0";

import { collect as collectOGP, fill as fillOGP } from "../src/mod.ts";

const FETCH_TIMEOUT = 5000; // 5s

// $ deno run -A ./examples/collect-ogp.ts https://github.com/podhmo
// $ deno run -A ./examples/collect-ogp.ts https://example.com
// $ deno run -A ./examples/collect-ogp.ts "https://www.amazon.co.jp/%E8%91%AC%E9%80%81%E3%81%AE%E3%83%95%E3%83%AA%E3%83%BC%E3%83%AC%E3%83%B3%EF%BC%88%EF%BC%91%EF%BC%89-%E5%B0%91%E5%B9%B4%E3%82%B5%E3%83%B3%E3%83%87%E3%83%BC%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9-%E5%B1%B1%E7%94%B0%E9%90%98%E4%BA%BA-ebook/dp/B08FDH57JT/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=O4VW8B3W16MU&dib=eyJ2IjoiMSJ9.b5i0zoeEOjT3a2F0NaWrem4A74CnZ7ati3aoVib8b_238YboXoZpdIZANCRgMr8QEP4PHZw0R6vpK2NWtwt3mg7s7DYRmM6V6zP66g-8YvkktvXzpKjmNzxORxzvxsq65ZDilz06lvVUML8a6FECLxAMt9IQlmKRZlcPyvZUGWx5W1rIUU3JEzVsWxXQUl5A-K-pqWe6O4Ax_Nlh1Bidy8lkT02MSoYdprrN23z2j5s.e93gu60Cn-iziC1B6ChK1EThyL2-akiQ6Z0DoO9NxMk&dib_tag=se&keywords=%E3%83%95%E3%83%AA%E3%83%BC%E3%83%AC%E3%83%B3&qid=1734206205&s=digital-text&sprefix=%E3%83%95%E3%83%AA%E3%83%BC%E3%83%AC%E3%83%B3%2Cdigital-text%2C187&sr=1-1"

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
