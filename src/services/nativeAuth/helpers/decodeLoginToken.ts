import { isString } from 'lodash';
import { decodeBase64 } from 'utils/decoders/base64Utils';

export interface DecodedLoginTokenType {
  blockHash: string;
  extraInfo?: { timestamp: number };
  origin: string;
  ttl: number;
}

export const decodeLoginToken = (
  loginToken: string
): DecodedLoginTokenType | null => {
  if (!loginToken || !isString(loginToken)) {
    return null;
  }

  const parts = loginToken.split('.');

  if (parts.length !== 4) {
    console.error(
      'Invalid loginToken. You may be trying to decode a nativeAuthToken. Try using decodeNativeAuthToken method instead'
    );

    return null;
  }

  try {
    const [origin, blockHash, ttl, extraInfo] = parts;
    const parsedExtraInfo = JSON.parse(decodeBase64(extraInfo));
    const parsedOrigin = decodeBase64(origin);

    return {
      ttl: Number(ttl),
      extraInfo: parsedExtraInfo,
      origin: parsedOrigin,
      blockHash
    };
  } catch (e) {
    console.error(`Error trying to decode ${loginToken}:`, e);

    return null;
  }
};
