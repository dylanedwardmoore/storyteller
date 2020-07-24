# TODOs

## Storage: 
<!-- - this should replace "replay engine" 
- Add amend only effect log stored as a file, each line represents a stringified json for an effect object. Effect objects will all contain timestamp, uuid, (prior + after), and a type, which could be: "change convoSegment", "change user info", or "input received from user" or "message sent to user". The effects would also have a "undo?: uuid" that would be set to a value if the effect undoes soemthing. As events are read in, a hashmap is built up that tracks what events have not yet been undone. An array is also kept that tracks events. New events are added as new lines to the file for a particular chat user.
- storage-manager should impliment methods for recreating state from a file, adding to a file, and clearing storage. keep it simple. -->

## Add default reply for convo manager when no matching user input is found 

<!-- ## state manager
- make a getOrInit call in state-manager that, if state is null, uses storage to init, and if this is null, uses the default state provided. 
- state manager only makes special case for currentConvoPath
- state manager allows you to rollback all changes related to a user message or some other number of a specified type of event.
- along the lines of keep it simple, get rid of all the extra stuff in this folder -->


## Safty when creating modules
- Enforce (with nominal types) that developers use constructor functions to create all convo-graph objects. During construction do runtime checks for things like slashes in id names etc. 
- inject state into convo module, that way it's super easy for users to use it 
- Create shorthand for more complex object types
- create a DEBUG=True flag in .env that can be set to enable or disable these aggresive safty checks at runtime
- add an "all paths are valid" check that runs immediatly after convo graph is loaded. this will just recurse through the whole graph and make sure that every path is valid and throw an error and stack trace if not. This check can be made faster by using a Set to avoid double checking paths. 

<!-- ## refactor convo segment and convo module
- don't refer to convo nodes by id, just have them live in convo segments. same for user options. keep it simple. if developers want to share code between these they can create their own variables elsewhere that are referenced. -->

## facebook messenger and other platforms
- allow for integration with other chat platforms by confining how far telegram code can propagate into the codebase

## Avoid allowing multiple root modules
- this seems clumsy and unnecessary. allow for the same functionality to be met by giving more global controls to modules. these could perhaps be inherited i.e. submodules get all the global controls from their parents


------ Other ideas: ------

## Allow for users to send images 
## Allow for time delayed responses 
## allow for web search or other integrations
