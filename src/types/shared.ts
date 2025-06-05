// @TODO check if nativesyntethic event doesn't already include this-.
export interface VideoTargetEvent {
  target: number;
}

export interface VideoSnapshotEvent extends VideoTargetEvent {
  success: boolean;
  path?: string;
  error?: string;
}
