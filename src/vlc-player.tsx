import type { VLCPlayerProps, VLCStoppedEvent } from './types/js';
import type { NativePlayerCommands, NativePlayerProps } from './types/native';
import type { AndroidLayoutVideoStateChangeEvent, AndroidVideoOpenEvent, AndroidVideoSeekEvent, AndroidVideoStateChangeEvent } from './types/android';
import type { RecordingStateEvent, SimpleCallbackEventProps, VideoInfo, VideoSnapshotEvent } from './types/shared';
import { findNodeHandle, requireNativeComponent, StyleSheet, UIManager, type HostInstance, type NativeSyntheticEvent } from 'react-native';
import { resolveAssetSource } from './source';
import { Component, useImperativeHandle, useRef } from 'react';

const RCTVLCPlayer = requireNativeComponent<NativePlayerProps>('RCTVLCPlayer');

// Simple wrapper that infers types from the callback
function createEventHandler<T>(callback: ((event: T) => void) | undefined) {
  return (event: NativeSyntheticEvent<T>) => {
    if (callback) {
      callback(event.nativeEvent);
    }
  };
}

interface RCTVLCPlayerCommands {
  startRecording: number;
  stopRecording: number;
  stopPlayer: number;
  snapshot: number;
}

interface RCTVLCPlayerViewManagerConfig {
  Commands: RCTVLCPlayerCommands;
}

function getVLCCommands(): RCTVLCPlayerCommands {
  const config = UIManager.getViewManagerConfig('RCTVLCPlayer') as RCTVLCPlayerViewManagerConfig | null;
  if (!config?.Commands) throw new Error('RCTVLCPlayer native commands are not available.');
  return config.Commands;
}

export const VLCPlayer = ({
  source,
  style,
  autoplay = true,
  ref,
  onBuffering,
  onEnd,
  onError,
  onLoad,
  onPaused,
  onPlaying,
  onProgress,
  onStopped,
  onSnapshot,
  audioTrack,
  autoAspectRatio,
  muted,
  paused,
  rate,
  repeat,
  seek,
  subtitleUri,
  textTrack,
  videoAspectRatio,
  volume,
  clear,
  acceptInvalidCertificates,
  onRecordingCreated,
}: VLCPlayerProps) => {
  const playerRef = useRef<Component<NativePlayerProps> & HostInstance>(null);
  const lastRecording = useRef<string>(undefined);
  const resolvedAssetSource = resolveAssetSource({ input: source, autoplay, repeat });

  const setNativeProps = (props: Partial<NativePlayerCommands>) => {
    playerRef.current?.setNativeProps(props);
  };

  useImperativeHandle(
    ref,
    () => ({
      seek: pos => {
        setNativeProps({ seek: pos });
      },
      resume: isResume => {
        setNativeProps({ resume: isResume });
      },
      autoAspectRatio: isAuto => {
        setNativeProps({ autoAspectRatio: isAuto });
      },
      changeVideoAspectRatio: ratio => {
        setNativeProps({ videoAspectRatio: ratio });
      },
      startRecording: (path: string) => {
        const commands = getVLCCommands();
        const playerNode = findNodeHandle(playerRef.current);
        if (!playerNode) throw new Error('Player node not found!');
        UIManager.dispatchViewManagerCommand(playerNode, commands.startRecording, [path]);
      },
      stopRecording: () => {
        const commands = getVLCCommands();
        const playerNode = findNodeHandle(playerRef.current);
        if (!playerNode) throw new Error('Player node not found!');
        UIManager.dispatchViewManagerCommand(playerNode, commands.stopRecording, []);
      },
      stopPlayer: () => {
        const commands = getVLCCommands();
        const playerNode = findNodeHandle(playerRef.current);
        if (!playerNode) throw new Error('Player node not found!');
        UIManager.dispatchViewManagerCommand(playerNode, commands.stopPlayer, []);
      },
      snapshot: path => {
        const commands = getVLCCommands();
        const playerNode = findNodeHandle(playerRef.current);
        if (!playerNode) throw new Error('Player node not found!');
        UIManager.dispatchViewManagerCommand(playerNode, commands.snapshot, [path]);
      },
    }),
    [],
  );

  //** Event handlers */

  const onBufferingHandler = createEventHandler(onBuffering);
  const onErrorHandler = createEventHandler(onError);
  const onProgressHandler = createEventHandler(onProgress);
  const onPlayingHandler = createEventHandler(onPlaying);
  const onEndedHandler = createEventHandler(onEnd);
  const onPausedHandler = createEventHandler(onPaused);

  const onStoppedHandler = (event: NativeSyntheticEvent<VLCStoppedEvent>) => {
    setNativeProps({ paused: true });
    if (onStopped) {
      onStopped(event.nativeEvent);
    }
  };

  const onLoadHandler = (event: NativeSyntheticEvent<VideoInfo>) => {
    if (onLoad) {
      onLoad(event.nativeEvent);
    }
  };

  const onRecordingState = (event: NativeSyntheticEvent<RecordingStateEvent>) => {
    if (lastRecording.current === event.nativeEvent.recordPath) return;
    if (!event.nativeEvent.isRecording && event.nativeEvent.recordPath) {
      lastRecording.current = event.nativeEvent.recordPath;
      if (onRecordingCreated) {
        onRecordingCreated(lastRecording.current);
      }
    }
  };

  const onSnapshotHandler = (event: NativeSyntheticEvent<VideoSnapshotEvent>) => {
    if (event.nativeEvent.success && onSnapshot) {
      onSnapshot(event.nativeEvent);
    }
  };

  /** currently not used */
  const onOpenHandler = (_event: NativeSyntheticEvent<AndroidVideoOpenEvent | SimpleCallbackEventProps>) => {
    /** Not provided on the js types rn. */
  };

  const onLoadStartHandler = (_event: NativeSyntheticEvent<SimpleCallbackEventProps>) => {
    /** Not provided on the js types rn. */
  };

  /** android only */
  const onVideoSeek = (_event: NativeSyntheticEvent<AndroidVideoSeekEvent>) => {
    // console.warn('WARN: onVideoSeek in currently not implemented', event);
  };

  const onVideoStateChange = (_event: NativeSyntheticEvent<AndroidVideoStateChangeEvent | AndroidLayoutVideoStateChangeEvent>) => {
    // console.warn('WARN: onVideoStateChange in currently not implemented', event);
  };

  return (
    <RCTVLCPlayer
      ref={playerRef}
      source={resolvedAssetSource}
      style={StyleSheet.compose(baseStyle, style)}
      autoplay={autoplay}
      onVideoBuffering={onBufferingHandler}
      onVideoError={onErrorHandler}
      onVideoOpen={onOpenHandler}
      onVideoLoadStart={onLoadStartHandler}
      onVideoProgress={onProgressHandler}
      onVideoEnd={onEndedHandler}
      onVideoEnded={onEndedHandler}
      onVideoStopped={onStoppedHandler}
      onVideoPaused={onPausedHandler}
      onVideoPlaying={onPlayingHandler}
      onVideoLoad={onLoadHandler}
      onRecordingState={onRecordingState}
      onSnapshot={onSnapshotHandler}
      onVideoSeek={onVideoSeek}
      onVideoStateChange={onVideoStateChange}
      audioTrack={audioTrack}
      autoAspectRatio={autoAspectRatio}
      muted={muted}
      paused={paused}
      rate={rate}
      repeat={repeat}
      seek={seek}
      subtitleUri={subtitleUri}
      textTrack={textTrack}
      videoAspectRatio={videoAspectRatio}
      volume={volume}
      progressUpdateInterval={onProgress ? 250 : 0}
      clear={clear}
      acceptInvalidCertificates={!!acceptInvalidCertificates}
    />
  );
};

const { baseStyle } = StyleSheet.create({
  baseStyle: {
    overflow: 'hidden',
  },
});

export type * from './types/js';
export type { VideoInfo, VideoSnapshotEvent, Track } from './types/shared';
