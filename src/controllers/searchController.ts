import { Request, Response, NextFunction } from 'express';
import { promptAi } from '../services/parsePrompt';
import { getRestaurants } from '../services/getRestaurants';
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
        // Use a function expression to prevent Errors:
        // Function declarations are not allowed inside blocks in strict mode
        // Display the parsed prompt
        // Implement calling the FSQ api with returned parameters
        // const response = await promptAi(query.message!);
        const response = await getRestaurants('');
        console.log('Fuction called');
        console.log(`response ${response}`);
        res.status(200).json(response);
      }
      fetchRes();
       
    } else
      res.status(401).json("Invalid code");
  } catch (error) {
    next(error);
  }
};