import { runInNewContext } from "node:vm"
import { createApp, createRouter, eventHandler, readBody, setHeader, toNodeListener } from "h3"
import { createServer } from "node:http"
import needle from 'needle'
import { readFile } from "node:fs/promises"
import crypto from "node:crypto"
import { promisify } from "node:util"
import zlib from "node:zlib"
import EventEmitter from "node:events"
import { EVENT_NAMES, loadSource } from "./source"
import { log } from "node:console"

console.clear()

export const mainEventEmitter = new EventEmitter()


const sourceRawScript = await readFile("source/野花音源.js", "utf-8")

const source = await loadSource(sourceRawScript)
source.on(EVENT_NAMES.inited, () => {
    console.log("音乐源已初始化")
})

const app = createApp()
const router = createRouter()
app.use(router)

const handlerList = new Array()

let once = false
router.use("/", eventHandler(async (event) => {
    // if (once) return
    once = true
    const eventData = await readBody(event)
    // console.log("请求数据:", typeof eventData, eventData.source)
    const handler = source.listeners(EVENT_NAMES.request)[0]
    // const a = await handler(eventData)
    // console.log(a)
    handlerList.push(() => handler(eventData))
    // if (typeof handlerList[0] === "function") {
    //     const result = handlerList[0](eventData)
    //     try {
    //         console.log(await result)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
}))

setInterval(async () => {
    if (handlerList.length > 0) {
        const handler = handlerList.shift()
        const a = await handler()
        console.log(a)
    }
}, 1500)

router.use("/api-source", eventHandler(async (event) => {
    const scriptText = await readFile("test.js", "utf8")
    await setHeader(event, 'Content-Type', 'text/javascript; charset=utf-8')
    return scriptText
}))

createServer(toNodeListener(app)).listen(23111)
log("服务已启动于：http://localhost:23111")