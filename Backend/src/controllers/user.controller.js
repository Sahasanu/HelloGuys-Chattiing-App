import User from "../models/user.js"
import freindrequest from "../models/freindrequest.js"



export async function getrecomendation(req, res) {
    try {
        const currentUser = req.user.id;
        const currentuser = req.user

        const recomdeduser = await User.find({
            $and: [

                { _id: { $ne: currentUser } },  // exxlude current user
                { $id: { $nin: currentUser.friends } }, //exclude current user's freind
                { isonborad: true }

            ]
        })
        res.send(200).json(recomdeduser)
    } catch (error) {

    }





}
export async function getmyfreinds(req, res) {

    try {
        const user = await User.findById(req.user._id).select("freinds").populate("freinds", "fullname profilepic ")
        return res.status(200).json(user.friends)
    } catch (error) {
        console.log('Error in getmyfreinds');
        return res.status(400).json("Internal Server error")

    }



}

export async function freindrequests(req, res) {
    try {
        const myid = req.user.id;
        const { id: recipientID } = req.params;

        if (myid === recipientID) {
            return res.status(400).json("You cannot send a freind request to yourself")

        }
        const recipient = await User.findById(recipientID);
        if (!recipient) {
            return res.status(400).json("Recipient not found")
        }
        if (recipient.friends.includes(myid)) {
            return res.status(400).json("You are already freinds with this user")
        }
        if (recipient.friendsrequest.includes(myid)) {
            return res.status(400).json("You have already sent a freind request to this user")
        }

        const exisitingRequest = await User.findOne({
            $or: [
                { sender: myid, recipient: recipientID },
                { sender: recipientID, recipient: myid }
            ]
        })
        if (exisitingRequest) {
            return res.status(400).json("Freind request already sent")

        }
        const freindrequest = await freindrequest.create(
            {
                sender: myid,
                recipient: recipientID
            }

        )
        res.status(201).json({
            success: true,
            message: "Freind request sent successfully",
            freindrequest
        }
        )

    } catch (error) {
        console.log('Error in freindrequest');
        return res.status(400).json("Internal Server error")

    }
}

export async function acceptfreindrequest(req, res) {
    try {
        const { id: recipientID } = req.params;
        const freindrequest = await freindrequest.findById(recipientID);
        if (!freindrequest) {
            return res.status(400).json("Freind request not found");
        }

        if (freindrequest.recipient.toString() !== req.user.id) {
            return res.status(400).json("You are not the recipient of this freind request");
        }
        freindrequest.status = "accepted";
        await freindrequest.save();

        // add ech user to other's freind list
        const sender = await User.findById(freindrequest.sender);
        const recipient = await User.findById(freindrequest.recipient);
        sender.friends.push(recipient._id);
        recipient.friends.push(sender._id);
        res.status(200).json({
            success: true,
            message: "Freind request accepted successfully",
            freindrequest
        });
    }

    catch (error) {
        console.log('Error in acceptfreindrequest');
        return res.status(400).json("Internal Server error")
    }
}

export async function getfreindrequest(req, res) {
    try {
        const incomingfreindrequest = await freindrequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullname profilepic")
   
   const acceptedrequest = await freindrequest.find({
        sender: req.user.id,
        status: "accepted"
    }).populate("recipient", "fullname profilepic")
   
   res.status(200).json({
    incomingfreindrequest,
    acceptedrequest
   })
   
   
   
   
   
   
    } catch (error) {
        console.log('Error in getfreindrequest');
        return res.status(400).json("Internal Server error")

    }
}

export  async function  getoutgoingfreindrequest(req, res) {
    try {
        const outgoingfreindrequest = await freindrequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullname profilepic")
        res.status(200).json(outgoingfreindrequest)
    } catch (error) {
        console.log('Error in getoutgoingfreindrequest');
        return res.status(400).json("Internal Server error")

    }
}