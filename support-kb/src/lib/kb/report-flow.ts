import { uniqueById, type Report } from './causes.ts';

export function reportFlow(raw: Report[], ticket: number, flaggedIds: readonly string[]) {
  const rows = raw.filter((r) => r.mergedInto === ticket);
  const reports = uniqueById(rows);
  const mergeDays = reports.flatMap((r) => r.mergedAt ? [r.mergedAt.slice(0, 10)] : []).sort();
  const firstMerge = mergeDays[0] ?? null;
  const months = [...new Set(reports.flatMap((r) => [
    r.receivedAt.slice(0, 7),
    ...(r.mergedAt ? [r.mergedAt.slice(0, 7)] : []),
  ]))].sort();
  return {
    rawRows: rows.length,
    total: reports.length,
    duplicateRows: rows.length - reports.length,
    flagged: reports.filter((r) => flaggedIds.includes(r.id)),
    firstMerge,
    backlog: firstMerge ? reports.filter((r) => r.receivedAt.slice(0, 10) < firstMerge).length : 0,
    months: months.map((month) => ({
      month,
      received: reports.filter((r) => r.receivedAt.startsWith(month)).length,
      merged: reports.filter((r) => r.mergedAt?.startsWith(month)).length,
    })),
  };
}
