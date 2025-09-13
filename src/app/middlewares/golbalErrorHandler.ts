import { envVars } from "../config/env";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import mongoose from "mongoose";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handlerZodError } from "../helpers/handleZodError";
import { handleCastError } from "../helpers/handleCastError";
import { handlerValidationError } from "../helpers/handleValidationError";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("error from golbal", err);
  }


  /* 
  mongoose ==> caseError, duplicate error, validation error 
  */
  let statusCode = 500;
  let message = `something went wrong !!`;
  let errorSources: any = [];
   
    if (req.file) {
        await deleteImageFromCloudinary(req.file.path)
    }
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
       const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)
       await Promise.all(imageUrls.map(url =>   deleteImageFromCloudinary(url)))
    }

  if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Object ID error / Cast Error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }

  //Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = handlerValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources;
    message = simplifiedError.message;
  }
   else if (err.name === "ZodError") {
    const simplifiedError = handlerZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    (statusCode = 500), (message = err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,

    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
