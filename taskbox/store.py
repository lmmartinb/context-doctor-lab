"""In-memory task store with JSON persistence."""

import json
from pathlib import Path

VALID_STATES = ("todo", "doing", "done")


class TaskStore:
    """Holds tasks and persists them as a JSON file."""

    def __init__(self, path=None):
        self.path = Path(path) if path else None
        self.tasks = {}
        self.next_id = 1
        if self.path and self.path.exists():
            self._load()

    def add(self, title):
        task_id = self.next_id
        self.tasks[task_id] = {"id": task_id, "title": title, "state": "todo"}
        self.next_id += 1
        self._save()
        return task_id

    def move(self, task_id, state):
        if state not in VALID_STATES:
            raise ValueError(f"invalid state: {state}")
        if task_id not in self.tasks:
            raise KeyError(f"no such task: {task_id}")
        self.tasks[task_id]["state"] = state
        self._save()

    def pending(self):
        return [t for t in self.tasks.values() if t["state"] != "done"]

    def _load(self):
        data = json.loads(self.path.read_text())
        self.tasks = {t["id"]: t for t in data["tasks"]}
        self.next_id = data["next_id"]

    def _save(self):
        if not self.path:
            return
        payload = {"tasks": list(self.tasks.values()), "next_id": self.next_id}
        self.path.write_text(json.dumps(payload, indent=2))
