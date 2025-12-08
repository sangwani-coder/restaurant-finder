import { IPinfoWrapper, IPinfo } from "node-ipinfo";
import { initializeConfig } from '../config/config';
import dotenv from 'dotenv';
dotenv.config();

// Configure the client
const config = initializeConfig();

/**
 * Finds a user location and returns the latitude and longitude of the location
 * @params (string) ip - A users IP address obtained from the GET request.
 * @returns: lat long e.g(1.8781,-87.6298)
 * */
export async function getLocation(ip:string | null){
    const ipinfoWrapper = new IPinfoWrapper(config.IP_INFO_API_TOKEN);
    // Only handle the root `/api` path
    let location: string | null = null;
    let country: string | null = null;

    try {
      if (ip) {
        const ipinfo: IPinfo = await ipinfoWrapper.lookupIp(ip);
        location = ipinfo.loc || null;
        return location
      }
    } catch (error) {
      console.error("Error looking up IP:", error);
    }
}