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