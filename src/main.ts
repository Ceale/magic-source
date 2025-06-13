import { createApp, createRouter, eventHandler, readBody, send, setHeader, setResponseHeader, toNodeListener } from "h3"
import { log } from "node:console"
import { createServer } from "node:http"
import { router } from "@/router"
import got from 'got'
import { Agent } from "node:http"

const app = createApp()
app.use(router)




createServer(toNodeListener(app)).listen(23111)
log("服务已启动于：http://localhost:23111");

(async () => {
    // const req = await needle("get", 'http://www.baidu.com/', {
    //     headers: {},
        
    // }) 
    // Bun.http
    // fetch('https://www.baidu.com/', {
    //     headers: {
    //         "Accept-Encoding": null,
    //         "Connection": "close"
    //     },
    //     keepalive: false
    // })
    // got.get('https://www.baidu.com/', {
    //     headers: {
    //         "Accept-Encoding": undefined,
    //         "Connection": "close"
    //     },
    //     decompress: false,
    //     // createConnection: 
    //     // keepalive: false
    // })
    // got.get('http://lw.sycdn.kuwo.cn/98460818ed40d71448ecef0f13e0e4b2/684c8160/resource/30106/trackmedia/M5000024jKvc0YSxBl.mp3', {
    //     headers: {
    //         "Accept-Encoding": undefined,
    //         "Connection": "close"
    //     }, 
    //     decompress: false,
    //     agent: {
    //         http: new Agent({
    //             keepAlive: false
    //         }) 
    //     }
    //     // keepalive: false,
    //     // createConnection: 
    //     // keepalive: false
    // })
    // 
    // console.log(axios.defaults.baseURL)
    // setTimeout(async () => {
    // }, 1000)
})()
