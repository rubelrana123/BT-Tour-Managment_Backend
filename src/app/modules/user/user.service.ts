import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
const createUser = async(payload : Partial<IUser>) =>{
        const { email,password, ...rest} = payload;
       const isEmailExits = await User.findOne({email});
    //    if(isEmailExits )  {throw new AppError(505,"User already exits")};
       const hashPassword = await bcryptjs.hash( password as string, 10 );
       const authProvider : IAuthProvider = {provider : "credentials", providerId : email!}
       
          const user = await User.create({
                email,
                password : hashPassword,
                auths : [authProvider],
                ...rest
            })
            return user

}


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(404, "User Not Found")
    }

    /**
     * email - can not update
     * name, phone, password address
     * password - re hashing
     *  only admin superadmin - role, isDeleted...
     * 
     * promoting to superadmin - superadmin
     */
  //validation chekc
    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(403, "You are not authorized");
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(403, "You are not authorized");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError( 403, "You are not authorized");
        }
    }
  //password encrypt for update
    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

const getAllUsers = async(query : Record<string, string>) =>{
    // const users = await User.find({});
    //   const totalUsers = await User.countDocuments();
     const queryBuilder = new QueryBuilder(User.find(), query)
    
        const tours =  queryBuilder
            .search(userSearchableFields)
            .filter()
            .sort()
            .fields()
            .paginate();
    
        const [data, meta] = await Promise.all([
            tours.build(), 
            queryBuilder.getMeta()
        ])
    
        return {
            data: data,
            meta:  meta
        }
    // return  {
    //     data : users,
    //       meta : {
    //         total : totalUsers
    //     }
    // }

}

export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
}