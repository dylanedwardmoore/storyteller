// Used for chaining promises to ensure that responses are sent in the correct order
export type ClientCtx = any

interface RenderInChat {
    replyText: (text: string, buttons: string[]) => Promise<ClientCtx>
    replyImage: (src: string, buttons: string[]) => Promise<ClientCtx>
}

export default RenderInChat
