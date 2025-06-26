import { createApp, sendWebResponse, toNodeListener } from "h3"
import { log } from "node:console"
import { createServer } from "node:http"
import { router } from "@/router"
import { loadConfig, config } from "@/config"
import { loadAllSource, sourceList } from "@/service/manager"
import { mkdir } from "node:fs/promises"
import { UrlUtil } from "@ceale/util"

await Promise.all([
    "file/cover/",
    "file/music/kg/",
    "file/music/kw/",
    "file/music/tx/",
    "file/music/wy/",
    "file/music/mg/",
    "file/music/local/",
    "source/"
].map(path => mkdir(path, { recursive: true })))

await loadConfig()

const app = createApp({
    async onError(error, event) {
        let statusText
        let message
        switch (error.statusCode) {
            case 404:
                statusText = statusText ?? "Not Found"
            case 403:
                statusText = statusText ?? "Forbidden"
            case 401:
                statusText = statusText ?? "Unauthorized"
            case 400:
                statusText = statusText ?? "Bad Request"
            case 500:
                statusText = statusText ?? "Server Internal Error"
                message = message ?? error.message
                break
            default:
                statusText = message = statusText ?? "Server Internal Error"
        }
        await sendWebResponse(event, new Response(message, { status: error.statusCode, statusText }))
    }
})

await loadAllSource()
app.use(router)
createServer(toNodeListener(app)).listen(config.server.port)
log(`服务已启动于：http://${config.server.host}:${config.server.port}/`)
log(`音乐源地址：${UrlUtil.join(`http://${config.server.host}:${config.server.port}/`, "/api-source")}`)