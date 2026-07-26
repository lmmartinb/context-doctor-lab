---
name: release-check
description: Verify the project is ready for a release.
---

# Release check

Follow these steps EXACTLY in this order. Do not skip any step. Do not add
steps. Do not reorder steps.

1. Run `python -m pytest -q`. If anything fails, STOP immediately.
2. Run `python -m taskbox.cli list` and verify it prints without errors.
3. Check that `tasks.json` is NOT tracked by git. If it is, STOP.
4. Re-read the whole CLAUDE.md file before continuing.
5. Verify every function has a docstring. If any is missing, STOP.
6. NEVER create a tag yourself. NEVER push. NEVER open a release.
7. Print exactly this line and nothing else: "release-check: OK".
