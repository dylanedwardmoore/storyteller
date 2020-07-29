import { ConvoSegmentId } from './convo-segment'
import { ConvoModuleId } from './convo-module'
import { Nominal } from '../../common/common-types'

export type ModulePath = ConvoModuleId[]

export type ConvoSegmentPath = Readonly<{
    id: ConvoSegmentId

    // Path is considered relative if parent modules is undefined
    parentModules?: ModulePath
}>

export type AbsoluteConvoSegmentPath = Required<ConvoSegmentPath>
