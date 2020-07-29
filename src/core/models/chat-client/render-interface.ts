import ImageNode from '../convo-engine/convo-graph/image-node'

interface RenderInChat {
    replyText: (text: string, buttons: string[]) => void
    replyImage: (src: string, buttons: string[]) => void
}

export default RenderInChat
