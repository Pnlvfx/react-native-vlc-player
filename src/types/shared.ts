// @TODO check if nativesyntethic event doesn't already include this-.
export interface SimpleCallbackEventProps {
  target: number;
}

export interface VideoSnapshotEvent extends SimpleCallbackEventProps {
  success: boolean;
  path?: string;
  error?: string;
}
