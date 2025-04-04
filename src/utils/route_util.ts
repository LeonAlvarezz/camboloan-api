import { config } from '@/config';

export const isAdminPath = (path: string): boolean => {
  return path.startsWith(
    `${config.api.prefix}/${config.api.versionPrefix}${config.api.version}/admins`,
  );
};
