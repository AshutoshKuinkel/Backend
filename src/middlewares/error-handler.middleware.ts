import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
 
  const statusCode = err?.statusCode || 500;
  const success = err?.success || false;
  const status = err?.status || 'error';
  const message = err?.message || 'Internal Server Error';

  res.status(statusCode).json({
    message,
    success,
    status,
    data:null
  });
}