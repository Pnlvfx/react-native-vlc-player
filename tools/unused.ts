import { findUnusedExports } from '@goatjs/ts-unused-exports';

const unused = await findUnusedExports({ ignoreFiles: ['with-vlc-media-player.ts', 'vlc-player.tsx'] });

if (unused) {
  throw new Error('The following exports are unused, add them on the ignore or remove the exports to continue.');
}
