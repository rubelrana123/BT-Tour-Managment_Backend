import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validayeRequest } from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
const router = Router();
 
router.post(
  "/register",
  validayeRequest(createUserZodSchema),
  userControllers.createUser
);
router.get(
  "/",
 checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUsers
);
router.patch("/:id",
  validayeRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)), userControllers.updateUser)
export const userRoutes = router;
