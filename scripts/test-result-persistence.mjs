import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Run the actual browser persistence module with isolated browser storage.
const source = await readFile(new URL('../services/localAssessmentResult.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const api = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const storage = () => {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key), clear: () => values.clear() };
};
const scores = { A: 60, P: 40, R: 70, I: 30, L: 80, T: 20, C: 55, D: 45 };
const newer = { ...scores, A: 75, P: 25 };
const reset = () => { globalThis.localStorage = storage(); globalThis.sessionStorage = storage(); };
let passed = 0;
const check = (name, fn) => { reset(); fn(); passed++; console.log(`PASS ${name}`); };

check('completed result survives refresh and clearing the sync queue', () => {
  api.saveBrowserAssessment(scores, null);
  localStorage.setItem('face_pending_assessment_v3', JSON.stringify({ scores }));
  localStorage.removeItem('face_pending_assessment_v3');
  assert.deepEqual(api.getLatestBrowserAssessment().scores, scores);
});
check('login, claim, logout, refresh, and same-account login retain the result', () => {
  api.saveBrowserAssessment(scores, null);
  assert.deepEqual(api.scoresAfterAuthChange(scores, null, 'member-a'), scores);
  api.saveBrowserAssessment(scores, 'member-a');
  assert.deepEqual(api.scoresAfterAuthChange(scores, 'member-a', null), scores);
  const afterRefresh = api.getLatestBrowserAssessment().scores;
  assert.deepEqual(api.scoresAfterAuthChange(afterRefresh, null, 'member-a'), scores);
});
check('switching accounts cannot inherit the previous account result', () => {
  api.saveBrowserAssessment(scores, 'member-a');
  assert.equal(api.scoresAfterAuthChange(scores, 'member-a', 'member-b'), null);
  assert.equal(api.scoresAfterAuthChange(scores, null, 'member-b'), null);
});
check('each account restores its own cached result', () => {
  api.saveBrowserAssessment(scores, 'member-a');
  api.saveBrowserAssessment(newer, 'member-b');
  assert.deepEqual(api.scoresAfterAuthChange(newer, 'member-b', 'member-a'), scores);
});
check('new guest assessment may be claimed even after another user logged out', () => {
  api.saveBrowserAssessment(scores, 'member-a', '2026-01-01T00:00:00Z');
  api.saveBrowserAssessment(newer, null, '2026-02-01T00:00:00Z');
  assert.deepEqual(api.scoresAfterAuthChange(newer, null, 'member-b'), newer);
});
check('stale sync response cannot replace a more recent completed test', () => {
  api.saveBrowserAssessment(newer, 'member-a', '2026-02-01T00:00:00Z');
  api.saveBrowserAssessment(scores, 'member-a', '2026-01-01T00:00:00Z');
  assert.deepEqual(api.getLatestBrowserAssessment('member-a').scores, newer);
});
check('old pending data does not override a newer snapshot', () => {
  localStorage.setItem('face_pending_assessment_v3', JSON.stringify({ scores, savedAt: '2026-01-01T00:00:00Z' }));
  api.saveBrowserAssessment(newer, null, '2026-02-01T00:00:00Z');
  assert.deepEqual(api.getLatestBrowserAssessment().scores, newer);
});
check('pending results are isolated by owner', () => {
  localStorage.setItem('face_pending_assessment_v3', JSON.stringify({ scores }));
  api.markPendingAssessmentOwner('member-a');
  assert.equal(api.getBrowserPendingAssessment('member-b'), null);
  assert.deepEqual(api.getBrowserPendingAssessment('member-a').scores, scores);
});
check('session storage protects results if persistent storage is blocked', () => {
  globalThis.localStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.equal(api.saveBrowserAssessment(scores, 'member-a'), true);
  assert.deepEqual(api.getSavedBrowserAssessment('member-a').scores, scores);
});
check('disabled storage fails safely and reports an unsaved result', () => {
  globalThis.localStorage = globalThis.sessionStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.equal(api.saveBrowserAssessment(scores), false);
  assert.equal(api.getLatestBrowserAssessment(), null);
});
check('corrupted or invalid scores do not crash result restoration', () => {
  localStorage.setItem('face_completed_result_v1', '{broken');
  localStorage.setItem('face_pending_assessment_v3', '{broken');
  assert.equal(api.getLatestBrowserAssessment(), null);
  assert.equal(api.isFaceScores({ ...scores, A: NaN }), false);
  assert.equal(api.isFaceScores({ ...scores, A: 101 }), false);
  assert.equal(api.isFaceScores({ ...scores, A: -1 }), false);
  assert.equal(api.saveBrowserAssessment({ A: 20 }), false);
});
console.log(`${passed} result persistence regression checks passed.`);
