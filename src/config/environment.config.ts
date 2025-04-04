import * as dotenv from 'dotenv';
// process.env.NODE_ENV = process.env.NODE_ENV || "development";
// const envFound = dotenv.config({
//   path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
// });
if (process.env.NODE_ENV !== 'production') {
  const envFound = dotenv.config();
  if (envFound.error) {
    // This error should crash whole process

    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}
export default {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || '',
  passwordSalt: process.env.PASSWORD_SALT || 10,
  encryptionCode: process.env.ENCRYPTION_KEY || '',
  defaultOTPCode: process.env.DEFAULT_OTP_CODE || '',
  api: {
    prefix: '/api',
    version: '1',
    versionPrefix: 'v',
  },
  jwt: {
    algo: process.env.JWT_ALGO || 'HS512',
    secret: process.env.JWT_SECRET || '',
    iv: process.env.JWT_IV || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '2 days',
  },
  swagger: process.env.SWAGGER || 'true',
};
