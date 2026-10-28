import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { render } from 'svelte/server';

const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });

await mkdir('rendered', { recursive: true });
await writeFile('rendered/.nojekyll', '');
await writeFile('rendered/index.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Support KB</title><meta http-equiv="refresh" content="0;url=kb/"></head><body><a href="kb/">Open the knowledge base</a></body></html>
`);

for (const [source, page] of Object.entries(pages)) {
  const route = source.replace('/src/routes/', '').replace('/+page.svx', '');
  const output = join('rendered', route, 'index.html');
  const { head, body } = render(page.default);
  const root = relative(dirname(output), 'rendered').split(sep).join('/');
  const linkedBody = body.replace(/href="\/kb(?=[/"])/g, `href="${root}/kb`);
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head}</head><body>${linkedBody}</body></html>
`;
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
  console.log(output);
}
