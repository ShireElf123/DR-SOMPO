import { cn } from "../lib/utils";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

test("surfaces share four named depths, not per-component shadow recipes", () => {
  const css = readFileSync("app/globals.css", "utf8");
  const tokens = [...css.matchAll(/--shadow-([a-z-]+):/g)].map((match) => match[1]).sort();
  assert.deepEqual(tokens, ["float", "layer", "lift", "soft"]);
  for (const root of ["app", "components"]) {
    for (const name of readdirSync(root, { recursive: true, encoding: "utf8" }).filter((name) => name.endsWith(".tsx"))) {
      const source = readFileSync(`${root}/${name}`, "utf8");
      assert.ok(!/\bshadow-\[/.test(source), `${root}/${name}: one-off shadow`);
      assert.ok(!source.includes("transition-shadow"), `${root}/${name}: animating a paint property`);
    }
  }
});

test("hairline widths survive class merging with colours and respect width overrides", () => {
  for (const utility of ["border-hairline", "border-t-hairline", "border-b-hairline", "border-l-hairline", "border-y-hairline"]) {
    assert.equal(cn(utility, "border-charcoal/8"), `${utility} border-charcoal/8`);
    assert.equal(cn(utility, "border-charcoal/8", "border-forest/20"), `${utility} border-forest/20`);
    assert.equal(cn(utility, "border-charcoal/8", "border-0"), "border-charcoal/8 border-0");
  }
  assert.equal(cn("divide-y-hairline", "divide-charcoal/8"), "divide-y-hairline divide-charcoal/8");
  assert.equal(cn("divide-y-hairline", "divide-charcoal/8", "divide-y-0"), "divide-charcoal/8 divide-y-0");
});
