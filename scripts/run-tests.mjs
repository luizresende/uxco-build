#!/usr/bin/env node
/**
 * Roda a suíte sem depender do glob do test runner.
 * Node 20 não expande o glob que o Node 22 expande dentro de `node --test`.
 * A lista sai do disco. Zero dependência.
 */

import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dirs = ["tests/context-engine", "tests/critique-engine", "tests/review-workflow"];
const files = [];
for (const dir of dirs) {
  for (const name of readdirSync(join(root, dir))) {
    if (name.endsWith(".test.mjs")) files.push(join(dir, name));
  }
}
files.sort();
const run = spawnSync(process.execPath, ["--test", ...files], { cwd: root, stdio: "inherit" });
process.exit(run.status === null ? 1 : run.status);
