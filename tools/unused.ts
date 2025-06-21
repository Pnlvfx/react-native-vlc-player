import { findUnusedExports } from '@goatjs/ts-unused-exports';
import { inspectLog } from '@goatjs/node/log';

const unused = await findUnusedExports({ ignoreFiles: ['with-vlc-media-player.ts', 'vlc-player.tsx'] });

if (unused) {
  inspectLog(unused);
  throw new Error('The following exports are unused, add them on the ignore or remove the exports to continue.');
}
