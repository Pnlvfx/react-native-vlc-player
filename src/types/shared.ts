/**
 * Video aspect ratio type
 */
export type VideoAspectRatio = '16:9' | '1:1' | '4:3' | '3:2' | '21:9' | '9:16';
/**
 * Video resize mode
 */
export type PlayerResizeMode = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

export interface SimpleCallbackEventProps {
  target: number;
}

export interface VideoSnapshotEvent extends SimpleCallbackEventProps {
  success: boolean;
  path?: string;
  error?: string;
}

/**
 * Represents a track type in playback
 */
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

/**
 * Represents a full playback information
 */
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
