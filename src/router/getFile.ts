import { eventHandler, send } from "h3"
import path from "path"
import fs from "fs/promises"

export default {
    music: eventHandler(async (event) => {
        const file = event.context.params?.file as string
    
        const fileContent = await fs.readFile(path.join("file/music/", file))
    
        return send(event, fileContent, "audio/mp4")
    })
}