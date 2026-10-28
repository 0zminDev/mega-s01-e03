<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { reportFlow } from '#lib/kb/report-flow';

  let { ticket }: { ticket: number } = $props();
  const flow = $derived(reportFlow(reports as Report[], ticket, notes.oneDayMove));
</script>

<p>
  {flow.rawRows} export rows contain {flow.total} unique reports for #{ticket};
  {flow.duplicateRows} overlapping rows are not extra reports.
  {flow.backlog} reports arrived before the first merge date, {flow.firstMerge}.
</p>

<table>
  <thead><tr><th>month</th><th>received</th><th>merged</th></tr></thead>
  <tbody>
    {#each flow.months as row (row.month)}
      <tr><td>{row.month}</td><td>{row.received}</td><td>{row.merged}</td></tr>
    {/each}
  </tbody>
</table>

<h3>Unresolved symptom notes, not an extra count</h3>
<p>
  The desk marked {flow.flagged.length} reports as read as a one-day move.
  The current classifier includes them in its tenant-based groups.
  This is attribution by configuration, not a verified explanation of each report.
</p>
<table>
  <thead><tr><th>report</th><th>tenant / channel</th><th>original account</th></tr></thead>
  <tbody>
    {#each flow.flagged as report (report.id)}
      <tr>
        <td>{report.id}</td>
        <td>{report.tenant} / {report.channel}</td>
        <td>{report.body}</td>
      </tr>
    {/each}
  </tbody>
</table>
