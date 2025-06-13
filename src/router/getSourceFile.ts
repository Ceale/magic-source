import { version } from "@/../package.json"
import sourceScript from "@/source.js?raw"
import { eventHandler, setHeader } from "h3"

const sourceinfo = {
    name: "Magic Source",
    description: "魔法の音楽源",
    version: version,
    author: "The Magic Source Project",
    homepage: "http://localhost:23111"
}

const source = [
	"/**",
	...Object.entries(sourceinfo).map(([key, value]) => `* @${key} ${value}\n`),
	"*/",
	sourceScript
		.replaceAll("import.meta.env.ENABLE_DEV_TOOLS", JSON.stringify(true))
		.replaceAll("import.meta.env.SERVER_URL", JSON.stringify("http://localhost:23111/api"))
].join("\n")

export default eventHandler(async (event) => {
    setHeader(event, 'Content-Type', 'text/javascript; charset=utf-8')
    return source
})