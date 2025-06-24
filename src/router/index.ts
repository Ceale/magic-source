import { createRouter } from "h3"
import source from "./source"
import getFile from "./getFile"
import getSourceFile from "./getSourceFile"

export const router = createRouter()

router.use("/api-source", getSourceFile)
router.use("/api/source", source)
router.use("/file/:type/:file", getFile)