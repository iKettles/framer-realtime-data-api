import * as express from 'express';
import { NextFunction } from 'connect';

declare module 'express' {
  interface Request {
    skip: number;
    limit: number;
  }

  interface Response {
    success: NextFunction;
    error: NextFunction;
  }
}
