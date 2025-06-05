import type { VLCPlayerSource } from './types/js';
import { Image } from 'react-native';

interface Props {
  input: VLCPlayerSource;
  autoplay: boolean;
  repeat: boolean | undefined;
}

export const resolveAssetSource = ({ input, autoplay, repeat }: Props) => {
  const source = Image.resolveAssetSource(input);
  let uri = source.uri || '';
  if (uri && uri.match(/^\//)) {
    uri = `file://${uri}`;
  }
  let isNetwork = !!(uri && uri.match(/^https?:/));
  const isAsset = !!(uri && uri.match(/^(assets-library|file|content|ms-appx|ms-appdata):/));
  if (!isAsset) {
    isNetwork = true;
  }
  if (uri && uri.match(/^\//)) {
    isNetwork = false;
  }

  const initOptions = input.initOptions ?? [];

  if (repeat) {
    const existingRepeat = (source as VLCPlayerSource).initOptions?.find((item) => item.startsWith('--repeat') || item.startsWith('--input-repeat'));
    if (!existingRepeat) {
      (source as VLCPlayerSource).initOptions?.push('--repeat');
    }
  }

  // original code was using source.type || '' but source.type is always undefined.
  return { ...source, isNetwork, autoplay, initOptions, type: '' };
};
