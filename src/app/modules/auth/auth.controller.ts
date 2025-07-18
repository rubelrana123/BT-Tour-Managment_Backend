import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { AuthToken, setAuthCookie } from "../../utils/setCookie";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import app from "../../../app";
 

const credentialsLogin = catchAsync(async(req: Request, res: Response, next : NextFunction ) => {
    //  const loginInfo = await AuthServices.credentialsLogin(req.body);
    passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) {
            return next(err);     
            // return next(new AppError(401,"authentication errror")) 
            // return new AppError(401,"authentication errror")
        }
        if (!user) {
            // return next(err);     

            return next(new AppError(401,info.message))
            
        }

    const userTokens =   createUserToken(user);
      const userObject = user.toObject();
       delete userObject.password;
      setAuthCookie(res,userTokens)
        sendResponse(res, {
        success : true,
        statusCode : 200,
        message : "User login successfully",
        // data : loginInfo,  
        data : {
            accessToken : userTokens.accessToken,
            refreshToken : userTokens.refreshToken,
            user : userObject
        }
    

     })
    })(req, res,next)
//    res.cookie("refreshToken", loginInfo.refreshToken, {
//      httpOnly : true,
//      secure : false
//    });
//      res.cookie("accessToken", loginInfo.accessToken, {
//      httpOnly : true,
//      secure : false
//    })
    //  setAuthCookie(res,loginInfo)
    //  sendResponse(res, {
    //     success : true,
    //     statusCode : 200,
    //     message : "User login successfully",
    //     data : loginInfo,  
    

    //  })

});
const getNewAccessToken = catchAsync(async(req: Request, res: Response ) => {
    const refreshToken = req.cookies.refreshToken;
    //  const refreshToken  = req.headers.authorization;
     if (!refreshToken) {
           throw new AppError(404,"refresh token not found");
         
        
     }
 const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);
//      res.cookie("accessToken", tokenInfo.accessToken, {
//      httpOnly : true,
//      secure : false
//    })
     setAuthCookie(res,tokenInfo)

     sendResponse(res, {
        success : true,
        statusCode : 200,
        message : "new access token retrived successfully",
        data : tokenInfo,  
    

     })

})

const logout = catchAsync(async(req: Request, res: Response ) => {
    res.clearCookie("accessToken",{
        httpOnly : true,
        secure : false,
        sameSite : "lax"
    });
        res.clearCookie("refreshToken",{
        httpOnly : true,
        secure : false,
        sameSite : "lax"
    })
  
     sendResponse(res, {
        success : true,
        statusCode : 200,
        message : "User logout successfully",
        data :  null,  
    

     })

})

const resetPassword = catchAsync(async(req: Request, res: Response ) => {
   const decodedToken = req.user;
   const newPassword = req.body.newPassword;
   const oldPassword = req.body.oldPassword;

   await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)
     sendResponse(res, {
        success : true,
        statusCode : 200,
        message : "Reset password successfully",
        data :  null,  
    

     })

})

 const googleCallbackController = catchAsync(async(req: Request, res: Response ) => {
     
     const user = req.user;
    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    // /booking => booking , => "/" => "" 
     console.log("google user", user)
     if (!user) {
        throw new AppError(404,"not user found")
        
     }
     const tokenInfo =   createUserToken(user);
     setAuthCookie(res, tokenInfo)
     res.redirect(`${envVars.FRONT_END_URL}/${redirectTo}`)
 

})
export const authControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}