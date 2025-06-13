import crypto from "node:crypto"
import zlib from "node:zlib"

export const util = {
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