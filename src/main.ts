import { createApp, sendWebResponse, toNodeListener } from "h3"
import { log } from "node:console"
import { createServer } from "node:http"
import { router } from "@/router"
import * as config from "@/config"

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
app.use(router)
createServer(toNodeListener(app)).listen(config.port)
log(`服务已启动于：${config.server}`);