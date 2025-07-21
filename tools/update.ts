import { updateGitDeps } from '@goatjs/dev/update';

const packages = {
  'eslint-plugin-react-compiler': 'experimental',
};

const run = async () => {
  await updateGitDeps(packages);
};

void run();
