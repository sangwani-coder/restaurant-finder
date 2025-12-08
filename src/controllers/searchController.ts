import { Request, Response, NextFunction } from 'express';
import { runUserPrompt } from '../services/runUserPrompt';
import { parseGenAIResponse } from "../utils/utils";
import { ParsedQs } from 'qs';
import { IPinfoWrapper, IPinfo } from "node-ipinfo";
import { initializeConfig } from '../config/config';
import {getLocation } from '../services/getLocation';
import {getClientIp} from 'get-client-ip';
import dotenv from 'dotenv';
dotenv.config();

// Configure the client
const config = initializeConfig();

export const checkStatus = async (req: Request, res: Response, next: NextFunction) => {
   let location: string | null = null;
   const ip = getClientIp(req);
   console.log('IP result', ip);
  // Only handle the root `/api` path
  if (req.path === "/" || req.path === "") {
    const fetchLocation = async function(){
      if (req){
            location = await getLocation(ip) || null;
          };
    };
    fetchLocation();
    
    return res.json({
      status: "API is running",
      ip : ip,
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

interface Query extends ParsedQs {
  message?: string;
  code?: string;
}

export const findRestaurants = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Access query paramters
    const query: Query = req.query as Query;
    const message = query.message;
    let location: string | null = null;
    if (query.code == "pioneerdevai") {
      if (typeof message === 'string') {
        console.log('Request data->', req);
        const fetchLocation = async function(){
            const ipinfoWrapper = new IPinfoWrapper(config.IP_INFO_API_TOKEN);
            try {
              if (req) {
                const forwadedIP:string = getClientIp(req) || '';
                const ipinfo: IPinfo = await ipinfoWrapper.lookupIp(forwadedIP);
                location = ipinfo.loc || null;
                console.log('IPINFO', ipinfo);
              }
            } catch (error) {
              console.error("Error looking up IP:", error);
            }
        }
        fetchLocation();
        const decodedParam = decodeURIComponent(message);
        const fetchRes = async function () {
          const searchResults = await runUserPrompt(decodedParam, req.ip);
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