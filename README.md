<div align="center">
  <img src="docs/assets/logo.svg" width="96" alt="Logo de SpecGuard" />
  <h1>🛡️ SpecGuard</h1>
  <p><b>Linter de requisitos EARS (español/inglés) para specs en Markdown: IDs duplicados, requisitos sin patrón EARS, compuestos y términos vagos.</b></p>
  <img src="https://img.shields.io/badge/versi%C3%B3n-1.0.0-blue?style=for-the-badge" alt="Versión 1.0.0" />
  <img src="https://img.shields.io/badge/node-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js 18+" />
  <img src="https://img.shields.io/badge/interfaz-CLI-informational?style=for-the-badge&logo=gnubash&logoColor=white" alt="CLI" />
  <img src="https://img.shields.io/badge/tests-node%3Atest-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Tests con node:test" />
  <img src="https://img.shields.io/badge/paquete-GitHub%20Packages-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Packages" />
  <img src="https://img.shields.io/badge/licencia-MIT-yellow?style=for-the-badge" alt="Licencia MIT" />
  <img src="https://img.shields.io/github/last-commit/Luiss2080/SpecGuard" alt="Último commit" />
  <img src="https://img.shields.io/badge/PRs-bienvenidos-brightgreen.svg" alt="PRs bienvenidos" />
  <p>
    <a href="#-inicio-rápido">Inicio rápido</a> ·
    <a href="#-características">Características</a> ·
    <a href="#-arquitectura">Arquitectura</a> ·
    <a href="#-pruebas">Pruebas</a> ·
    <a href="#-contribuir">Contribuir</a>
  </p>
</div>

Linter de requisitos **EARS** (*Easy Approach to Requirements Syntax*) para specs en Markdown, en español e inglés. Nació del flujo Spec-Driven Development (SDD) con decenas de specs por proyecto: detecta los errores que se cuelan al escribirlas a mano. Se usa como CLI o como librería.

## 🎬 Vista rápida

```bash
npx speclint docs/specs          # carpeta (recursivo) o archivos .md
npx speclint specs --json        # salida para CI
npx speclint specs --strict      # las advertencias también fallan
```

Formato de requisito reconocido: `REQ-001: El sistema deberá…`, `- **POS-12**: Cuando…`.

```js
import { lintSpec } from '@luiss2080/specguard';

const { problemas, errores } = lintSpec(markdown, { archivo: 'spec.md' });
```

## ✨ Características

| Regla | Severidad | Qué detecta |
|---|---|---|
| `no-ears` | error | Requisito sin "deberá/shall" o sin un patrón EARS válido |
| `id-duplicado` | error | Dos requisitos con el mismo ID |
| `sin-requisitos` | error | Archivo sin ningún requisito con ID |
| `requisito-compuesto` | warning | Más de un "deberá/shall" en una sola línea |
| `termino-vago` | warning | "rápido", "fácil", "adecuado", "etc.", "fast", "user-friendly"… |

Patrones EARS reconocidos: ubicuo (*El sistema deberá…*), evento (*Cuando… el sistema deberá…*), estado (*Mientras…*), no deseado (*Si… entonces el sistema deberá…*) y opcional (*Donde…*).

Código de salida: `0` sin errores, `1` con errores (o advertencias con `--strict`), `2` sin argumentos.

## 🏗️ Arquitectura

| Archivo | Propósito |
|---|---|
| `index.js` | Módulo ES con `lintSpec` y las reglas. |
| `speclint.js` | Ejecutable de línea de comandos (`bin: speclint`). |
| `index.test.js` | Pruebas con `node:test`. |
| `package.json` | Metadatos del paquete y publicación en GitHub Packages. |

## 🚀 Inicio rápido

| Requisito | Versión |
|---|---|
| Node.js | 18+ |

Se publica en GitHub Packages. Agrega a tu `.npmrc`:

```
@luiss2080:registry=https://npm.pkg.github.com
```

Luego instala el paquete:

```bash
npm install @luiss2080/specguard
```

> GitHub Packages pide autenticarse (token con `read:packages`) incluso para paquetes públicos.

## 🧪 Pruebas

```bash
npm test # usa node:test, sin dependencias
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Lee la [guía de contribución](CONTRIBUTING.md) y el [código de conducta](CODE_OF_CONDUCT.md) antes de abrir un PR. Para bugs o ideas abre un issue; los problemas de seguridad se reportan según la [política de seguridad](SECURITY.md). ¿Dudas? Mira [SUPPORT.md](SUPPORT.md). Los cambios por versión están en el [CHANGELOG](CHANGELOG.md).

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver [LICENSE](LICENSE).

---

<div align="center">
  <sub>Hecho por <a href="https://github.com/Luiss2080">Luiss2080</a> · linter de requisitos EARS para Spec-Driven Development</sub>
</div>
