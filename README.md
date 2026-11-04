# @luiss2080/spec-lint

Linter de requisitos **EARS** (Easy Approach to Requirements Syntax) para specs en Markdown, en **español e inglés**. Nació del flujo Spec-Driven Development (SDD) con decenas de specs por proyecto: detecta los errores que se cuelan al escribirlas a mano.

## Qué revisa

| Regla | Severidad | Qué detecta |
|---|---|---|
| `no-ears` | error | Requisito sin "deberá/shall" o sin un patrón EARS válido |
| `id-duplicado` | error | Dos requisitos con el mismo ID |
| `sin-requisitos` | error | Archivo sin ningún requisito con ID |
| `requisito-compuesto` | warning | Más de un "deberá/shall" en una sola línea |
| `termino-vago` | warning | "rápido", "fácil", "adecuado", "etc.", "fast", "user-friendly"… |

Patrones EARS reconocidos: **ubicuo** (`El sistema deberá…`), **evento** (`Cuando… el sistema deberá…`), **estado** (`Mientras…`), **no deseado** (`Si… entonces el sistema deberá…`) y **opcional** (`Donde…`).

## Uso

```bash
npx speclint docs/specs          # carpeta (recursivo) o archivos .md
npx speclint specs --json        # salida para CI
npx speclint specs --strict      # las advertencias también fallan
```

Formato de requisito reconocido: `REQ-001: El sistema deberá…`, `- **POS-12**: Cuando…`.

```js
import { lintSpec } from '@luiss2080/spec-lint';
const { problemas, errores } = lintSpec(markdown, { archivo: 'spec.md' });
```

Código de salida: `0` sin errores, `1` con errores (o advertencias con `--strict`), `2` sin argumentos.

## Instalación

Se publica en GitHub Packages. Agrega a tu `.npmrc`:

```
@luiss2080:registry=https://npm.pkg.github.com
```

```bash
npm install @luiss2080/spec-lint
```

> GitHub Packages pide autenticarse (token con `read:packages`) incluso para paquetes públicos.

## Desarrollo

```bash
npm test   # usa node:test, sin dependencias
```

Licencia MIT.
