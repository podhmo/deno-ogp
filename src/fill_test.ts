import { assertEquals } from "jsr:@std/assert";
import { type OGP, raw } from "./types.ts";

import { fill } from "./fill.ts";

function newEmptyOGP(): OGP {
  return {
    $kind: "partial",
    [raw]: {},
  };
}
function normalize(ogp: object): Record<string, unknown> {
  const ob: Record<string, unknown> & { $kind?: string; [raw]?: string } = {
    ...ogp,
    $kind: "",
    [raw]: "",
  };
  delete ob[raw];
  delete ob["$kind"];
  return ob;
}

Deno.test("fill,amazon.co.jp", () => {
  const want = {
    "$kind": "full",
    "ogDescription":
      "葬送のフリーレン（１） 少年サンデーコミックス 山田鐘人 ebook",
    "ogImage": "",
    "ogSiteName": "www.amazon.co.jp",
    "ogTitle":
      "www.amazon.co.jp -- 葬送のフリーレン（１） 少年サンデーコミックス 山田鐘人 ebook",
    "ogType": "website",
    "ogUrl": "https://www.amazon.co.jp/dp/B08FDH57JT",
  };

  const url =
    "https://www.amazon.co.jp/%E8%91%AC%E9%80%81%E3%81%AE%E3%83%95%E3%83%AA%E3%83%BC%E3%83%AC%E3%83%B3%EF%BC%88%EF%BC%91%EF%BC%89-%E5%B0%91%E5%B9%B4%E3%82%B5%E3%83%B3%E3%83%87%E3%83%BC%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9-%E5%B1%B1%E7%94%B0%E9%90%98%E4%BA%BA-ebook/dp/B08FDH57JT/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=O4VW8B3W16MU&dib=eyJ2IjoiMSJ9.b5i0zoeEOjT3a2F0NaWrem4A74CnZ7ati3aoVib8b_238YboXoZpdIZANCRgMr8QEP4PHZw0R6vpK2NWtwt3mg7s7DYRmM6V6zP66g-8YvkktvXzpKjmNzxORxzvxsq65ZDilz06lvVUML8a6FECLxAMt9IQlmKRZlcPyvZUGWx5W1rIUU3JEzVsWxXQUl5A-K-pqWe6O4Ax_Nlh1Bidy8lkT02MSoYdprrN23z2j5s.e93gu60Cn-iziC1B6ChK1EThyL2-akiQ6Z0DoO9NxMk&dib_tag=se&keywords=%E3%83%95%E3%83%AA%E3%83%BC%E3%83%AC%E3%83%B3&qid=1734206205&s=digital-text&sprefix=%E3%83%95%E3%83%AA%E3%83%BC%E3%83%AC%E3%83%B3%2Cdigital-text%2C187&sr=1-1";
  const got = fill(newEmptyOGP(), { url });

  assertEquals(normalize(got), normalize(want));
});
