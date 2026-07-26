# context-doctor-lab

Un laboratorio para ver `/doctor` de Claude Code haciendo su trabajo: recortar
un `CLAUDE.md` sobrecargado sin llevarse por delante lo que sí importa.

El proyecto (`taskbox`, un gestor de tareas mínimo en Python) es real y sus
tests pasan. El `CLAUDE.md` está inflado **a propósito** con los antipatrones
que Anthropic describe en
[The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models):

| Antipatrón plantado | Regla que viola |
|---|---|
| Árbol de directorios y lista de dependencias | Derivable del propio repo |
| Overview de arquitectura de un módulo de 40 líneas | Derivable del propio repo |
| "NEVER write comments" vs "every function MUST have a docstring" (y dos límites de línea en conflicto) | Reglas duras → criterio |
| Instrucción de tests repetida tres veces | Repetirte → decirlo una vez |
| Ejemplos de uso de Grep/Read/Edit | Ejemplos → diseño de interfaces |
| "Session log" mantenido a mano | Memoria manual → auto-memory |
| Skill `release-check` sobre-restringida | Skills como guías, no corsés |

Y entre medias, una sección de **gotchas legítimos** (estados hardcodeados por
la app móvil, el `indent=2` que necesita un script downstream...) que el doctor
debe conservar: es justo lo que un modelo no puede deducir mirando el código.

## Pruébalo

```bash
git clone https://github.com/lmmartinb/context-doctor-lab
cd context-doctor-lab
python -m pytest -q   # verde
claude                # y dentro: /doctor
```

Compara lo que recorta con la tabla de arriba, y mira qué pasa con los gotchas.

Este repo acompaña a un artículo y un vídeo (en español) sobre context
engineering en `lmmartinb.com`.
