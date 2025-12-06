import { Request, Response, NextFunction } from 'express';
import { runUserPrompt } from '../services/runUserPrompt';
import { parseGenAIResponse } from "../utils/utils";
import { ParsedQs } from 'qs';

export const checkStatus = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/' || req.path === '') {
    // Handle /api only
    return res.json({ 
      status: 'API is running',
      'endpoint': 'https://restaurant-finder-oaxi.onrender.com/api/execute?message=<your_message>&code=pioneerdevai'
       }
    );
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
    const message = query.message;
    if (query.code == "pioneerdevai") {
      if (typeof message === 'string') {
        const decodedParam = decodeURIComponent(message);
        const fetchRes = async function () {
          const searchResults = await runUserPrompt(decodedParam);
          const jsonResults = parseGenAIResponse(searchResults);
          if (jsonResults != null) {
            res.status(200).json(jsonResults);
          }else {
            const emptyJson = ` { "action": "restaurant_search", "results": [] }`
            res.status(200).json(JSON.parse(emptyJson));
          }
        }
        fetchRes();
      }

    } else
      res.status(401).json("Invalid code");
  } catch (error) {
    next(error);
  }
};