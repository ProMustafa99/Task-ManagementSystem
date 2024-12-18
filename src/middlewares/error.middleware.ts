import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/httpException';
import { logger } from '@utils/logger';
import { EmailService } from '@/services/ email.service';
import Container from 'typedi';


export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {

  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    const emailService = Container.get(EmailService);
    emailService.SendEmailForErrorApi(req, status, message);

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });

  } catch (error) {
    next(error);
  }
};
