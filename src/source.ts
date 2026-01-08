import type { VLCPlayerSource } from './types/js';
import { Image } from 'react-native';

interface Props {
  input: VLCPlayerSource;
  autoplay: boolean;
  repeat: boolean | undefined;
}

export const resolveAssetSource = ({ input, autoplay, repeat }: Props) => {
  const source = Image.resolveAssetSource(input);
  if (!source?.uri) throw new Error('URI is required');
  const uri = /^\//.exec(source.uri) ? `file://${source.uri}` : source.uri;
  const isAsset = !!/^(assets-library|file|content|ms-appx|ms-appdata):/.exec(uri);
  let isNetwork = !!/^https?:/.exec(uri);
  if (!isAsset) {
    isNetwork = true;
  }
  if (/^\//.exec(uri)) {
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
