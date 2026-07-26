/** In-memory task store with JSON persistence. */

import { existsSync, readFileSync, writeFileSync } from "node:fs";

export const VALID_STATES = ["todo", "doing", "done"] as const;

export type TaskState = (typeof VALID_STATES)[number];

export interface Task {
  id: number;
  title: string;
  state: TaskState;
}

/** Holds tasks and persists them as a JSON file. */
export class TaskStore {
  private tasks = new Map<number, Task>();
  private nextId = 1;
  private path?: string;

  constructor(path?: string) {
    this.path = path;
    if (this.path && existsSync(this.path)) {
      this.load();
    }
  }

  add(title: string): number {
    const id = this.nextId;
    this.tasks.set(id, { id, title, state: "todo" });
    this.nextId += 1;
    this.save();
    return id;
  }

  move(id: number, state: TaskState): void {
    if (!VALID_STATES.includes(state)) {
      throw new Error(`invalid state: ${state}`);
    }
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`no such task: ${id}`);
    }
    task.state = state;
    this.save();
  }

  pending(): Task[] {
    return [...this.tasks.values()].filter((t) => t.state !== "done");
  }

  private load(): void {
    const data = JSON.parse(readFileSync(this.path!, "utf8"));
    this.tasks = new Map(data.tasks.map((t: Task) => [t.id, t]));
    this.nextId = data.nextId;
  }

  private save(): void {
    if (!this.path) return;
    const payload = { tasks: [...this.tasks.values()], nextId: this.nextId };
    writeFileSync(this.path, JSON.stringify(payload, null, 2));
  }
}
