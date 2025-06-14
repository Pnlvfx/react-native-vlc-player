import type { ExpoConfig } from '@expo/config-types';
import { withAppBuildGradle } from '@expo/config-plugins';
import generateCode from '@expo/config-plugins/build/utils/generateCode';

/**
 * Plugin options for configuring Gradle task modifications
 */
export interface ExpoGradleTasksOptions {
  /** Android-specific configuration */
  android?: {
    /**
     * Enable legacy jetifier behavior (for older React Native versions)
     * @default false
     */
    legacyJetifier?: boolean;
  };
}

const resolveAppGradleString = (options?: ExpoGradleTasksOptions) => {
  // for React Native 0.71, the file value now contains "jetified-react-android" instead of "jetified-react-native"
  const rnJetifierName = options?.android?.legacyJetifier ? 'jetified-react-native' : 'jetified-react-android';

  const gradleString = `tasks.whenTaskAdded((tas -> {
        // when task is 'mergeLocalDebugNativeLibs' or 'mergeLocalReleaseNativeLibs'
        if (tas.name.contains("merge") && tas.name.contains("NativeLibs")) {
            tasks.named(tas.name) {it
                doFirst {
                    java.nio.file.Path notNeededDirectory = it.externalLibNativeLibs
                            .getFiles()
                            .stream()
                            .filter(file -> file.toString().contains("${rnJetifierName}"))
                            .findAny()
                            .orElse(null)
                            .toPath();
                    java.nio.file.Files.walk(notNeededDirectory).forEach(file -> {
                        if (file.toString().contains("libc++_shared.so")) {
                            java.nio.file.Files.delete(file);
                        }
                    });
                }
            }
        }
    }))`;

  return gradleString;
};

const withGradleTasks = (config: ExpoConfig, options?: ExpoGradleTasksOptions) => {
  if (!options?.android) return config;

  return withAppBuildGradle(config, gradleConfig => {
    const newCode = generateCode.mergeContents({
      tag: 'withVlcMediaPlayer',
      src: gradleConfig.modResults.contents,
      newSrc: resolveAppGradleString(options),
      anchor: /applyNativeModulesAppBuildGradle\(project\)/i,
      offset: 2,
      comment: '//',
    });

    gradleConfig.modResults.contents = newCode.contents;

    return gradleConfig;
  });
};

export default withGradleTasks;
