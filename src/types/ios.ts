import type { NativeSyntheticEvent } from 'react-native';
import type { SharedPlayerProps, SimpleCallbackEventProps, VideoInfo, VideoSnapshotEvent } from './shared';

export interface VLCPlayerIosProps extends SharedPlayerProps, VLCPlayerIosEvents {
  source: VLCPlayerIosSource;
  autoplay: boolean;
}

interface VLCPlayerIosSource {
  /**
   * Media source URI to render
   */
  uri: string;
  /**
   * VLC Player initialization type
   *
   *  - Default configuration: `1`
   *  - Custom configuration: `2`
   *
   * See `initOptions` for more information
   *
   * @default 1
   */
  initType?: 1 | 2;
  /**
   * https://wiki.videolan.org/VLC_command-line_help/
   *
   * VLC Player initialization options
   *
   * `["--network-caching=50", "--rtsp-tcp"]`
   *
   * If `repeat` is set on props this will default to ["--repeat"] unless
   * another `--repeat` or `--input-repeat` flag is passed.
   *
   * @default []
   */
  initOptions?: string[];
  headers: Record<string, string>;
}

interface VLCPlayerIosEvents {
  onVideoProgress: (event: NativeSyntheticEvent<IosVideoProgressEvent>) => void;
  onVideoPaused: (event: NativeSyntheticEvent<SimpleCallbackEventProps>) => void;
  onVideoStopped: (event: NativeSyntheticEvent<SimpleCallbackEventProps>) => void;
  onVideoBuffering: (event: NativeSyntheticEvent<SimpleCallbackEventProps>) => void;
  onVideoPlaying: (event: NativeSyntheticEvent<IosVideoPlayingEvent>) => void;
  onVideoEnded: (event: NativeSyntheticEvent<IosVideoEndedEvent>) => void;
  onVideoError: (event: NativeSyntheticEvent<SimpleCallbackEventProps>) => void;
  onVideoOpen: (event: NativeSyntheticEvent<SimpleCallbackEventProps>) => void;
  onVideoLoadStart: (event: NativeSyntheticEvent<SimpleCallbackEventProps>) => void;
  onVideoLoad: (event: NativeSyntheticEvent<VideoInfo>) => void;
  onRecordingState: (event: NativeSyntheticEvent<IosRecordingStateEvent>) => void;
  onSnapshot: (event: NativeSyntheticEvent<VideoSnapshotEvent>) => void;
}

export interface IosVideoProgressEvent extends SimpleCallbackEventProps {
  currentTime: number;
  remainingTime: number;
  duration: number;
  position: number;
}

export interface IosVideoPlayingEvent extends SimpleCallbackEventProps {
  seekable: boolean;
  duration: number;
}

export interface IosVideoEndedEvent extends SimpleCallbackEventProps {
  currentTime: number;
  remainingTime: number;
  duration: number;
  position: number;
}

export interface IosRecordingStateEvent extends SimpleCallbackEventProps {
  readonly isRecording: boolean;
  readonly recordPath?: string;
}
