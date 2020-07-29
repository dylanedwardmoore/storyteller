import ConvoSegment from './convo-segment'
import { IdCollection, Id, Nominal } from '../../common/common-types'

export type ConvoModuleIdNominalType = 'convo-module-id'

export type ConvoModuleId = Id<ConvoModuleIdNominalType>

export type ConvoModule = Readonly<{
    id: ConvoModuleId
    submodules: Record<string, ConvoModule>
    convoSegments: Record<string, ConvoSegment>
}>

export default ConvoModule
