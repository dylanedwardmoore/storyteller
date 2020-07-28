import { StorytellerConfig } from './core/models/chat-client/chat-client'
import { root } from './modules/sample-root'
import { absoluteConvoSegmentPath } from './core/util/make/graph-components'
import { initialState } from './state/state-config'
import { runPrelanchTests } from './prelaunch-tests'

/*
 * Define your config here. This should have a reference to your root module, starting convoSegment path,
 * and initial state. If you will be using state variables, you can edit the state config in ./state/state-config.ts
 */

//// TODO: Start editing from here

const rootModule = root

const usePreLaunchTests: boolean = true

const startingConvoSegmentPath = absoluteConvoSegmentPath(['root', '/start'])

///// Stop editing. Don't change anything below this

const storytellerContentConfigurations: StorytellerConfig = {
    rootModule,
    initialState,
    startingConvoSegmentPath,
}

if (usePreLaunchTests) {
    runPrelanchTests(storytellerContentConfigurations)
}

export default storytellerContentConfigurations
