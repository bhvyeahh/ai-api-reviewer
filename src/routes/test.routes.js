import express from "express";
import { testHandler } from "../controllers/test.controller.js";

const router = express.Router();

router.get("/", testHandler);

export default router;
