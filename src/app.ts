import express, { NextFunction, Request, Response } from "express";
import cors from "cors"
import { router } from "./app/routes";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/golbalErrorHandler";
import { notFoundError } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import  expressSession  from "express-session";
import "./app/config/passport";
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(expressSession({
    secret : "Your Secret",
    resave : false,
    saveUninitialized : false

}))
app.use(cors())
app.use(passport.initialize());
app.use(passport.session())

// app.use("/api/v1/", userRoutes)
app.use("/api/v1/", router)

app.get("/", (req: Request, res : Response) =>{
    res.status(200).json({
        message : "Wellcome to BT tour managment server"
    })

})
app.use(globalErrorHandler)  ;
app.use(notFoundError)
export default app;