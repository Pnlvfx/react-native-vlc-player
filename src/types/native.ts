import type { StyleProp, ViewStyle } from 'react-native';
import type { VLCPlayerAndroidProps } from './android';
import type { VLCPlayerIosProps } from './ios';

export type NativePlayerProps = (VLCPlayerIosProps | VLCPlayerAndroidProps) & {
  style: StyleProp<ViewStyle>;
};

/**
 * Video aspect ratio type
 */
export type VideoAspectRatio = '16:9' | '1:1' | '4:3' | '3:2' | '21:9' | '9:16';

export interface NativePlayerCommands {
  /** A value from 0 to 1 relative to the video duration. */
  seek: number;
  resume: boolean;
  autoAspectRatio: boolean;
  videoAspectRatio: VideoAspectRatio;
  paused: boolean;
}
