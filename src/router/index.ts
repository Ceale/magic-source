import { createRouter } from "h3"
import api from "./api"
import getFile from "./getFile"
import getSourceFile from "./getSourceFile"

export const router = createRouter()

router.use("/api-source", getSourceFile)
router.use("/api/source", api)
router.use("/file/:type/:file", getFile)