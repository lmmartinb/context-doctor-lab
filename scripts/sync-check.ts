/** Checks the on-disk shape of tasks.json against the downstream sync contract. */

import process from "node:process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { TaskStore } from "../src/store.ts";

const contract = JSON.parse(
  readFileSync(new URL("./sync-contract.json", import.meta.url), "utf8"),
);

function fail(reason: string, detail: string): never {
  console.error(`sync-check: FAIL — ${reason}`);
  console.error(detail);
  console.error(
    "\nThe downstream sync diffs tasks.json line by line. A shape change means\n" +
      "every task shows up as modified. Update the sync and bump\n" +
      "scripts/sync-contract.json in the same commit.",
  );
  process.exit(1);
}

function sample(): string {
  const path = join(mkdtempSync(join(tmpdir(), "sync-check-")), "tasks.json");
  const store = new TaskStore(path);
  store.add("first");
  const second = store.add("second");
  store.move(second, "doing");
  return readFileSync(path, "utf8");
}

const raw = sample();
const parsed = JSON.parse(raw);

if (raw.replace(/\n$/, "") !== JSON.stringify(parsed, null, contract.indent)) {
  fail(
    `tasks.json is no longer written with ${contract.indent}-space indent`,
    raw.split("\n").slice(0, 4).join("\n"),
  );
}

const rootKeys = Object.keys(parsed);
if (rootKeys.join() !== contract.rootKeys.join()) {
  fail(
    "the root keys of tasks.json changed",
    `expected [${contract.rootKeys}] but found [${rootKeys}]`,
  );
}

for (const task of parsed.tasks) {
  const keys = Object.keys(task);
  if (keys.join() !== contract.taskKeys.join()) {
    fail(
      "the task record shape changed",
      `expected [${contract.taskKeys}] but found [${keys}]`,
    );
  }
}

console.log(
  `sync-check: OK — ${parsed.tasks.length} tasks match the sync contract`,
);
