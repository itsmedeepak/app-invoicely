// src/utils/isTokenExpired.ts
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
  exp: number; // Expiration time in seconds
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Other JWT fields
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Invalid token", error);
    return true; // Treat invalid tokens as expired
  }
};
