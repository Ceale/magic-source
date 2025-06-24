import Axios from "axios"
import crypto from "node:crypto"
import EventEmitter from "node:events"
import { runInNewContext } from "node:vm"
import zlib from "node:zlib"

const util = {
    crypto: {
        aesEncrypt(buffer, mode, key, iv) {
            const cipher = crypto.createCipheriv(mode, key, iv)
            return Buffer.concat([cipher.update(buffer), cipher.final()])
        },
        rsaEncrypt(buffer, key) {
            buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer])
            return crypto.publicEncrypt({ key, padding: crypto.constants.RSA_NO_PADDING }, buffer)
        },
        randomBytes(size) {
            return crypto.randomBytes(size)
        },
        md5(str) {
            return crypto.createHash('md5').update(str).digest('hex')
        },
    },
    buffer: {
        from(...args) {
            // @ts-ignore
            return Buffer.from(...args)
        },
        bufToString(buf, format) {
            return Buffer.from(buf, 'binary').toString(format)
        },
    },
    zlib: {
        inflate(buf) {
            return new Promise((resolve, reject) => {
                zlib.inflate(buf, (err, data) => {
                    if (err) reject(new Error(err.message))
                    else resolve(data)
                })
            })
        },
        deflate(data) {
            return new Promise((resolve, reject) => {
                zlib.deflate(data, (err, buf) => {
                    if (err) reject(new Error(err.message))
                    else resolve(buf)
                })
            })
        },
    },
}

const readMetaInfo = (script: string): Record<string, string> => {
    const rawmeta = script.match(/\/\*([\s\S]*?)\*\//)
    if (rawmeta === null) {
        throw new Error("音乐源没有元信息")
    }
    const meta = new Map<string, string>()
    rawmeta[0]
        .replace(/\/\*?/, '')   // 去除开头的 /**
        .replace(/\*\/$/, '')     // 去除结尾的 */
        .split('\n') // 按行分割
        .map(line => line
            .replace(/^\s*\* ?/, '')  // 去除行首的 * 号
            .trim()
        )
        .filter(line => line.length > 0)
        .forEach(line => {
            const tagMatch = line.match(/@(\w+)\s+(.+)/)
            if (tagMatch) {
                const [_, key, value] = tagMatch
                meta.set(key, value)
            }
        })
    return Object.fromEntries(meta)
}

export const EVENT_NAMES = {
    request: 'request',
    inited: 'inited',
    updateAlert: 'updateAlert',
} as const

export const loadSource = async (script: string) => {
    const eventEmitter = new EventEmitter()
    const meta = readMetaInfo(script)
    let requestHandle = null
    const env = {
        version: "2.0.0",
        env: "desktop",
        currentScriptInfo: { ...meta, rawScript: script },
        EVENT_NAMES,
        utils: util,
        send(event_name, datas) {
            switch (event_name) {
                case EVENT_NAMES.request:
                    if (requestHandle === null) throw new Error("request 还未初始化")
                    return requestHandle(datas)
                case EVENT_NAMES.inited:
                case EVENT_NAMES.updateAlert:
                    eventEmitter.emit(event_name, datas)
            }
        },
        on(event_name, handler) {
            switch (event_name) {
                case EVENT_NAMES.request:
                    requestHandle = handler
                    return
                case EVENT_NAMES.inited:
                case EVENT_NAMES.updateAlert:
                    eventEmitter.on(event_name, handler)
            }
        },
        request(url, { method, headers, body, form, formData, timeout }, callback) {
            // console.log("request", url, JSON.parse(JSON.stringify({ method, headers, body, form, formData, timeout })))
            const signal = new AbortController()
            Axios.request({
                url,
                method: method ?? "get",
                headers: {
                    ...headers,
                    "accept": "*/*",
                    "accept-encoding": null,
                    "Connection": "close" 
                },
                data: body ?? form ?? formData,
                signal: signal.signal,
                timeout: timeout,
                validateStatus: () => true,
                responseType: "arraybuffer",
            }).then(response => {
                const rawBody = new TextDecoder().decode(response.data)
                const body = (() => { 
                    try {
                        return JSON.parse(rawBody)
                    } catch (e) {
                        return rawBody
                    }
                })()
                const resp = {
                    statusCode: response.status,
                    statusMessage: response.statusText,
                    headers: response.headers,
                    bytes: response.data.byteLength,
                    raw: response.data,
                    body,
                }
                // console.log(resp)
                callback(null, resp, body)
            }).catch(error => {
                // console.log(error)
                callback(error, null, null)
            })
            return signal.abort
        }
    }

    return {
        send: env.send,
        on: env.on,
        init() {
            runInNewContext(script, { lx: env, setTimeout /* console */ })
        },
        meta,
    }
}
