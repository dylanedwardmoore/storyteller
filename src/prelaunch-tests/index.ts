import { allPathsAreValid } from './path-validity'
import { StorytellerConfig } from '../core/models/chat-client/chat-client'
import { isSome, Option } from 'fp-ts/lib/Option'
import log from '../core/util/logging'

export function runPrelanchTests(config: StorytellerConfig): void {
    // update this to do a mapping across multiple test results, we don't want the tests to short circuit
    const maybeError: Option<Error> = allPathsAreValid(config)
    if (isSome(maybeError)) {
        throw maybeError.value
    }
    log.debug(`All pre launch tests pass! Hooray!`)
}
