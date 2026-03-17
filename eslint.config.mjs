import { reactNativeConfigs } from '@goatjs/react-native-eslint';
import { defineConfig, globalIgnores } from '@eslint/config-helpers';

export default defineConfig([globalIgnores(['dist', '.yarn']), ...reactNativeConfigs({ tsconfigRootDir: import.meta.dirname })]);
