import { model, Schema } from "mongoose";
import { IPAYMENT, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPAYMENT>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique : true
    },
    transactionId : {
      type: String,
      required: true,
      unique : true

    },
    amount: {
      type: Number,
      required: true,
    },
    status : {
        type : String,
        enum : Object.values(PAYMENT_STATUS),
        default : PAYMENT_STATUS.UNPAID
    },
    paymentGateway :{
        type : Schema.Types.Mixed
    },
    invoiceUrl : {
        type : String, 
    }
  },
  {
    timestamps: true,
  }
);


export const Payment = model<IPAYMENT>("Payment", paymentSchema)