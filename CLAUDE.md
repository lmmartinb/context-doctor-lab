# taskbox

Task manager library (TypeScript) with JSON persistence and a small CLI.

## Project structure

```
context-doctor-lab/
├── src/
│   ├── store.ts      # TaskStore: add/move/pending + JSON persistence
│   └── cli.ts        # command line interface (add, move, list)
├── tests/
│   └── store.test.ts # node:test suite
├── scripts/
│   ├── sync-check.ts     # downstream sync contract check
│   └── sync-contract.json
├── package.json
├── tsconfig.json
├── CLAUDE.md
└── README.md
```

## Dependencies

- Node.js 24+ (runs TypeScript natively, no build step)
- @types/node (dev dependency, editor types only)
- No runtime dependencies. Do not add any without asking.

## Architecture overview

The library follows a simple layered architecture. The storage layer
(`store.ts`) owns all state and persistence. The CLI layer (`cli.ts`) parses
arguments and delegates to the storage layer. The CLI never touches the JSON
file directly; all persistence goes through TaskStore. Data flows from the CLI
into TaskStore and back as plain objects. There is no database: persistence is
a single JSON file written on every mutation.

## Code style rules

- NEVER write comments in code. Code must be self-documenting.
- Every exported function and class MUST have a complete JSDoc block with
  @param and @returns tags and at least one @example.
- ALWAYS annotate every parameter and return type explicitly.
- Prefer type inference; explicit annotations are optional noise.
- Use template literals for all string building. Never concatenate with +.
- Maximum line length is 100 characters (prettier default in this repo).
- Never exceed 80 characters per line.

## How to run the tests

Run the test suite with `npm test` from the repo root.

To run tests, execute `npm test` in the project root directory.

## Tool usage examples

When you need to search the codebase, use Grep like this:

    Grep(pattern="add\\(", path="src/")

When you need to read a file, use Read like this:

    Read(file_path="src/store.ts")

When editing, prefer Edit over Write. Example:

    Edit(file_path="src/cli.ts", old_string="...", new_string="...")

## Workflow

1. Read the relevant files before editing anything.
2. Make the change.
3. Run `npm test` after every change (see "How to run the tests").
4. If tests fail, fix the code and run `npm test` again.

## Session log

- 2026-06-12: refactored store to keep nextId in the JSON payload.
- 2026-06-20: added move() validation against VALID_STATES.
- 2026-07-02: CLI now prints usage when called without arguments.
- Remember: the maintainer prefers small commits.

## Gotchas (do not break these)

- Task states are exactly `todo`, `doing`, `done`. The mobile app hardcodes
  these three strings; renaming them is a breaking change.
- `new TaskStore()` without a path is intentionally ephemeral (used by the
  tests). Do not "fix" it by adding a default path.
- `tasks.json` is written with 2-space indent on purpose: a downstream sync
  script diffs it line by line.
- The CLI exit codes are part of the contract: 0 on success, 1 on usage error.
- No TypeScript parameter properties (`constructor(private x)`): Node's
  strip-only mode does not support them and the code must run without a build.
