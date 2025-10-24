import type { StyleProp, ViewStyle } from 'react-native';
import type { VLCPlayerAndroidProps } from './android';
import type { VLCPlayerIosProps } from './ios';
import type { VideoAspectRatio } from './shared';

export type NativePlayerProps = (VLCPlayerIosProps | VLCPlayerAndroidProps) & {
  style: StyleProp<ViewStyle>;
  acceptInvalidCertificates: boolean;
};

export interface NativePlayerCommands {
  /** A value from 0 to 1 relative to the video duration. */
  seek: number;
  resume: boolean;
  autoAspectRatio: boolean;
  videoAspectRatio: VideoAspectRatio;
  paused: boolean;
}
