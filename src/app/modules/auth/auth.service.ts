import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { generateToken, verifyToken } from "../../utils/jwt";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userToken";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email }); 

  if (!isUserExist) {
    throw new AppError(401, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(401, "Incorrect Password");
  }
  // const jwtPayload ={
  //     userId : isUserExist._id,
  //     email : isUserExist.email,
  //     role : isUserExist.role
  // }
  // const accessToken =generateToken (jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
  // // const accessToken = jwt.sign(jwtPayload, "secret",{
  // //     expiresIn : "1d"
  // // })
  // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_ACCESS_EXPIRES)
  // console.log("accesstoke after generate", accessToken)
  const userTokens = createUserToken(isUserExist);

  const userObject = isUserExist.toObject();
  delete userObject.password;
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: userObject,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
//   const verifiedRefreshToken = verifyToken(
//     refreshToken,
//     envVars.JWT_REFRESH_SECRET
//   ) as JwtPayload;

//   const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

//   if (!isUserExist) {
//     throw new AppError(400, "User does not exist");
//   }
//   if (
//     isUserExist.isActive === IsActive.BLOCKED ||
//     isUserExist.isActive === IsActive.INACTIVE
//   ) {
//     throw new AppError(400, `User is ${isUserExist.isActive}`);
//   }
//   if (isUserExist.isDeleted) {
//     throw new AppError(400, "User is deleted");
//   }

//   const jwtPayload = {
//     userId: isUserExist._id,
//     email: isUserExist.email,
//     role: isUserExist.role,
//   };
//   const accessToken = generateToken(
//     jwtPayload,
//     envVars.JWT_ACCESS_SECRET,
//     envVars.JWT_ACCESS_EXPIRES
//   );
//user - login - token (email, role, _id) - booking / payment / booking / payment cancel - token

const newAccessToken =await createNewAccessTokenWithRefreshToken(refreshToken as string)
  return { accessToken : newAccessToken };
};
const resetPassword = async (oldPassword : string, newPassword : string, decodedToken : JwtPayload) => {
  const user = await User.findById(decodedToken.userId)
  const isOldPasswordMatch =  await bcryptjs.compare(
    oldPassword as string,
    user!.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(401, "Old password does not match")
    
  }
  user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
  user!.save()
 
  
};
export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword
};
/*  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  ); */