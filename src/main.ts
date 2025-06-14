import { createApp, createRouter, eventHandler, readBody, send, setHeader, setResponseHeader, toNodeListener } from "h3"
import { log } from "node:console"
import { createServer } from "node:http"
import { router } from "@/router/"

const app = createApp()
app.use(router)




createServer(toNodeListener(app)).listen(23111)
log("服务已启动于：http://localhost:23111");
