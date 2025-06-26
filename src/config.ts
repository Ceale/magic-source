import { UrlUtil } from "@ceale/util"
import { readFile } from "fs/promises"

export let config = null as {
    server: {
        host: string
        port: number
    }
    source: {
        debug: boolean
        name: string
        description: string
    }
}

export const loadConfig = async () => {
    // config = (await import(UrlUtil.join(process.cwd(), "config.json"), { with: { type: "json" }})).default
    config = JSON.parse(await readFile(UrlUtil.join(process.cwd(), "config.json"), "utf8"))
}