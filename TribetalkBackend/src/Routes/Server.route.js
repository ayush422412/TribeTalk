import { Router } from "express";
import { 
    createServer,
    deleteServer,
    listServers,
    editServer,
    getServerInfo,
    joinServer
} from "../Controllers/Server.controller.js";
import { verifyJWT } from "../Middlewares/Auth.middleware.js";

const router = Router();

// All server routes require authentication
router.use(verifyJWT);

router.route("/create-server").post(createServer);
router.route("/list-all-server").get(listServers);
router.patch("/edit-server/:id", editServer);
router.delete("/delete-server/:id", deleteServer);

router.get("/single-server/:id", getServerInfo);
router.post("/join-server/:id", joinServer);

export default router;