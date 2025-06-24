import { glob } from "fs/promises"
import { EVENT_NAMES, loadSource } from "./loader"
import { readFile } from "fs/promises"

export const sourceList = [] as {
    readonly name: string;
    readonly meta: Record<string, string>;
    readonly request: (datas: any) => Promise<string>;
}[]

export const loadAllSource = async () => {
    for await (const path of glob("source/*.js", {})) {
        console.log(`正在从 ${path} 加载音乐源...`)
        try {
            const source = await loadSource(await readFile(path, "utf8"))
            console.log(`已加载音乐源：${source.meta.name}`)
            await new Promise((resolve) => {
                source.on(EVENT_NAMES.inited, () => {
                    console.log(`已初始化音乐源：${source.meta.name}`)
                    source.on(EVENT_NAMES.updateAlert, ({log, updateUrl}) => {
                        console.log(`音乐源：${source.meta.name} 有新的更新，\n${log}\n${updateUrl}`)
                    })
                    sourceList.push({
                        name: source.meta.name,
                        meta: source.meta,
                        request(datas) {
                            return source.send(EVENT_NAMES.request, datas)
                        },
                    })
                    resolve(true)
                })
                source.init()
            })
        } catch (e) {
            console.error(`加载音乐源 ${path} 失败: ${e}`)
        }

    }
    console.log(`已加载 ${sourceList.length} 个音乐源`)
}

// await loadAllSource()
// console.log(sourceList)