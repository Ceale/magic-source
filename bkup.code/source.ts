import EventEmitter from "node:events"
import { util } from "./util"
import { runInNewContext } from "node:vm"
import Axios from "axios"
import http from "node:http"
import https from "node:https"

const readMetaInfo = (script: string): Record<string, string> => {
    const rawmeta = script.match(/\/\*\*([\s\S]*?)\*\//)
    if (rawmeta === null) {
        throw new Error("音乐源没有元信息")
    }
    const meta = new Map<string, string>()
    rawmeta[0]
        .replace(/\/\*\*?/, '')   // 去除开头的 /**
        .replace(/\*\/$/, '')     // 去除结尾的 */
        .split('\n')              // 按行分割
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

export const loadSource = async (script: string): Promise<EventEmitter> => {
    const eventEmitter = new EventEmitter()
    const meta = readMetaInfo(script)
    const env = {
        version: "2.0.0",
        env: "mobile",
        currentScriptInfo: { ...meta, rawScript: script },
        EVENT_NAMES,
        utils: util,
        send: (event_name, datas) => eventEmitter.emit(event_name, datas),
        on: (event_name, handler) => eventEmitter.on(event_name, handler),
        request(url, { method, headers, body, form, formData, timeout }, callback) {
            
            console.log("request", url, JSON.parse(JSON.stringify({ method, headers, body, form, formData, timeout })))

            let signal = false
            Axios.request({
                httpAgent: new http.Agent({ keepAlive: false }),
                httpsAgent: new https.Agent({ keepAlive: false }),
                url,
                method: method ?? "get",
                headers: {
                    ...headers,
                    "accept": "*/*",
                    "accept-encoding": null,
                    "Connection": "close" 
                },
                data: body ?? form ?? formData,
                timeout: timeout,
            }).then(response => {
                console.log(response)
                if (signal) return
                callback(null, response, response.data)
            }).catch(error => {
                if (signal) return
                callback(error, null, null)
            })
            return () => {
                signal = true
            }
        }
        // request(url, options, callback) {
        //     options = JSON.parse(JSON.stringify(options))

        //     console.log("request", url, options)
        //     // return () => {}

        //     // fetch(url, {
        //     //     method: options.method ?? "get",
        //     //     headers: options.headers,
        //     //     body: options.body,

        //     // })

        //     const controller = new AbortController()
        //     const signal = controller.signal

        //     // 处理超时
        //     const timeoutId = options.timeout ? setTimeout(() => {
        //         controller.abort()
        //         callback(new Error(`Request timed out after ${options.timeout}ms`))
        //     }, options.timeout) : null

        //     // 处理请求体
        //     let body: BodyInit | undefined
        //     let headers = options.headers || {}

        //     if (options.formData) {
        //         body = options.formData
        //         delete headers['Content-Type'] // 自动设置multipart/form-data
        //     } else if (options.form) {
        //         body = new URLSearchParams(options.form).toString()
        //         headers['Content-Type'] = 'application/x-www-form-urlencoded'
        //     } else if (options.body) {
        //         body = options.body
        //     }


        //     // 执行fetch请求
        //     fetch(url, {
        //         method: options.method ?? 'get',
        //         headers,
        //         body,
        //         // signal,
        //         verbose: true
        //     })
        //         .then(async (response) => {
        //             if (timeoutId) clearTimeout(timeoutId)
        //                 console.log(response)
        //             // 根据内容类型解析响应体
        //             const contentType = response.headers.get('content-type') || ''
        //             const body = contentType.includes('application/json')
        //                 ? await response.json()
        //                 : await response.text()

        //             // console.log(response, body)
        //             callback(null, response, body)
        //         })
        //         .catch((err) => {
        //             if (timeoutId) clearTimeout(timeoutId)

        //             // console.log(err)
        //             callback(err instanceof Error ? err : new Error(String(err)))
        //         })

        //     // 返回中止函数
        //     return () => {
        //         controller.abort()
        //         if (timeoutId) clearTimeout(timeoutId)
        //     }
        // }
        // request(url, { method = 'get', timeout, headers, body, form, formData }, callback) {
        //     let options = {
        //         headers,
        //         agent: undefined,
        //     }
        //     let data
        //     if (body) {
        //         data = body
        //     } else if (form) {
        //         data = form
        //         // data.content_type = 'application/x-www-form-urlencoded'
        //         options.json = false
        //     } else if (formData) {
        //         data = formData
        //         // data.content_type = 'multipart/form-data'
        //         options.json = false
        //     }
        //     options.response_timeout = typeof timeout == 'number' && timeout > 0 ? Math.min(timeout, 60_000) : 60_000

        //     let request = needle.request(method, url, data, options, (err, resp, body) => {
        //         // console.log(err, resp, body)
        //         try {
        //             if (err) {
        //                 callback.call(this, err, null, null)
        //             } else {
        //                 body = resp.body = resp.raw.toString()
        //                 try {
        //                     resp.body = JSON.parse(resp.body)
        //                 } catch (_) { }
        //                 body = resp.body
        //                 callback.call(this, err, {
        //                     statusCode: resp.statusCode,
        //                     statusMessage: resp.statusMessage,
        //                     headers: resp.headers,
        //                     bytes: resp.bytes,
        //                     raw: resp.raw,
        //                     body,
        //                 }, body)
        //             }
        //         } catch (err) {
        //             onError(err.message)
        //         }
        //     }).request

        //     return () => {
        //         if (!request.aborted) request.abort()
        //         request = null
        //     }
        // },
    }

    runInNewContext(script, { lx: env })
    return eventEmitter
}