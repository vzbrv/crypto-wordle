import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist");

for (const path of ["index.html", "game-logic.js", ".nojekyll", "assets"]) {
  await cp(path, `dist/${path}`, { recursive: true });
}
