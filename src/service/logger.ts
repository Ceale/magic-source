import winston from "winston"

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(info => {
            const args = info[Symbol.for('splat')] as any [] || [];
            return `${info.timestamp} [${info.level}]: ${info.message} ${args.map(arg => arg).join(" ")}`
        }),
        winston.format.colorize({ all: true }),
    )
})