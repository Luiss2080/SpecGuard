// Linter de requisitos EARS (Easy Approach to Requirements Syntax) en español e inglés.
// Pensado para flujos Spec-Driven Development: specs en Markdown con IDs tipo REQ-001.

const MODAL = '(?:shall|deber[aá]n?)(?![\\p{L}])';

const PATRONES = [
  { tipo: 'no-deseado', re: new RegExp(`^(?:if|si)\\b.+\\b(?:then|entonces)\\b.+\\b${MODAL}`, 'iu') },
  { tipo: 'evento', re: new RegExp(`^(?:when|cuando)\\b.+\\b${MODAL}`, 'iu') },
  { tipo: 'estado', re: new RegExp(`^(?:while|mientras)\\b.+\\b${MODAL}`, 'iu') },
  { tipo: 'opcional', re: new RegExp(`^(?:where|donde|en caso de que)\\b.+\\b${MODAL}`, 'iu') },
  { tipo: 'ubicuo', re: new RegExp(`^(?:the|el|la|los|las)\\b.+\\b${MODAL}`, 'iu') },
];

const VAGOS = [
  'rápido', 'rapido', 'fácil', 'facil', 'amigable', 'adecuado', 'apropiado', 'óptimo', 'optimo',
  'etc', 'y/o', 'flexible', 'robusto', 'intuitivo', 'moderno',
  'fast', 'easy', 'user-friendly', 'appropriate', 'adequate', 'optimal', 'flexible', 'robust', 'intuitive',
];

const LINEA_REQ = /^\s*(?:[-*+]\s*)?(?:\*\*)?([A-Z][A-Z0-9]*-\d+)(?:\*\*)?\s*[:.\-–—]\s*(.+?)\s*$/;

function limpiar(texto) {
  return texto.replace(/\*\*|__|`/g, '').trim();
}

export function clasificarEARS(texto) {
  const t = limpiar(texto);
  for (const p of PATRONES) if (p.re.test(t)) return p.tipo;
  return null;
}

export function extraerRequisitos(markdown) {
  const reqs = [];
  markdown.split(/\r?\n/).forEach((linea, i) => {
    const m = LINEA_REQ.exec(linea);
    if (m) reqs.push({ id: m[1], linea: i + 1, texto: limpiar(m[2]) });
  });
  return reqs;
}

export function lintSpec(markdown, { archivo = '<memoria>' } = {}) {
  const requisitos = extraerRequisitos(markdown);
  const problemas = [];
  const vistos = new Map();
  const add = (regla, severidad, r, mensaje) =>
    problemas.push({ archivo, regla, severidad, id: r?.id ?? null, linea: r?.linea ?? 1, mensaje });

  if (requisitos.length === 0) {
    add('sin-requisitos', 'error', null, 'No se encontraron requisitos con ID (ej. "REQ-001: El sistema deberá ...").');
  }

  for (const r of requisitos) {
    r.tipo = clasificarEARS(r.texto);

    if (vistos.has(r.id)) {
      add('id-duplicado', 'error', r, `El ID ${r.id} ya se usó en la línea ${vistos.get(r.id)}.`);
    } else vistos.set(r.id, r.linea);

    if (!r.tipo) {
      add('no-ears', 'error', r, `${r.id} no sigue ningún patrón EARS (falta "deberá/shall" o el disparador Cuando/Mientras/Si…entonces/Donde).`);
    }

    const modales = r.texto.match(new RegExp(`\\b${MODAL}`, 'giu')) ?? [];
    if (modales.length > 1) {
      add('requisito-compuesto', 'warning', r, `${r.id} tiene ${modales.length} "deberá/shall": divídelo en requisitos atómicos.`);
    }

    const lower = r.texto.toLowerCase();
    const vago = VAGOS.find((v) => new RegExp(`(^|[^\\p{L}])${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'u').test(lower));
    if (vago) add('termino-vago', 'warning', r, `${r.id} usa un término ambiguo ("${vago}"): define un criterio medible.`);
  }

  const errores = problemas.filter((p) => p.severidad === 'error').length;
  return { archivo, requisitos, problemas, errores, advertencias: problemas.length - errores };
}
