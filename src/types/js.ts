import type { StyleProp, ViewStyle } from 'react-native';
import type { RefObject } from 'react';
import type { SharedPlayerProps, SimpleCallbackEventProps, VideoAspectRatio, VideoInfo, VideoSnapshotEvent } from './shared';
import type {
  AndroidVideoBufferingEvent,
  AndroidVideoEndEvent,
  AndroidVideoErrorEvent,
  AndroidVideoPausedEvent,
  AndroidVideoPlayingEvent,
  AndroidVideoProgressEvent,
  AndroidVideoStoppedEvent,
} from './android';
import type { IosVideoEndedEvent, IosVideoPlayingEvent, IosVideoProgressEvent } from './ios';

export interface VLCPlayerProps extends SharedPlayerProps, VLCPlayerCallbackProps {
  /**
   * Object that contains the uri of a video or song to play eg
   */
  source: VLCPlayerSource;
  /**
   * The player ref
   */
  ref?: RefObject<VLCPlayerCommands | null>;
  /**
   * Set to `true` or `false` to loop the media
   * @default false
   */
  repeat?: boolean;
  /**
   * Set the volume of the player
   */
  volume?: number;
  /**
   * Set to `true` or `false` to enable auto aspect ratio
   * @default false
   */
  autoAspectRatio?: boolean;
  /**
   * React native view stylesheet styles
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Enables autoplay
   *
   * @default true
   */
  autoplay?: boolean;
  /**
   * Set to `true` to automatically accept invalid SSL/TLS certificates
   * when connecting to HTTPS streams. This bypasses certificate validation
   * which may pose security risks.
   *
   * @default false
   */
  acceptInvalidCertificates?: boolean;
  /**
   * android only
   */
  clear?: boolean;
}

export interface VLCPlayerCommands {
  /**
   * Seek to the given position
   *
   * @param pos Position to seek to (as a percentage of the full duration)
   */
  seek: (pos: number) => void;
  /**
   * Resume playback
   */
  resume: (isResume: boolean) => void;
  /**
   * Change auto aspect ratio setting
   *
   * @param useAuto Whether or not to use auto aspect ratio
   */
  autoAspectRatio: (useAuto: boolean) => void;
  /**
   * Update video aspect ratio e.g. `"16:9"`
   *
   * @param ratio Aspect ratio to use
   */
  changeVideoAspectRatio: (ratio: VideoAspectRatio) => void;
  startRecording: (path: string) => void;
  stopRecording: () => void;
  /**
   * Stop playing
   */
  stopPlayer: () => void;
  snapshot: (path: string) => void;
}

/**
 * VLC Player source configuration options
 */
export interface VLCPlayerSource {
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
}

interface VLCPlayerCallbackProps {
  /**
   * Called when media starts playing returns
   *
   * @param event - Event properties
   */
  onPlaying?: (event: VLCPlayingEvent) => void;
  /**
   * Callback containing position as a fraction, and duration, currentTime and remainingTime in seconds
   *
   * @param event - Event properties
   */
  onProgress?: (event: VLCProgressEvent) => void;
  /**
   * Called when media is paused
   *
   * @param event - Event properties
   */
  onPaused?: (event: VLCPausedEvent) => void;
  /**
   * Called when media is stoped
   *
   * @param event - Event properties
   */
  onStopped?: (event: VLCStoppedEvent) => void;
  /**
   * Called when media is buffering
   *
   * @param event - Event properties
   */
  onBuffering?: (event: VLCBufferingEvent) => void;
  /**
   * Called when media playing ends
   *
   * @param event - Event properties
   */
  onEnd?: (event: VLCEndEvent) => void;
  /**
   * Called when an error occurs whilst attempting to play media
   *
   * @param event - Event properties
   */
  onError?: (event: VLCErrorEvent) => void;
  /**
   * Called when video info is loaded, Callback containing `VideoInfo`
   *
   * @param event - Event properties
   */
  onLoad?: (event: VideoInfo) => void;
  /**
   * Called when a new recording is created
   *
   * @param recordingPath - Full path to the recording file
   */
  onRecordingCreated?: (recordingPath: string) => void;
  /**
   * Called when a new snapshot is created
   *
   * @param event - Event properties
   */
  onSnapshot?: (event: VideoSnapshotEvent) => void;
}

// TODO we must provide a single typed event and handle the platform differences internally
// but that's a long work and for now we provide them like this
export type VLCPlayingEvent = IosVideoPlayingEvent | AndroidVideoPlayingEvent;
export type VLCProgressEvent = IosVideoProgressEvent | AndroidVideoProgressEvent;
export type VLCPausedEvent = SimpleCallbackEventProps | AndroidVideoPausedEvent;
export type VLCStoppedEvent = SimpleCallbackEventProps | AndroidVideoStoppedEvent;
export type VLCBufferingEvent = SimpleCallbackEventProps | AndroidVideoBufferingEvent;
export type VLCEndEvent = IosVideoEndedEvent | AndroidVideoEndEvent;
export type VLCErrorEvent = SimpleCallbackEventProps | AndroidVideoErrorEvent;
