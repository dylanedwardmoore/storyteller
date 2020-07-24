interface RenderInChat {
    replyText: (text: string) => void
    // replyImage
    showButtons: (textButtons: string[]) => void
}

export default RenderInChat
