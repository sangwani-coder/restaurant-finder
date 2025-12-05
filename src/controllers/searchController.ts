import { Request, Response, NextFunction } from 'express';
import { runUserPrompt } from '../services/runUserPrompt';
import {ParsedQs } from 'qs';

export const checkStatus = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/' || req.path === '') {
    // Handle /api only
    return res.json({ status: 'API is running' });
  }

  // For all other /api/* routes, pass to next middleware
  next();
};

interface Query extends ParsedQs {
  message?: string;
  code?: string;
}

export const findRestaurants = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Access query paramters
    const query: Query = req.query as Query;

    if (query.code == "pioneerdevai") {
      const fetchRes = async function() {
        // constAiRes = await promptAi(query.message!);
        // const FsqRes = await getRestaurants('');
        const response = {"Status": "OK"}
        res.status(200).json(response);
      }
      fetchRes();
       
    } else
      res.status(401).json("Invalid code");
  } catch (error) {
    next(error);
  }
};