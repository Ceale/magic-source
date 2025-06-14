import packageJson from "@/../package.json" with { type: "json" }
import sourceScript from "@/source.js" with { type: "text" }
import { eventHandler, readBody, setHeader } from "h3"
import * as config from "@/config"
import crypto from "crypto"

const sourceinfo = {
    name: "Magic Source",
    description: "魔法の音楽源",
    version: `${packageJson.version}.${crypto.createHash("md5").update(sourceScript).digest("hex").slice(0, 7)}`,
    author: "The Magic Source Project",
    homepage: config.server
}

const source = [
	"/**",
	...Object.entries(sourceinfo).map(([key, value]) => `* @${key} ${value}`),
	"*/",
	sourceScript
		.replaceAll("import.meta.env.ENABLE_DEV_TOOLS", JSON.stringify(true))
		.replaceAll("import.meta.env.API_URL", JSON.stringify(config.server))
].join("\n")

export default eventHandler(async (event) => {
    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return source
})