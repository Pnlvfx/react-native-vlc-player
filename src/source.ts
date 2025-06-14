import type { VLCPlayerSource } from './types/js';
import { Image } from 'react-native';

interface Props {
  input: VLCPlayerSource;
  autoplay: boolean;
  repeat: boolean | undefined;
}

export const resolveAssetSource = ({ input, autoplay, repeat }: Props) => {
  const source = Image.resolveAssetSource(input);
  const uri = source.uri.match(/^\//) ? `file://${source.uri}` : source.uri;
  const isAsset = !!uri.match(/^(assets-library|file|content|ms-appx|ms-appdata):/);
  let isNetwork = !!uri.match(/^https?:/);
  if (!isAsset) {
    isNetwork = true;
  }
  if (uri.match(/^\//)) {
    isNetwork = false;
  }

  const initOptions = input.initOptions ?? [];

  if (repeat) {
    const existingRepeat = initOptions.find(item => item.startsWith('--repeat') || item.startsWith('--input-repeat'));
    if (!existingRepeat) {
      initOptions.push('--repeat');
    }
  }

  return { ...source, isNetwork, autoplay, initOptions };
};
