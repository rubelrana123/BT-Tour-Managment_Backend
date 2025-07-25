import { model, Schema } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
        payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    
    },
    status : {
        type : String,
        enum : Object.values(BOOKING_STATUS)
    },
    // console.log(Object.values(BOOKING_STATUS));
    // Expected output: Array ["FAILED","COMPLETE" PENDING, CANCEL]
    guestCount : {
        type : Number,
        required : true
    }
  },
  {
    timestamps: true,
  }
);


export const Booking = model<IBooking>("Booking", bookingSchema)