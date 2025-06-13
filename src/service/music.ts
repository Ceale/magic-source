import fs from 'fs/promises'

export const getId = (source, musicInfo) => {
    switch (source) {
        case 'tx':
        case 'wy':
        case 'kw':
            return musicInfo["songmid"]
        case 'kg':
            return musicInfo['hash']
        case 'mg':
            return musicInfo['copyrightId']
    }
    throw Error("failed")
}

interface MusicData {
    source: string
    songmid: string
    fileid: string
}

export const has = async (source, songmid) => {
    const data = JSON.parse(await fs.readFile(DATA_FILE, "utf8")) as MusicData[]
    const music = data.filter(item => item.source === source && item.songmid === songmid)[0]
    if (music === undefined) return false
    return music
}

const DATA_FILE = "data.json"

export const set = async (source, songmid, fileid) => {
    const data = JSON.parse(await fs.readFile(DATA_FILE, "utf8")) as MusicData[]
    const music = data.filter(item => item.source === source && item.songmid === songmid)[0]
    if (music === undefined) {
        data.push({
            source,
            songmid,
            fileid
        })
    }
    music.fileid = fileid
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 4))
}