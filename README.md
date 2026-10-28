# S01E03: what it shows

Evidence-based review of support ticket #4471 in the MEGA.dev course.

| Problem | Unique reports in the 2026-10-04 export | Ticket |
|---|---:|---|
| Shared parser assumes month first for day-first tenants | 379 | [Issue 1](https://github.com/0zminDev/mega-s01-e03/issues/1) |
| booking-v3 hint disagrees with tenant date parsing | 33 | [Issue 2](https://github.com/0zminDev/mega-s01-e03/issues/2) |

These are the existing classifier's attributions, not verified diagnoses of every report.
Five one-day/chronology reports are included in the parser group and remain explicitly
unresolved; they are not added a second time. There are 427 export rows but 412 unique IDs.

## Deliverables

- [Signed KB source](src/routes/kb/decisions/0002-triage-by-cause/+page.svx)
- [Rendered KB page](rendered/kb/decisions/0002-triage-by-cause/index.html)
- [Original incident, rendered](rendered/kb/incidents/4471/index.html)
- [Original triage rule and counterexamples, rendered](rendered/kb/triage/dedupe/index.html)

The new page includes the computed cause table, received-versus-merged timeline, an audit of
overlapping export rows, all five unresolved symptom accounts, and the subject-matching
counterexamples. Its rendered signature is **DR-KG5V-QX8H**, computed by the supplied
RenderStamp component, not typed into the page.

The accepted historical decision and all other original export files are unchanged.
Decision 0002 proposes a replacement; it does not pretend the desk has already adopted it.
The export is a snapshot, not a live connection. Refresh the data before operational closure.

## Subsequent engineering update

After accepting the tickets, the course page reported `#4471 · closed 05 oct`:
parser **FIXED** (`fix(dates): parse dd/mm for eu locales`); hint **WON'T FIX**
(`booking-v3 form retired`). Issue 1 is closed as completed; issue 2 is closed as not planned.
Retiring the affected form is not the same as repairing its hint. This is the desk's
disposition, not independent production verification of the five anomalous reports.

## Reproduce the rendered pages

Use Node.js 22.18+ with TypeScript stripping, or Node.js 24+.

```sh
npm ci
npm test
npm run build
```

The build compiles the original `.svx` pages and Svelte components through mdsvex and Vite,
then renders them with `svelte/server`. HTML includes component styles and computed values.
The committed HTML is a static snapshot; explorer controls are not hydrated.
Open the HTML directly, or serve `rendered` with a local static server to follow
the KB's absolute links.

Original export: `kb-export-267efc5e.zip`, downloaded from the signed-in challenge page.
