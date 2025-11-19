import express from "express";
import fileRoutes from "./file.route.js";
import serverUtilityRoutes from "./utility.route.js";

const router = express.Router();

router.use("/file", fileRoutes);
router.use("/utility", serverUtilityRoutes);

export default router;
