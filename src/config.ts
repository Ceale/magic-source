import { UrlUtil } from "@ceale/util"

export let config = null as {
    server: {
        host: string
        port: number
    }
}

export const loadConfig = async () => {
    config = (await import(UrlUtil.join(process.cwd(), "config.json"), { with: { type: "json" }})).default
}