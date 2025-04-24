import { env } from '@/config';

export const isAdminPath = (path: string): boolean => {
  return path.startsWith(
    `${env.api.prefix}/${env.api.versionPrefix}${env.api.version}/admins`,
  );
};
