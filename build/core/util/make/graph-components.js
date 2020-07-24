"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("fp-ts/lib/Either");
function convoModuleId(unvalidatedId) {
    return unvalidatedId;
}
function convoSegmentId(unvalidatedId) {
    return unvalidatedId;
}
function convoSegmentPath(content) {
    if (content.length === 0) {
        throw new Error("Empty convo segment path is not allowed");
    }
    var parentModules = content.slice(0, content.length - 1).map(function (unverified) { return convoModuleId(unverified); });
    var id = convoSegmentId(content[content.length - 1]);
    return {
        id: id,
        parentModules: parentModules
    };
}
exports.convoSegmentPath = convoSegmentPath;
function convoLogicAction(content) {
    return {
        type: 'start-convo-segment',
        path: convoSegmentPath(content.path)
    };
}
function convoLogicActions(content) {
    return content.map(function (unvalidated) { return convoLogicAction(unvalidated); });
}
function text(content) {
    return Either_1.right(content);
}
function conditional(content) {
    return Either_1.right(content);
}
function convoLogic(content) {
    return content.map(function (unvalidated) {
        if (unvalidated.conditional) {
            return {
                if: conditional(unvalidated.if),
                do: convoLogicActions(unvalidated.do),
                otherwise: convoLogicActions(unvalidated.otherwise)
            };
        }
        else {
            return {
                if: conditional(true),
                do: convoLogicActions(unvalidated.do),
                otherwise: convoLogicActions(unvalidated.do)
            };
        }
    });
}
function choice(content) {
    return {
        text: text(content.text),
        logic: convoLogic(content.logic)
    };
}
function filepath(content) {
    return Either_1.right(content);
}
function imageNode(content) {
    return {
        __TYPE__: 'image-node',
        src: filepath(content.src)
    };
}
function textNode(content) {
    return {
        __TYPE__: 'text-node',
        text: text(content.text)
    };
}
function convoNode(content) {
    switch (content.type) {
        case 'image':
            return imageNode(content);
        case 'text':
            return textNode(content);
        default:
            throw new Error("Unreachable code in switch case for generating convo node");
    }
}
function convoSegment(content) {
    return {
        id: convoSegmentId(content.id),
        choices: content.choices.map(function (unvalidated) { return choice(unvalidated); }),
        convoNodes: content.convo.map(function (unvalidated) { return convoNode(unvalidated); }),
        preLogic: [],
        postLogic: []
    };
}
function module(content) {
    var reducer = function (type) { return function (acc, curr) {
        var _a;
        if (acc[curr.id] !== undefined) {
            throw new Error("Cannot construct module with id " + content.id + ", the " + type + " with id " + curr.id + " has a duplicate id in this module's definition.");
        }
        return __assign(__assign({}, acc), (_a = {}, _a[curr.id] = curr, _a));
    }; };
    var submodules = content.submodules !== undefined
        ? content.submodules.reduce(reducer('submodule'), {})
        : {};
    var convoSegments = content.convoSegments !== undefined
        ? content.convoSegments.map(function (unvalidated) { return convoSegment(unvalidated); })
            .reduce(reducer('convo segment'), {})
        : {};
    return {
        id: convoModuleId(content.id),
        submodules: submodules,
        convoSegments: convoSegments
    };
}
exports.module = module;
//# sourceMappingURL=graph-components.js.map