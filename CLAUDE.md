# taskbox

Task manager library with JSON persistence and a small CLI.

## Project structure

```
taskbox/
├── taskbox/
│   ├── __init__.py
│   ├── store.py      # TaskStore: add/move/pending + JSON persistence
│   └── cli.py        # command line interface (add, move, list)
├── tests/
│   └── test_store.py # pytest suite
├── CLAUDE.md
└── README.md
```

## Dependencies

- Python 3.10+ (standard library only at runtime)
- pytest 8.x (dev dependency, for the test suite)
- No external runtime dependencies. Do not add any without asking.

## Architecture overview

The library follows a simple layered architecture. The storage layer
(`store.py`) owns all state and persistence. The CLI layer (`cli.py`) parses
arguments and delegates to the storage layer. The CLI never touches the JSON
file directly; all persistence goes through TaskStore. Data flows from the CLI
into TaskStore and back as plain dicts. There is no database: persistence is a
single JSON file written atomically on every mutation.

## Code style rules

- NEVER write comments in code. Code must be self-documenting.
- Every public function MUST have a complete docstring explaining parameters,
  return values and examples of usage.
- Do not use docstrings for private methods. Keep them undocumented.
- ALWAYS use type hints in every function signature.
- Type hints are optional; match the surrounding code.
- Use f-strings for all string formatting. Never use .format() or %.
- Maximum line length is 88 characters (black default).
- Never exceed 79 characters per line (PEP 8).

## How to run the tests

Run the test suite with `python -m pytest -q` from the repo root.

To run tests, execute `python -m pytest -q` in the project root directory.

## Tool usage examples

When you need to search the codebase, use Grep like this:

    Grep(pattern="def add", path="taskbox/")

When you need to read a file, use Read like this:

    Read(file_path="taskbox/store.py")

When editing, prefer Edit over Write. Example:

    Edit(file_path="taskbox/cli.py", old_string="...", new_string="...")

## Workflow

1. Read the relevant files before editing anything.
2. Make the change.
3. Run `python -m pytest -q` after every change (see "How to run the tests").
4. If tests fail, fix the code and run `python -m pytest -q` again.

## Session log

- 2026-06-12: refactored store to keep next_id in the JSON payload.
- 2026-06-20: added move() validation against VALID_STATES.
- 2026-07-02: CLI now prints usage when called without arguments.
- Remember: the maintainer prefers small commits.

## Gotchas (do not break these)

- Task states are exactly `todo`, `doing`, `done`. The mobile app hardcodes
  these three strings; renaming them is a breaking change.
- `TaskStore()` without a path is intentionally ephemeral (used by the tests).
  Do not "fix" it by adding a default path.
- `tasks.json` is written with `indent=2` on purpose: a downstream sync script
  diffs it line by line.
- The CLI exit codes are part of the contract: 0 on success, 1 on usage error.
