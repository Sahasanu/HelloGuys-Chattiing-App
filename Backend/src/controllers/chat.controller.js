 import {generateStreamToken} from "../lib/stream.js"
 
 export async function getstreamToken(req, res) {
     try {
        const token = generateStreamToken (req.user.id);
        res.status(200).json({
            token: token,
            userId: req.user.id
        }) 

     } catch (error) {
        console.log('Error in generating stream token', error);
        return res.status(500).json({
            message: "Internal server error"
        })
     }





 }
