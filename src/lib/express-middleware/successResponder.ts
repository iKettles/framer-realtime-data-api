import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  res.success = (data: any) => {
    const body: any = {
      result: data
    };

    if (req.skip !== undefined && req.limit !== undefined) {
      body.skip = req.skip;
      body.limit = req.limit;
    }

    res.status(200);
    res.json(body);
  };

  next();
};
