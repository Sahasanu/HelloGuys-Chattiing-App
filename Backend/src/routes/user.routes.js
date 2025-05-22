import express from "express";
import { protectroute } from "../middleware/middleware.js";
import {getmyfreinds, getrecomendation,freindrequests,acceptfreindrequest,getfreindrequest, getoutgoingfreindrequest} from "../controllers/user.controller.js"
const router = express.Router ();

router.use(protectroute)

router.get("/" ,getrecomendation)
router.get("/freinds",getmyfreinds)
router.get("/freinds-request/:id",freindrequests)
router.get("/freinds-request/:id/accept",acceptfreindrequest)
router.get("/freinds-request",getfreindrequest)
router.get("/outgoing-freinds-request",getoutgoingfreindrequest)


export default router