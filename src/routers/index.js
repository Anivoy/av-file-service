import express from "express";
import serverUtilityRoutes from "./utility.route.js";

const router = express.Router();

router.use("/utility", serverUtilityRoutes);

export default router;
