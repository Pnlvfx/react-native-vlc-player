export type VideoAspectRatio = '16:9' | '1:1' | '4:3' | '3:2' | '21:9' | '9:16';

export interface SimpleCallbackEventProps {
  target: number;
}
export interface VideoSnapshotEvent extends SimpleCallbackEventProps {
  success: boolean;
  path?: string;
  error?: string;
}

interface Track {
  /**
   * Track identification
   */
  id: number;

  /**
   * Track name
   */
  name: string;
}
export interface VideoInfo extends SimpleCallbackEventProps {
  /**
   * Total playback duration
   */
  duration: number;
  /**
   * Total playback video size
   */
  videoSize: Record<'width' | 'height', number>;

  /**
   * List of playback audio tracks
   */
  audioTracks: Track[];

  /**
   * List of playback text tracks
   */
  textTracks: Track[];
}

export interface RecordingStateEvent extends SimpleCallbackEventProps {
  readonly isRecording: boolean;
  readonly recordPath?: string;
}

export interface SharedPlayerProps {
  /**
   * local subtitle file path，if you want to hide subtitle,
   * you can set this to an empty subtitle file，
   * current we don't support a hide subtitle prop.
   */
  readonly subtitleUri?: string;
  /**
   * Set to `true` or `false` to pause or play the media
   * @default false
   */
  readonly paused?: boolean;
  /**
   * Set the playback rate of the player
   * @default 1
   */
  readonly rate?: number;
  /**
   * Set position to seek between 0 and 1
   * (0 being the start, 1 being the end, use position from the progress object)
   */
  readonly seek?: number;
  /**
   * Video aspect ratio
   */
  readonly videoAspectRatio?: VideoAspectRatio;
  /**
   * Set audioTrack id (number) (see onLoad callback VideoInfo.audioTracks)
   */
  readonly audioTrack?: number;

  /**
   * 	Set textTrack(subtitle) id (number) (see onLoad callback - VideoInfo.textTracks)
   */
  readonly textTrack?: number;
  /**
   * Set to `true` or `false` to mute the player
   * @default false
   */
  readonly muted?: boolean;
  readonly resume?: boolean;
  readonly snapshotPath?: string;
}
