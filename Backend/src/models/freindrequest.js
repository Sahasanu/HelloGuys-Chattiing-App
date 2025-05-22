import mongoose from "mongoose";

const freindrequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    recipients: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    status: {
        type: String,
        enum: ["pending", accepted],
        default:"pending"
    },
   
},
    { timestamps: true }
);


const freindrequest = mongoose.model("freindrequest", freindrequestSchema);
export default freindrequest;
