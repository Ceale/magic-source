import packageJson from "@/../package.json" with { type: "json" }
import sourceScript from "@/source.js" with { type: "text" }
import { eventHandler, readBody, setHeader } from "h3"
import { config } from "@/config"
import crypto from "crypto"


export default eventHandler(async (event) => {
    const sourceinfo = {
        name: config.source.name,
        description: config.source.description,
        version: `${packageJson.version}.${crypto.createHash("md5").update(sourceScript).digest("hex").slice(0, 7)}`,
        author: "The Magic Source Project",
        homepage: `http://${config.server.host}:${config.server.port}/`
    }
    
    const source = [
        "/**",
        ...Object.entries(sourceinfo).map(([key, value]) => `* @${key} ${value}`),
        "*/",
        sourceScript
            .replaceAll("import.meta.env.ENABLE_DEV_TOOLS", JSON.stringify(config.source.debug))
            .replaceAll("import.meta.env.API_URL", JSON.stringify(`http://${config.server.host}:${config.server.port}/`))
    ].join("\n")

    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return source
})