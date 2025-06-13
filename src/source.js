const { EVENT_NAMES, request, on, send } = globalThis.lx

if (import.meta.env.ENABLE_DEV_TOOLS) {
    on(EVENT_NAMES.request, (event_data) => {
        console.log(event_data)
    })
}

on(EVENT_NAMES.request, (event_data) => {
    return new Promise((resolve, reject) => {
        request(
            import.meta.env.SERVER_URL,
            {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: event_data
            },
            (err, resp) => {
                if (err) {
                    reject(err)
                }
                console.log(resp)
                resolve(resp.body.url)
            }
        )
    })
})

const qualitys = ["128k" /* , "320k", "flac", "flac24bit" */]
const actions = ["musicUrl"]
send(EVENT_NAMES.inited, {
    openDevTools: import.meta.env.ENABLE_DEV_TOOLS,
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

if (import.meta.env.ENABLE_DEV_TOOLS) {
    console.log(globalThis.lx)
}