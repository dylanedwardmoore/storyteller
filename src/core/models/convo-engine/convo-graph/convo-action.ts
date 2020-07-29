import { ConvoSegmentPath } from './convo-path'

export type StartConvoSegment = {
    type: 'start-convo-segment'
    path: ConvoSegmentPath
}

// export type RedoPreviousConvoSegment = {
//     type: 'redo-previous-convo-segment'
// }

type ConvoAction = Readonly<StartConvoSegment> // TODO: add redo previous convo segment here

export default ConvoAction
