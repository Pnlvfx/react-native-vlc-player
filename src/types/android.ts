import type { NativeSyntheticEvent } from 'react-native';
import type { VideoSnapshotEvent, SimpleCallbackEventProps, VideoInfo, SharedPlayerProps, RecordingStateEvent } from './shared';

export interface VLCPlayerAndroidProps extends SharedPlayerProps, VLCPlayerAndroidEvents {
  source: VLCPlayerAndroidSource;
  repeat?: boolean;
  volume?: number;
  autoAspectRatio?: boolean;
  position?: number;
  progressUpdateInterval: number;
  clear?: boolean;
}

interface VLCPlayerAndroidSource {
  uri: string;
  isNetwork: boolean;
  autoplay: boolean;
}

interface VLCPlayerAndroidEvents {
  onVideoLoadStart: (event: NativeSyntheticEvent<SimpleCallbackEventProps>) => void;
  onVideoOpen: (event: NativeSyntheticEvent<AndroidVideoOpenEvent>) => void;
  onVideoProgress: (event: NativeSyntheticEvent<AndroidVideoProgressEvent>) => void;
  onVideoSeek: (event: NativeSyntheticEvent<AndroidVideoSeekEvent>) => void;
  onVideoEnd: (event: NativeSyntheticEvent<AndroidVideoEndEvent>) => void;
  onVideoPlaying: (event: NativeSyntheticEvent<AndroidVideoPlayingEvent>) => void;
  onVideoStateChange: (event: NativeSyntheticEvent<AndroidVideoStateChangeEvent | AndroidLayoutVideoStateChangeEvent>) => void;
  onVideoPaused: (event: NativeSyntheticEvent<AndroidVideoPausedEvent>) => void;
  onVideoBuffering: (event: NativeSyntheticEvent<AndroidVideoBufferingEvent>) => void;
  onVideoError: (event: NativeSyntheticEvent<AndroidVideoErrorEvent>) => void;
  onVideoStopped: (event: NativeSyntheticEvent<AndroidVideoStoppedEvent>) => void;
  onVideoLoad: (event: NativeSyntheticEvent<VideoInfo>) => void;
  onRecordingState: (event: NativeSyntheticEvent<RecordingStateEvent>) => void;
  onSnapshot: (event: NativeSyntheticEvent<VideoSnapshotEvent>) => void;
}

export interface AndroidVideoStoppedEvent extends SimpleCallbackEventProps {
  type: 'Stopped';
}

export interface AndroidVideoBufferingEvent extends SimpleCallbackEventProps {
  type: 'Buffering';
  bufferRate: number;
}

export interface AndroidVideoPausedEvent extends SimpleCallbackEventProps {
  type: 'Paused';
  isPlaying: false;
  position: number;
  currentTime: number;
  duration: number;
}

export interface AndroidLayoutVideoStateChangeEvent extends SimpleCallbackEventProps {
  type: 'onNewVideoLayout';
  mVideoWidth: number;
  mVideoHeight: number;
  mVideoVisibleWidth: number;
  mVideoVisibleHeight: number;
  mSarNum: number;
  mSarDen: number;
}

export interface AndroidVideoStateChangeEvent extends SimpleCallbackEventProps {
  type: 'Paused' | 'Buffering' | 'Stopped' | 'Error';
  [key: string]: unknown;
}

export interface AndroidVideoPlayingEvent extends SimpleCallbackEventProps {
  type: 'Playing';
  isPlaying: true;
  position: number;
  currentTime: number;
  duration: number;
}

export interface AndroidVideoEndEvent extends SimpleCallbackEventProps {
  type: 'Ended';
  isPlaying: boolean;
  position: number;
  currentTime: number;
  duration: number;
}

export interface AndroidVideoSeekEvent extends SimpleCallbackEventProps {
  type: 'TimeChanged';
}

export interface AndroidVideoOpenEvent extends SimpleCallbackEventProps {
  type: 'Opening';
  isPlaying: boolean;
  position: number;
  currentTime: number;
  duration: number;
}

export interface AndroidVideoProgressEvent extends SimpleCallbackEventProps {
  isPlaying: boolean;
  /** From 0.0 to 1.0. */
  position: number;
  /** The video current time in ms. */
  currentTime: number;
  /** The video duration in ms. */
  duration: number;
}

export interface AndroidVideoErrorEvent extends SimpleCallbackEventProps {
  error: {
    errorString: string;
    excepion: string;
  };
}
