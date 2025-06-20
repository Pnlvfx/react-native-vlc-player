/* eslint-disable no-console */
import { updateLocalDeps } from '@goatjs/updater';
import { execAsync } from '@goatjs/node/exec';

const packages = {
  '@goatjs/ts-unused-exports': 'github:Pnlvfx/goatjs#workspace=@goatjs/ts-unused-exports',
  '@goatjs/node': 'github:Pnlvfx/goatjs#workspace=@goatjs/node',
  '@goatjs/rimraf': 'github:Pnlvfx/goatjs#workspace=@goatjs/rimraf',
  'eslint-plugin-react-compiler': 'experimental',
};

const run = async () => {
  try {
    await execAsync('yarn up @goatjs/updater@github:Pnlvfx/goatjs#workspace=@goatjs/updater');
    await updateLocalDeps(packages);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

void run();
