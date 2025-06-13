import { createRouter } from "h3"
import getSourceFile from "@/router/getSourceFile"
import api from "@/router/api"
import getFile from "@/router/getFile"
import needle from "needle"

export const router = createRouter()

router.use("/api-source", getSourceFile)
router.post("/api", api)
router.get("/file/:file", getFile.music)


        // const musicData = (await needle("get", "http://lw.sycdn.kuwo.cn/98460818ed40d71448ecef0f13e0e4b2/684c8160/resource/30106/trackmedia/M5000024jKvc0YSxBl.mp3"))