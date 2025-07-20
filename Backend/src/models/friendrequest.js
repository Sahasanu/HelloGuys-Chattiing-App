import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Should match your User model name exactly
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"], // Added rejected status
    default: "pending"
  },
}, { timestamps: true });

// Add indexes for better performance
friendRequestSchema.index({ sender: 1, recipient: 1 });
friendRequestSchema.index({ status: 1 });

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;