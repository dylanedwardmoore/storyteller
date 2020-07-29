import ConvoNode from './convo-node'
import UserChoice from './user-choice'
import { ConvoLogic } from './convo-logic'
import { Id, Nominal } from '../../common/common-types'

export type ConvoSegmentIdNominalType = 'convo-segment-id'

export type ConvoSegmentId = Id<ConvoSegmentIdNominalType>

type ConvoSegment = Readonly<{
    id: ConvoSegmentId
    convoNodes: ConvoNode[]
    choices: UserChoice[]
    defaultChoice?: ConvoLogic
    preLogic: ConvoLogic
    postLogic: ConvoLogic
}>

export default ConvoSegment
