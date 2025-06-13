/**
 * @name 测试音乐源
 * @description 我只是一个测试音乐源哦
 * @version 1.0.0
 * @author xxx
 * @homepage http:
 */


const { EVENT_NAMES, request, on, send } = globalThis.lx

on(EVENT_NAMES.request, (event_data) => {
    console.log(event_data)
    request("127.0.0.1:23111", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: event_data
    })
})

const qualitys = ["128k", /* "320k", "flac", "flac24bit" */]
const actions = ["musicUrl"]
send(EVENT_NAMES.inited, {
    openDevTools: true, 
    sources: { 
        kw: { 
            name: "酷我音乐",
            type: "music",    
            actions, 
            qualitys 
        },
        kg: { 
            name: "酷狗音乐",
            type: "music",    
            actions, 
            qualitys 
        },
        tx: {
            name: "QQ音乐",
            type: "music",
            actions,
            qualitys
        },
        wy: {
            name: "网易云音乐",
            type: "music",
            actions,
            qualitys
        },
        mg: {
            name: "咪咕音乐",
            type: "music",
            actions,
            qualitys
        },
        local: {
            name: "本地音乐",
            type: "music",    
            actions: [...actions, "lyric", "pic"], 
            qualitys 
        },
    },
})
console.log(globalThis.lx)