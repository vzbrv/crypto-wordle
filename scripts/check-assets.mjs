import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const html = await readFile("index.html", "utf8");
const references = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map(
  ([, value]) => value
);

for (const reference of references) {
  if (/^(?:https?:|mailto:|#|data:)/.test(reference)) {
    if (/^https?:/.test(reference)) new URL(reference);
    continue;
  }

  const localPath = reference.split(/[?#]/, 1)[0];
  const absolutePath = path.resolve(root, localPath);
  if (!absolutePath.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Asset escapes repository root: ${reference}`);
  }
  await access(absolutePath);
}

console.log(`Validated ${references.length} links and assets.`);
