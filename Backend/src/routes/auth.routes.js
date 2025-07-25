import express from "express";
const router = express.Router();
import { signup, login, logout ,onboard,changePassword,deleteAccount } from '../controllers/auth.controller.js';
import { protectroute } from "../middleware/middleware.js";


router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout );
router.post("/onboard",protectroute,onboard);
router.get("/me", protectroute, (req, res) => {
  res.status(200).json({success:true, user: req.user})
}
)
router.put("/change-password",protectroute, changePassword);
router.delete("/delete-account",protectroute, deleteAccount);


export default router;
