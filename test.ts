import { EVENT_NAMES, loadSource } from "./source"
import { readFile } from "fs/promises"

const source = await loadSource(await readFile("野花音源.js", "utf8"))
source.on(EVENT_NAMES.inited, async () => {
    console.log("inited")
    void (source.send(EVENT_NAMES.request, a) as Promise<string>)
    .then(console.log)
    .catch(console.error)
})

const a = {
    source: "tx",
    action: "musicUrl",
    info: {
        "type": "128k",
        "musicInfo": {
            "name": "何？",
            "singer": "阿知波大輔、桶狭間ありさ",
            "source": "tx",
            "songmid": "000Se2Ir0zU0oX",
            "interval": "00:54",
            "albumName": "TVアニメ『お兄ちゃんはおしまい!』オリジナルサウンドトラック",
            "img": "https://y.gtimg.cn/music/photo_new/T002R500x500M000001Fo3jf11wG7H.jpg",
            "typeUrl": {},
            "albumId": "001Fo3jf11wG7H",
            "types": [
                {
                    "type": "128k",
                    "size": "845.89 KB"
                },
                {
                    "type": "320k",
                    "size": "2.06 MB"
                }
            ],
            "_types": {
                "128k": {
                    "size": "845.89 KB"
                },
                "320k": {
                    "size": "2.06 MB"
                }
            },
            "strMediaMid": "000Se2Ir0zU0oX",
            "albumMid": "001Fo3jf11wG7H",
            "songId": 390668155
        }
    }
}