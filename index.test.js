import test from 'node:test';
import assert from 'node:assert/strict';
import { clasificarEARS, lintSpec, extraerRequisitos } from './index.js';

test('clasifica los 5 patrones EARS en español', () => {
  assert.equal(clasificarEARS('El sistema deberá registrar cada venta.'), 'ubicuo');
  assert.equal(clasificarEARS('Cuando el cajero cierre la caja, el sistema deberá generar el arqueo.'), 'evento');
  assert.equal(clasificarEARS('Mientras el lote esté vencido, el sistema deberá bloquear su venta.'), 'estado');
  assert.equal(clasificarEARS('Si el stock es negativo, entonces el sistema deberá alertar al encargado.'), 'no-deseado');
  assert.equal(clasificarEARS('Donde exista balanza, el sistema deberá leer el peso.'), 'opcional');
});

test('clasifica patrones EARS en inglés', () => {
  assert.equal(clasificarEARS('When a user logs in, the system shall create a session.'), 'evento');
  assert.equal(clasificarEARS('If the token expired, then the system shall reject the call.'), 'no-deseado');
});

test('rechaza texto sin patrón EARS', () => {
  assert.equal(clasificarEARS('Debe ser rápido'), null);
});

test('extrae requisitos con distintos formatos de ID', () => {
  const md = '- **REQ-001**: El sistema deberá A.\nPOS-12. El sistema deberá B.\ntexto suelto';
  const r = extraerRequisitos(md);
  assert.deepEqual(r.map((x) => x.id), ['REQ-001', 'POS-12']);
  assert.equal(r[1].linea, 2);
});

test('detecta IDs duplicados, no-ears, compuestos y términos vagos', () => {
  const md = [
    'REQ-001: El sistema deberá registrar la venta.',
    'REQ-001: El sistema deberá ser rápido.',
    'REQ-002: Hacer reportes.',
    'REQ-003: El sistema deberá guardar y el sistema deberá imprimir.',
  ].join('\n');
  const { problemas, errores } = lintSpec(md);
  const reglas = problemas.map((p) => p.regla);
  assert.ok(reglas.includes('id-duplicado'));
  assert.ok(reglas.includes('no-ears'));
  assert.ok(reglas.includes('requisito-compuesto'));
  assert.ok(reglas.includes('termino-vago'));
  assert.equal(errores, 2);
});

test('spec sin requisitos es un error', () => {
  assert.equal(lintSpec('# Solo un título').errores, 1);
});

test('spec válida no produce problemas', () => {
  const r = lintSpec('REQ-001: Cuando se confirme el pedido, el sistema deberá descontar el stock por lote.');
  assert.equal(r.problemas.length, 0);
});
