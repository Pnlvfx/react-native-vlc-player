import type { NativeSyntheticEvent } from 'react-native';
import type { VideoAspectRatio } from './native';
import type { SimpleCallbackEventProps, VideoSnapshotEvent } from './shared';

export interface VLCPlayerIosProps extends VLCPlayerIosEvents {
  source: VLCPlayerIosSource;
  subtitleUri?: string;
  paused?: boolean;
  seek?: number;
  rate?: number;
  resume: boolean;
  videoAspectRatio?: VideoAspectRatio;
  snapshotPath: string;
  muted?: boolean;
  audioTrack?: number;
  textTrack?: number;
  autoplay: boolean;
}

interface VLCPlayerIosSource {
  uri: string;
  initType: number;
  initOptions: string[];
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
  onVideoLoad: (event: NativeSyntheticEvent<IosVideoLoadEvent>) => void;
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

export interface IosVideoLoadEvent extends SimpleCallbackEventProps {
  duration: number;
  videoSize: {
    width: number;
    height: number;
  };
  audioTracks: {
    id: number;
    name: string;
  }[];
  textTracks: {
    id: number;
    name: string;
  }[];
}

export interface IosRecordingStateEvent extends SimpleCallbackEventProps {
  readonly isRecording: boolean;
  readonly recordPath?: string;
}
