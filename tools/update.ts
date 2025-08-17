import { updateUnversionedDeps } from '@goatjs/dbz/update';

const run = async () => {
  await updateUnversionedDeps({
    'eslint-plugin-react-compiler': 'experimental',
  });
};

void run();
