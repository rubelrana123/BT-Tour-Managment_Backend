import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles : string[]) =>   async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No token recieved");
      }

      const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

      console.log("v_token", verifiedToken);
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, `you are not permited to view this route !!`);
      }
      console.log("v_token next", verifiedToken);
    req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  }