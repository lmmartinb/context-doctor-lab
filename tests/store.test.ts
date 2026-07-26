import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { TaskStore } from "../src/store.ts";

test("add and list", () => {
  const store = new TaskStore();
  const id = store.add("write the article");
  assert.equal(store.pending()[0].id, id);
});

test("move changes state", () => {
  const store = new TaskStore();
  const id = store.add("record the video");
  store.move(id, "done");
  assert.deepEqual(store.pending(), []);
});

test("move rejects unknown state", () => {
  const store = new TaskStore();
  const id = store.add("edit the shorts");
  assert.throws(() => store.move(id, "finished" as never), /invalid state/);
});

test("persistence roundtrip", () => {
  const path = join(mkdtempSync(join(tmpdir(), "taskbox-")), "tasks.json");
  const store = new TaskStore(path);
  store.add("publish");
  const reloaded = new TaskStore(path);
  assert.equal(reloaded.pending()[0].title, "publish");
});
