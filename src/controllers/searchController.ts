import { Request, Response, NextFunction } from 'express';


export const checkStatus = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/' || req.path === '') {
    // Handle /api only
    return res.json({ status: 'API is running' });
  }
  
  // For all other /api/* routes, pass to next middleware
  next();
};


export const findRestaurants = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Access query paramters
    const message = req.query.message;
    const code = req.query.code;
    // Placeholder for future implementation
    if (code=="pioneerdevai"){
      const data = {
        "messages": message,
        "code": code,
      }
      res.status(200).json(data);
    } else
      res.status(401).json("Invalid code");
  } catch (error) {
    next(error);
  }
};