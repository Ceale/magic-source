import fs from 'fs/promises'

export const source = [ "tx", "wy", "kg", "kw", "mg", "local" ] as const

export const getId = (source, musicInfo) => {
    switch (source) {
        case 'tx':
        case 'wy':
        case 'kw':
        case 'local':
            return musicInfo["songmid"]
        case 'kg':
            return musicInfo['hash']
        case 'mg':
            return musicInfo['copyrightId']
    }
    throw Error("Invalid music source: "+source)
}

// interface MusicData {
//     source: string
//     songmid: string
//     fileid: string
// }

export const has = async (source, songmid) => {
    const data = JSON.parse(await fs.readFile(DATA_FILE, "utf8")) // as MusicData[]
    const music = data.filter(item => item.source === source && item.songmid === songmid)[0]
    if (music === undefined) return false
    return music
}

const DATA_FILE = "data.json"

export const set = async (source, songmid, fileid) => {
    const data = JSON.parse(await fs.readFile(DATA_FILE, "utf8")) // as MusicData[]
    const music = data.filter(item => item.source === source && item.songmid === songmid)[0]
    console.log(music)
    if (music === undefined) {
        data.push({
            source,
            songmid,
            fileid
        })
    } else {
        music.fileid = fileid
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 4))
}