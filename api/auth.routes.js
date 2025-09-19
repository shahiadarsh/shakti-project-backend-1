import { Router } from "express";
import { directLoginOrSignup } from "../controllers/auth.controller.js";

const router = Router();

// A single route for both login and signup
router.post("/login", directLoginOrSignup);

export default router;