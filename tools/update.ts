/* eslint-disable no-console */
import { updateGitDeps } from '@goatjs/dev/update';
import { execAsync } from '@goatjs/node/exec';

const packages = {
  'eslint-plugin-react-compiler': 'experimental',
};

const run = async () => {
  try {
    await execAsync('yarn up @goatjs/updater@github:Pnlvfx/goatjs#workspace=@goatjs/updater');
    await updateGitDeps(packages);
  } catch (err) {
    console.log(err);
  }
};

void run();
