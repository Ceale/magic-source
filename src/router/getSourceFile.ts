import packageJson from "@/../package.json" with { type: "json" }
import sourceScript from "@/source.js" with { type: "text" }
import fs from "node:fs/promises"
import path from "node:path"
import { eventHandler, setHeader } from "h3"

// const sourceScript = await fs.readFile("src/source.js", "utf8")
// console.log(sourceScript)

const sourceinfo = {
    name: "Magic Source",
    description: "魔法の音楽源",
    version: packageJson.version,
    author: "The Magic Source Project",
    homepage: "http://192.168.31.226:23111"
}

const source = [
	"/**",
	...Object.entries(sourceinfo).map(([key, value]) => `* @${key} ${value}\n`),
	"*/",
	sourceScript
		.replaceAll("import.meta.env.ENABLE_DEV_TOOLS", JSON.stringify(true))
		.replaceAll("import.meta.env.SERVER_URL", JSON.stringify("http://192.168.31.226:23111/api"))
].join("\n")

export default eventHandler(async (event) => {
    setHeader(event, 'Content-Type', 'text/javascript; charset=utf-8')
    return source
})