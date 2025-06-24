import * as music from "@/util/music"
import fs from "fs/promises"
import { createError, eventHandler } from "h3"
import path from "path"

const musicIdRepExp = /^[a-zA-Z0-9$.]{0,32}$/
const coverIdRepExp = /^[a-zA-Z0-9.]{0,32}$/

export default eventHandler(async (event) => {
    const requestType = event.context.params?.type

    switch (requestType) {
        case "music": {
            const file = event.context.params?.file
            if (!musicIdRepExp.test(file)) throw createError({ statusCode: 400, statusMessage: "Invalid music id: " + file })
            const [ source, songmid ] = file.split("$", 2)
            if (!music.source.includes(source)) throw createError({ statusCode: 400, statusMessage: "Invalid music source: " + source })
            try {
                return await fs.readFile(path.join("file/music/", source, songmid))
            } catch (e) {
                if (e.case !== "ENOENT") console.error(e)
                throw createError({ statusCode: 404, statusMessage: "Music not found: " + file })
            }
        }
        case "cover": {
            const file = event.context.params?.file
            if (!coverIdRepExp.test(file)) throw createError({ statusCode: 400, statusMessage: "Invalid music id: " + file })
            try {
                return await fs.readFile(path.join("file/cover/", file))
            } catch (e) {
                if (e.case !== "ENOENT") console.error(e)
                throw createError({ statusCode: 404, statusMessage: "Music not found: " + file })
            }
        }
        default: throw createError({
            statusCode: 404,
            statusMessage: "Not Found"
        })
    }
})
