import User from "../models/user.js";
import FriendRequest from "../models/friendrequest.js";
import mongoose from "mongoose";

// --- 1. Get recommended users ---
export async function getRecommendation(req, res) {
  try {
    const currentUserID = req.user._id;
    const currentUser = await User.findById(currentUserID).populate("friends");

    const friendIds = currentUser.friends.map(friend => friend._id);

    const sentRequests = await FriendRequest.find({
      sender: currentUserID,
      status: "pending"
    });

    const requestedUserIds = sentRequests.map(request => request.recipient);

    const recommendedUsers = await User.find({
      _id: {
        $ne: currentUserID,
        $nin: [...friendIds, ...requestedUserIds]
      },
      isOnBoard: true
    }).select("-password");

    return res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// --- 2. Get my friends ---
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'fullName profilePic location') // Populate with needed fields
      .select('friends');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the populated friends array
    return res.status(200).json(user.friends || []);
  } catch (error) {
    console.error("Error getting friends:", error);
    return res.status(500).json({ message: "Error fetching friends" });
  }
}

// --- 3. Send a friend request ---
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id;
    const { id: recipientID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipientID)) {
      return res.status(400).json({ message: "Invalid recipient ID" });
    }

    if (myId.equals(recipientID)) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const [recipient, isAlreadyFriend] = await Promise.all([
      User.findById(recipientID),
      User.findOne({ _id: myId, friends: recipientID })
    ]);

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (isAlreadyFriend) {
      return res.status(400).json({ message: "Already friends with this user" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientID },
        { sender: recipientID, recipient: myId }
      ],
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientID,
      status: "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
      friendRequest
    });
  } catch (error) {
    console.error("Error in sendFriendRequest:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// --- 4. Accept a friend request ---
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (!friendRequest.recipient.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await Promise.all([
      User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipient }
      }),
      User.findByIdAndUpdate(friendRequest.recipient, {
        $addToSet: { friends: friendRequest.sender }
      })
    ]);

    return res.status(200).json({
      success: true,
      message: "Friend request accepted successfully",
      friendRequest
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// --- 5. Get friend requests ---
export async function getFriendRequests(req, res) {
  try {
    const [incoming, accepted] = await Promise.all([
      FriendRequest.find({
        recipient: req.user._id,
        status: "pending"
      }).populate("sender", "fullName profilePic location"),
      FriendRequest.find({
        $or: [
          { sender: req.user._id, status: "accepted" },
          { recipient: req.user._id, status: "accepted" }
        ]
      }).populate("sender recipient", "fullName profilePic location")
    ]);

    return res.status(200).json({ incoming, accepted });
  } catch (error) {
    console.error("Error in getFriendRequests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// --- 6. Get outgoing friend requests ---
export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoing = await FriendRequest.find({
      sender: req.user._id,
      status: "pending"
    }).populate("recipient", "fullName profilePic location");

    return res.status(200).json(outgoing);
  } catch (error) {
    console.error("Error in getOutgoingFriendRequests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function updateProfile(req, res) {
  try {
    const { fullName, bio, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, bio, profilePic },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
}


