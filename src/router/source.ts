import { getId } from "@/util/music"
import { createError, eventHandler, readBody } from "h3"
import * as music from "@/util/music"
import got from 'got'
import crypto from "crypto"
import fs from "fs/promises"
import path from "path"
import { tryCatch } from "@/util/tryCatch"
import { config } from "@/config"
import { sourceList } from "@/service/source/manager"
import { logger } from "@/service/logger"

// 限速，同一首歌，1小时内，请求失败不能超过2次，超出直接失败

export default eventHandler(async (event) => {
    const body = await readBody(event)
    const { source, action, info: { musicInfo, type } } = body
    const songmid = getId(source, musicInfo)
    logger.info("Request", action, source, songmid)
    switch (action) {
        case "musicUrl": {
            if (!music.source.includes(source)) throw createError({ statusCode: 400, statusMessage: "Invalid music source: " + source })
            if (
                (await tryCatch(
                    fs.access(path.join("file/music/", source, String(songmid)))
                )).error === null
            ) {
                return {
                    url: config.server + "file/music/" + source + "$" + songmid
                }
            }
            switch (songmid) {
                case "/storage/emulated/0/ 我的文件/義妹生活 OST/义妹生活OST1.mp3":
                    return { url: config.server + "file/music/" + source + "$gimaiseikatsuOST01.flac" }
                case "/storage/emulated/0/ 我的文件/義妹生活 OST/义妹生活OST2.wav":
                    return { url: config.server + "file/music/" + source + "$gimaiseikatsuOST02.flac" }
                case "/storage/emulated/0/ 我的文件/義妹生活 OST/义妹生活OST3.mp3":
                    return { url: config.server + "file/music/" + source + "$gimaiseikatsuOST03.flac" }
                case "/storage/emulated/0/ 我的文件/義妹生活 OST/义妹生活OST4.wav": 
                    return { url: config.server + "file/music/" + source + "$gimaiseikatsuEP04.flac" }
                case "D:\\Music\\Be What You Wanna Be.mp3":
                    return { url: config.server + "file/music/" + source + "$BeWhatYouWannaBe.mp3" }
            }
            if (source === "local") throw createError({ statusCode: 404, statusMessage: "Local music not found" })
            logger.info("Fetch", source, songmid)
            for (const source of sourceList) {
                logger.info("Fetch on", source.name)
                try {
                    const url = await source.request(body)
                    logger.info("Fetch", source.name, "success", url)
                    return { 
                        state: "success",
                        url
                    }
                } catch (e) {
                    logger.info("Fetch", source.name, "failed")
                    logger.info(e)
                }
            }
            return { state: "error", errmsg: "No source available" }
        }
        case "pic": {
            switch (songmid) {
                case "/storage/emulated/0/ 我的文件/義妹生活 OST/义妹生活OST1.mp3":
                case "/storage/emulated/0/ 我的文件/義妹生活 OST/义妹生活OST2.wav":
                case "/storage/emulated/0/ 我的文件/義妹生活 OST/义妹生活OST3.mp3":
                    return { url: config.server + "file/cover/gimaiseikatsuOST01.png" }
                case "/storage/emulated/0/ 我的文件/義妹生活 OST/义妹生活OST4.wav": 
                    return { url: config.server + "file/cover/gimaiseikatsuEP04.png" }
            }
        }
        case "lyric": {

        }
    }
})

const gettingQueue = new Array() as (() => Promise<any>)[]

const addGettingQueue = async <T>(func: () => Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
        gettingQueue.push(() => func().then(resolve).catch(reject))
        handleGettingQueue()
    })
}

const handleGettingQueue = async () => {
    if (gettingQueue.length !== 1) return
    while (gettingQueue.length > 0) {
        const func = gettingQueue[0]
        await func()
        await new Promise(resolve => setTimeout(resolve, 2500))
        gettingQueue.shift()
    }
}