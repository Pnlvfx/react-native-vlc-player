import type { NativeSyntheticEvent } from 'react-native';
import type { VideoAspectRatio } from './native';
import type { VideoSnapshotEvent, SimpleCallbackEventProps } from './shared';

export interface VLCPlayerAndroidProps extends VLCPlayerAndroidEvents {
  source: VLCPlayerAndroidSource;
  subtitleUri?: string;
  repeat?: boolean;
  paused?: boolean;
  muted?: boolean;
  volume?: number;
  seek?: number;
  autoAspectRatio?: boolean;
  resume: boolean;
  rate?: number;
  position: number;
  videoAspectRatio?: VideoAspectRatio;
  snapshotPath: string;
  audioTrack?: number;
  textTrack?: number;
  progressUpdateInterval: number;
  clear: boolean;
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
  onVideoLoad: (event: NativeSyntheticEvent<AndroidVideoLoadEvent>) => void;
  onRecordingState: (event: NativeSyntheticEvent<AndroidRecordingStateEvent>) => void;
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

interface AndroidLayoutVideoStateChangeEvent extends SimpleCallbackEventProps {
  type: 'onNewVideoLayout';
  mVideoWidth: number;
  mVideoHeight: number;
  mVideoVisibleWidth: number;
  mVideoVisibleHeight: number;
  mSarNum: number;
  mSarDen: number;
}

interface AndroidVideoStateChangeEvent extends SimpleCallbackEventProps {
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

interface AndroidVideoSeekEvent extends SimpleCallbackEventProps {
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

export interface AndroidVideoLoadEvent extends SimpleCallbackEventProps {
  duration: number;
  audioTracks: {
    id: number;
    name: string;
  }[];
  textTracks: {
    id: number;
    name: string;
  }[];
  videoSize: {
    width: number;
    height: number;
  };
}

export interface AndroidRecordingStateEvent extends SimpleCallbackEventProps {
  readonly isRecording: boolean;
  readonly recordPath?: string;
}
