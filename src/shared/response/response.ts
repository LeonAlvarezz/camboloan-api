import { Response } from 'express';
export class SuccessResponse {
  message: string;
}
export const Success = (res: Response, message?: SuccessResponse) => {
  const defaultMessage: SuccessResponse = message
    ? message
    : { message: 'Success' };
  return res.status(200).json(defaultMessage);
};
