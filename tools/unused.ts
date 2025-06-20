import { findUnusedExports } from '@goatjs/ts-unused-exports';
import { inspectLog } from '@goatjs/node/log';

const unused = await findUnusedExports({
  ignoreVars: ['VLCPlayer', 'VLCPlayerCommands', 'VLCPlayerProps'],
  ignoreFiles: ['with-vlc-media-player.ts'],
});

if (unused) {
  inspectLog(unused);
  throw new Error('The following exports are unused, add them on the ignore or remove the exports to continue.');
}
