import express from "express";
import { protectroute } from "../middleware/middleware";
import {getmyfreinds, getrecomendation,freindrequest,acceptfreindrequest,getfreindrequest, getoutgoingfreindrequest} from "../controllers/user.controller"
const router = express.Router ();

router.use(protectroute)

router.get("/" ,getrecomendation)
router.get("/freinds",getmyfreinds)
router.get("/freinds-request/:id",freindrequest)
router.get("/freinds-request/:id/accept",acceptfreindrequest)
router.get("/freinds-request",getfreindrequest)
router.get("/outgoing-freinds-request",getfreindrequest)
 export default router