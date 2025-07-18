import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/appError";
import { any } from "zod";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { User } from "./user.model";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

//demo
// const createUserFunction =async (req : Request, res : Response, next : NextFunction) 
// => {
//             const user = await UserServices.createUser(req.body)
//          res.status(201).json({
//             message : "user create successfuly",
//             user
//         })

// }

// type AsyncHandler = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => Promise<void>;
// const catchAsync =
//   (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch((err: any) => {
//       console.log(err);
//       next(err);
//     });
//   };
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
     const user = await UserServices.createUser(req.body);
     sendResponse(res, {
        success : true,
        statusCode : 201,
        message : "user create successfully",
        data : user, 

     })
  }
);

// type AsyncHandler = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => Promise<void>;
// export const catchAsync =
//   (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch((err: any) => {
//       console.log(err);
//       next(err);
//     });
//   };
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
   //  const token = req.headers.authorization
   //  const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload )
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User Updated Successfully",
        data: user,
    })
})
const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
     const result = await UserServices.getAllUsers();
     sendResponse(res, {
        success : true,
        statusCode : 200,
        message : "all user retrived successfully",
        data : result.data, 
        meta : result.meta
    

     })

})

export const userControllers = {
  createUser,
  getAllUsers,
  updateUser
};

//route matching  => controller =>> service => model
