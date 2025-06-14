// @ts-check

import { getId } from "@/service/music.ts"
import axios from "axios"
import { eventHandler, readBody } from "h3"
import * as music from "@/service/music.ts"
// import request from "superagent"
import got from 'got'
import crypto from "crypto"
import fs from "fs/promises"
import nodePath  from "path"


let count = 0

export default eventHandler(async (event) => {
    // count++
    // if (count > 1) return

    const body = await readBody(event)
    
    const { source, action, info: { musicInfo, type } } = body
    
    const musicFile = await music.has(source, getId(source, musicInfo))
    console.log(source, getId(source, musicInfo))
    if (musicFile !== false) {
        return {
            state: "success",
            url: "http://192.168.31.226:23111/file/music/"+musicFile.fileid
        }
    }
    
    const headers = {
        'User-Agent': 'lx-music/' + (Math.random()>-1 ? "desktop" : "mobile"),
        'ver': "2.0.0",
        'source-ver': "1.0.0",
        "accept-encoding": undefined,
        "accept": "*/*",
    }

	// if (action != 'musicUrl') {
	// 	throw Error("fialed")
	// }

    const path = '/url/' + source + '/' + getId(source, musicInfo) + '/' + type

    Reflect.set(
        headers,
        "tag",
        Buffer.from(
            Buffer.from(
                JSON.stringify(
                    path.match(/(?:\d\w)+/g),
                    null,
                    1
                )
            ),
            "binary"
        )
        .toString("hex")
    )
    try {
        const req = got
            .get(
                'http://flower.tempmusics.tk/v1' + path,
                {
                    headers,
                    decompress: false
                }
            )
            
        const resp = await req
        const body = JSON.parse(resp.body)
        console.log(body)
        if (0 !== body.code) {
            throw Error(body.msg)
        }
        const url = body.data
        console.log(url)
        const musicData = (await got.get(url)).rawBody
        console.log(musicData)
        const musicFileName = crypto.createHash('sha256').update(musicData).digest('hex')
        fs.writeFile(nodePath.join("file/music/", musicFileName), musicData)
        music.set(source, getId(source, musicInfo), musicFileName)
        console.log(musicFileName)
        return {
            state: "success",
            url
        }
    } catch (e) {
        return {
            state: "error",
            msg: e.message
        }
    }
})
