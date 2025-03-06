import type { ExpoConfig } from '@expo/config-types';
import withGradleTasks, { type ExpoGradleTasksOptions } from './android/with-gradle-tasks';
import withMobileVlcKit, { type ExpoMobileVlcKitOptions } from './ios/with-mobile-vlc-kit';

const withVlcMediaPlayer = (config: ExpoConfig, options?: ExpoMobileVlcKitOptions & ExpoGradleTasksOptions) => {
  config = withGradleTasks(config, options);
  config = withMobileVlcKit(config, options);

  return config;
};

export default withVlcMediaPlayer;
