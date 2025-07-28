// user ==> booking(pending) ==> payment(unpaid) =>
//  SSL E-commerce =>booking status changed - confirm ==> 
// payment status change - paid 

import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export interface IPAYMENT {
    booking : Types.ObjectId,
    transactionId : string,
    amount : number,
    paymentGateway? : any,
    invoiceUrl? : string,
    status :  PAYMENT_STATUS
}