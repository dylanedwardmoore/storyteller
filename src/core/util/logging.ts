import { Logger } from 'tslog'

// For usage help, see docs: https://tslog.js.org/
export const namedLogger = (name: string) => new Logger({ name })

const log: Logger = new Logger({ setCallerAsLoggerName: true })

export const jsonLogger = new Logger({
    type: 'json',
    setCallerAsLoggerName: true,
})

export default log
