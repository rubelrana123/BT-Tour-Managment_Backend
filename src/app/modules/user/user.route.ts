import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
const router = Router();
//  export const validateRequest= (zodSchema  : 
// AnyZodObject) => async (req : Request, res : Response, next : NextFunction) =>{
//     try {
//       req.body = await zodSchema.parseAsync(req.body)
//      console.log(req.body)
//      next()
  
     
//     } catch (error) {
//      next(error)
     
//     }
//  } 

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
// export const checkAuth = (...authRoles : string[]) =>   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//recive acccess token like a id card
//       const accessToken = req.headers.authorization;
//       if (!accessToken) {
//         throw new AppError(403, "No token recieved");
//       }
//verify id card
//       const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

//       console.log("v_token", verifiedToken);
//       if (!authRoles.includes(verifiedToken.role)) {
//         throw new AppError(403, `you are not permited to view this route !!`);
//       }
//       console.log("v_token next", verifiedToken);
//     req.user = verifiedToken;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   }
router.get(
  "/",
 checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUsers
);
router.patch("/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)), userControllers.updateUser)
export const userRoutes = router;
