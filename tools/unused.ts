import { findUnusedExports } from '@goatjs/ts-unused-exports';
import { prettier } from '@goatjs/node/prettier';

const unused = await findUnusedExports({ ignoreFiles: ['with-vlc-media-player.ts', 'vlc-player.tsx', 'vita.config.ts'] });

if (unused) {
  throw new Error(
    `The following exports are unused, add them on the ignore or remove the exports to continue.\n${await prettier.format(JSON.stringify(unused), { parser: 'json' })}`,
  );
}
