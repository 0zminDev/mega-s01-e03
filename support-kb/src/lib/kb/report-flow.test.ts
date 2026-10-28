import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reportFlow } from './report-flow.ts';
import type { Report } from './causes.ts';

function report(id: string, receivedAt: string, mergedAt: string | null, mergedInto = 4471): Report {
  return {
    id, receivedAt, mergedAt, mergedInto,
    tenant: 'example',
    channel: 'email',
    subject: 'Wrong date',
    body: 'Original report',
    meta: { browserLocale: 'en-GB', intakeTag: 'parser' },
  };
}

test('overlapping exports and flagged notes do not inflate monthly counts', () => {
  const old = report('a', '2026-04-02T10:00:00Z', '2026-07-02T10:00:00Z');
  const recent = report('b', '2026-07-03T10:00:00Z', '2026-07-03T12:00:00Z');
  const other = report('c', '2026-04-01T10:00:00Z', '2026-05-01T10:00:00Z', 9999);
  const flow = reportFlow([old, recent, old, other], 4471, ['a', 'c']);
  assert.equal(flow.rawRows, 3);
  assert.equal(flow.total, 2);
  assert.equal(flow.duplicateRows, 1);
  assert.equal(flow.backlog, 1);
  assert.equal(flow.firstMerge, '2026-07-02');
  assert.deepEqual(flow.flagged.map((r) => r.id), ['a']);
  assert.deepEqual(flow.months, [
    { month: '2026-04', received: 1, merged: 0 },
    { month: '2026-07', received: 1, merged: 2 },
  ]);
});

test('missing merge timestamps do not invent merges or a backlog date', () => {
  const flow = reportFlow([report('a', '2026-04-02T10:00:00Z', null)], 4471, []);
  assert.equal(flow.firstMerge, null);
  assert.equal(flow.backlog, 0);
  assert.deepEqual(flow.months, [{ month: '2026-04', received: 1, merged: 0 }]);
  assert.deepEqual(reportFlow([], 4471, []).months, []);
});
