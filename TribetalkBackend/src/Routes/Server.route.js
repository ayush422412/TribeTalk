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


const router = Router()

//secured routes
router.route("/create-server").post(verifyJWT,  createServer)
router.route("/list-all-server").get(verifyJWT,  listServers)
router.patch("/edit-server/:id", verifyJWT, editServer)
router.route("/delete-server/:id").delete(verifyJWT,  deleteServer)

router.get("/single-server/:id", verifyJWT, getServerInfo); // Get full server info
router.post("/join-server/:id", verifyJWT, joinServer)


export default router