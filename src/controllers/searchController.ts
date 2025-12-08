import { Request, Response, NextFunction } from 'express';
import { runUserPrompt } from '../services/runUserPrompt';
import { parseGenAIResponse } from "../utils/utils";
import { ParsedQs } from 'qs';
import { IPinfoWrapper, IPinfo } from "node-ipinfo";
import { initializeConfig } from '../config/config';
import dotenv from 'dotenv';
dotenv.config();

// Configure the client
const config = initializeConfig();


export const checkStatus = async (req: Request, res: Response, next: NextFunction) => {
  let location: string | null = null;
  const xForwardFor = req.headers['x-forwarded-for'];
  let userIp: string | null = null;
  console.log('Header', xForwardFor);
  // Using optional chaining and nullish coalescing
  if (req.path === "/" || req.path === "") {

    if (xForwardFor) {
      if (typeof xForwardFor === 'string') {
        userIp = xForwardFor.split(',')[0]?.trim() ?? null;
        console.log('Header user Ip', userIp);
      } else if (Array.isArray(xForwardFor)) {
        userIp = xForwardFor[0]?.trim() ?? null;
      }
    } else {
      if (req.ip) {
        userIp = req.ip;
      }
    }
    if (userIp) {
      const ipinfoWrapper = new IPinfoWrapper(config.IP_INFO_API_TOKEN);
      try {
        if (userIp) {
          const ipinfo: IPinfo = await ipinfoWrapper.lookupIp(userIp);
          location = ipinfo.loc;
          console.log('Location', location);
          console.log('IPINFO', ipinfo);
        }
      } catch (error) {
        console.error("Error looking up IP:", error);
      }
    }
    // Only handle the root `/api` path
    if (req.path === "/" || req.path === "") {
      return res.json({
        status: "API is running",
        ip: userIp,
        location: location || "Not found",
        Endpoints: {
          execute:
            "https://restaurant-finder-oaxi.onrender.com/api/execute?message=<your_message>&code=pioneerdevai",
        },
      });
    }

    // Any other /api route continues
    next();
  };
}

interface Query extends ParsedQs {
  message?: string;
  code?: string;
}

export const findRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Access query parameters
    const query: Query = req.query as Query;
    const message = query.message;
    let location: string | null = null;
    let userIp: string | null = null;
    const xForwardFor = req.headers['x-forwarded-for'];

    if (query.code == "pioneerdevai") {
      if (typeof message === 'string') {
        console.log('Request data->', req);
        
        // Extract IP from headers
        if (xForwardFor) {
          if (typeof xForwardFor === 'string') {
            userIp = xForwardFor.split(',')[0]?.trim() ?? null;
            console.log('Header user Ip', userIp);
          } else if (Array.isArray(xForwardFor)) {
            userIp = xForwardFor[0]?.trim() ?? null;
          }
        } else {
          if (req.ip) {
            userIp = req.ip;
          }
        }

        // Get location from IP
        if (userIp) {
          const ipinfoWrapper = new IPinfoWrapper(config.IP_INFO_API_TOKEN);
          try {
            const ipinfo: IPinfo = await ipinfoWrapper.lookupIp(userIp);
            location = ipinfo.loc;
            console.log('Location', location);
            console.log('IPINFO', ipinfo);
          } catch (error) {
            console.error("Error looking up IP:", error);
          }
        }

        const decodedParam = decodeURIComponent(message);
        const fetchRes = async function () {
          const searchResults = await runUserPrompt(decodedParam, location);
          const jsonResults = parseGenAIResponse(searchResults);
          if (jsonResults != null) {
            res.status(200).json(jsonResults);
          } else {
            const emptyJson = `{ "action": "restaurant_search", "results": [] }`;
            res.status(200).json(JSON.parse(emptyJson));
          }
        };
        await fetchRes();
      } else {
        res.status(400).json({ error: "Message must be a string" });
      }
    } else {
      res.status(401).json({ error: "Invalid code" });
    }
  } catch (error) {
    next(error);
  }
};