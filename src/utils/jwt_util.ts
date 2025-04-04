import { AuthJwt } from '@/auth/entities/auth.type';
import { config } from '@/config';
import * as jwt from 'jsonwebtoken';
import { type Algorithm, type JwtPayload } from 'jsonwebtoken';
import ms from 'ms';

export const JwtSign = (auth: AuthJwt, expiresIn?: number | ms.StringValue) => {
  const algo = config.jwt.algo as Algorithm;
  const expiresDate = expiresIn
    ? expiresIn
    : (config.jwt.expiresIn as number | ms.StringValue);

  const token = jwt.sign(auth, config.jwt.secret, {
    algorithm: algo,
    expiresIn: expiresDate,
  });
  return token;
};

export const JwtVerify = (token: string): AuthJwt => {
  const decoded = jwt.verify(token, config.jwt.secret);
  const result = decoded as JwtPayload;
  return {
    auth_id: result.auth_id,
    sub: result.sub ?? null,
  };
};
