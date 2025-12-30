import { Router } from "express";
import { importWishes, getUserWishes, getUserPityStats } from "../controllers/wish.controller";

const router = Router();

router.get("/:userGameId", getUserWishes);
router.get("/:userGameId/pityStats", getUserPityStats);
router.post("/:userGameId/import", importWishes);

export default router;