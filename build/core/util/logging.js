"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslog_1 = require("tslog");
// For usage help, see docs: https://tslog.js.org/
exports.namedLogger = function (name) { return new tslog_1.Logger({ name: name }); };
var log = new tslog_1.Logger({ setCallerAsLoggerName: true });
exports.jsonLogger = new tslog_1.Logger({ type: 'json', setCallerAsLoggerName: true });
exports.default = log;
//# sourceMappingURL=logging.js.map