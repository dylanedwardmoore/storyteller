type TelegramAuthType = 'telegram'


export type TelegramAuth = {
    type: TelegramAuthType
    apiKey: string
}

export type ChatClientAuth = TelegramAuth
