import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { render } from 'svelte/server';

const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });

for (const [source, page] of Object.entries(pages)) {
  const route = source.replace('/src/routes/', '').replace('/+page.svx', '');
  const output = join('rendered', route, 'index.html');
  const { head, body } = render(page.default);
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head}</head><body>${body}</body></html>
`;
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
  console.log(output);
}
