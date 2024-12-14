# deno-ogp

collect ogp

## install

```console
$ deno add jsr:@podhmo/ogp
```

## how to use

Please read examples.

- [./examples/collect-ogp.ts](https://github.com/podhmo/deno-ogp/blob/main/examples/collect-ogp.ts)

## run as cli

```console
$ deno run -A jsr:@podhmo/ogp/collect-ogp https://github.com/podhmo/deno-ogp
fetch https://github.com/podhmo/deno-ogp
done  https://github.com/podhmo/deno-ogp 784.999492ms
{
  "$kind": "full",
  "ogTitle": "GitHub - podhmo/deno-ogp: collect ogp",
  "ogType": "object",
  "ogImage": "https://opengraph.githubassets.com/00b1d7dac78187918688c04106e3dc14f4a5da5782353cc866fad031aba1e0fb/podhmo/deno-ogp",
  "ogUrl": "https://github.com/podhmo/deno-ogp",
  "ogDescription": "collect ogp. Contribute to podhmo/deno-ogp development by creating an account on GitHub.",
  "ogSiteName": "GitHub"
}
```