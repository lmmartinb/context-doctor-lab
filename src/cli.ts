/** Tiny CLI for the task store. */

import process from "node:process";

import { TaskStore, type TaskState } from "./store.ts";

const USAGE = "usage: node src/cli.ts [add <title> | move <id> <state> | list]";

export function main(args: string[]): number {
  const store = new TaskStore("tasks.json");
  const [cmd, ...rest] = args;
  if (cmd === "add" && rest.length >= 1) {
    const id = store.add(rest.join(" "));
    console.log(`added #${id}`);
    return 0;
  }
  if (cmd === "move" && rest.length === 2) {
    store.move(Number(rest[0]), rest[1] as TaskState);
    console.log(`moved #${rest[0]} to ${rest[1]}`);
    return 0;
  }
  if (cmd === "list") {
    for (const task of store.pending()) {
      console.log(`#${task.id} [${task.state}] ${task.title}`);
    }
    return 0;
  }
  console.log(USAGE);
  return 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(main(process.argv.slice(2)));
}
