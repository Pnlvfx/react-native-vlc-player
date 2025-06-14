import type { ExpoConfig } from '@expo/config-types';
import { withDangerousMod } from '@expo/config-plugins';
import generateCode from '@expo/config-plugins/build/utils/generateCode';
import path from 'node:path';
import fs from 'node:fs';

export interface ExpoMobileVlcKitOptions {
  /** iOS-specific configuration */
  ios?: {
    /**
     * If `true`, it will include VLC Kit on PodFile (No need if you are running RN 0.61 and up)
     * @default false
     */
    includeVLCKit?: boolean;
  };
}

const withMobileVlcKit = (config: ExpoConfig, options?: ExpoMobileVlcKitOptions) => {
  // No need if you are running RN 0.61 and up
  if (!options?.ios?.includeVLCKit) {
    return config;
  }

  return withDangerousMod(config, [
    'ios',
    modConfig => {
      const filePath = path.join(modConfig.modRequest.platformProjectRoot, 'Podfile');

      const contents = fs.readFileSync(filePath, 'utf-8');

      const newCode = generateCode.mergeContents({
        tag: 'withVlcMediaPlayer',
        src: contents,
        newSrc: "  pod 'MobileVLCKit', '3.3.10'",
        anchor: /use_expo_modules!/i,
        offset: 3,
        comment: '  #',
      });

      fs.writeFileSync(filePath, newCode.contents);

      return modConfig;
    },
  ]);
};

export default withMobileVlcKit;
