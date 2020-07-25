# TODOs


## Safty when creating modules
- Enforce (with nominal types) that developers use constructor functions to create all convo-graph objects. During construction do runtime checks for things like slashes in id names etc. 
- inject state into convo module, that way it's super easy for users to use it 
- Create shorthand for more complex object types
- create a DEBUG=True flag in .env that can be set to enable or disable these aggresive safty checks at runtime
- add an "all paths are valid" check that runs immediatly after convo graph is loaded. this will just recurse through the whole graph and make sure that every path is valid and throw an error and stack trace if not. This check can be made faster by using a Set to avoid double checking paths. 


## facebook messenger and other platforms
- allow for integration with other chat platforms by confining how far telegram code can propagate into the codebase

## other
- make state work correctly, full readonly state is passed into expressions
- allow for state to be generically typed
- enable history
- enable creation of resuable parts of modules by enabling creation of unverified types
- allow for local images to be shared
- enable video sharing 
- enable audio sharing
- better logging
- add sleep call between mutliple messages

------ Other ideas: ------

## Allow for users to send images 
## Allow for time delayed responses 
## allow for web search or other integrations
