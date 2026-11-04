#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { lintSpec } from './index.js';

const args = process.argv.slice(2);
const json = args.includes('--json');
const estricto = args.includes('--strict');
const rutas = args.filter((a) => !a.startsWith('--'));

if (rutas.length === 0 || args.includes('--help')) {
  console.log('Uso: speclint <archivo|carpeta>... [--json] [--strict]\n  --strict  las advertencias también hacen fallar (exit 1)');
  process.exit(rutas.length === 0 && !args.includes('--help') ? 2 : 0);
}

function* archivosMd(ruta) {
  const st = statSync(ruta);
  if (st.isDirectory()) {
    for (const e of readdirSync(ruta)) {
      if (e === 'node_modules' || e.startsWith('.')) continue;
      yield* archivosMd(join(ruta, e));
    }
  } else if (extname(ruta).toLowerCase() === '.md') yield ruta;
}

const resultados = [];
for (const r of rutas) for (const f of archivosMd(r)) resultados.push(lintSpec(readFileSync(f, 'utf8'), { archivo: f }));

// Solo reportamos archivos que contengan al menos un requisito, salvo que se pasen explícitamente.
const relevantes = resultados.filter((r) => r.requisitos.length > 0 || rutas.includes(r.archivo));
const errores = relevantes.reduce((a, r) => a + r.errores, 0);
const advertencias = relevantes.reduce((a, r) => a + r.advertencias, 0);

if (json) {
  console.log(JSON.stringify({ errores, advertencias, archivos: relevantes }, null, 2));
} else {
  for (const r of relevantes) {
    for (const p of r.problemas) console.log(`${p.archivo}:${p.linea}  ${p.severidad.padEnd(7)} ${p.regla}  ${p.mensaje}`);
  }
  const total = relevantes.reduce((a, r) => a + r.requisitos.length, 0);
  console.log(`\n${total} requisitos en ${relevantes.length} archivo(s): ${errores} error(es), ${advertencias} advertencia(s).`);
}
process.exit(errores > 0 || (estricto && advertencias > 0) ? 1 : 0);
