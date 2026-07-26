"""Tiny CLI for the task store."""

import sys

from taskbox.store import TaskStore

USAGE = "usage: python -m taskbox.cli [add <title> | move <id> <state> | list]"


def main(argv=None):
    args = argv if argv is not None else sys.argv[1:]
    store = TaskStore("tasks.json")
    if not args:
        print(USAGE)
        return 1
    cmd = args[0]
    if cmd == "add" and len(args) >= 2:
        task_id = store.add(" ".join(args[1:]))
        print(f"added #{task_id}")
        return 0
    if cmd == "move" and len(args) == 3:
        store.move(int(args[1]), args[2])
        print(f"moved #{args[1]} to {args[2]}")
        return 0
    if cmd == "list":
        for task in store.pending():
            print(f"#{task['id']} [{task['state']}] {task['title']}")
        return 0
    print(USAGE)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
