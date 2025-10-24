import type { VLCPlayerProps, VLCStoppedEvent } from './types/js';
import type { NativePlayerCommands, NativePlayerProps } from './types/native';
import type { AndroidLayoutVideoStateChangeEvent, AndroidVideoOpenEvent, AndroidVideoSeekEvent, AndroidVideoStateChangeEvent } from './types/android';
import type { RecordingStateEvent, SimpleCallbackEventProps, VideoInfo, VideoSnapshotEvent } from './types/shared';
import { findNodeHandle, requireNativeComponent, StyleSheet, UIManager, type NativeMethods, type NativeSyntheticEvent } from 'react-native';
import { resolveAssetSource } from './source';
import { Component, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import type ReactNativeElement from 'react-native/types_generated/src/private/webapis/dom/nodes/ReactNativeElement';

const RCTVLCPlayer = requireNativeComponent<NativePlayerProps>('RCTVLCPlayer');

// Simple wrapper that infers types from the callback
function createEventHandler<T>(callback: ((event: T) => void) | undefined) {
  return (event: NativeSyntheticEvent<T>) => {
    if (callback) {
      callback(event.nativeEvent);
    }
  };
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
  onRecordingCreated,
}: VLCPlayerProps) => {
  const playerRef = useRef<ReactNativeElement>(null);
  const lastRecording = useRef<string>(undefined);
  const resolvedAssetSource = useMemo(() => resolveAssetSource({ input: source, autoplay, repeat }), [source, autoplay, repeat]);

  const setNativeProps = useCallback((props: Partial<NativePlayerCommands>) => {
    playerRef.current?.setNativeProps(props);
  }, []);

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
        const command = UIManager.getViewManagerConfig('RCTVLCPlayer').Commands['startRecording'];
        if (!command) throw new Error('Command startRecording not found on the native side.');
        UIManager.dispatchViewManagerCommand(findNodeHandle(playerRef.current), command, [path]);
      },
      stopRecording: () => {
        const command = UIManager.getViewManagerConfig('RCTVLCPlayer').Commands['stopRecording'];
        if (!command) throw new Error('Command stopRecording not found on the native side.');
        UIManager.dispatchViewManagerCommand(findNodeHandle(playerRef.current), command, []);
      },
      snapshot: path => {
        const command = UIManager.getViewManagerConfig('RCTVLCPlayer').Commands['snapshot'];
        if (!command) throw new Error('Command snapshot not found on the native side.');
        UIManager.dispatchViewManagerCommand(findNodeHandle(playerRef.current), command, [path]);
      },
    }),
    [setNativeProps],
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
    />
  );
};

const { baseStyle } = StyleSheet.create({
  baseStyle: {
    overflow: 'hidden',
  },
});

export type * from './types/js';
export type { VideoInfo, VideoSnapshotEvent } from './types/shared';
