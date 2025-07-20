'use strict';

var react = require('react');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * A React hook that provides exponential backoff functionality for retrying operations
 */
var useExponentialBackoff = function (config) {
    if (config === void 0) { config = {}; }
    var _a = config.initialDelay, initialDelay = _a === void 0 ? 1000 : _a, _b = config.maxDelay, maxDelay = _b === void 0 ? 30000 : _b, _c = config.multiplier, multiplier = _c === void 0 ? 2 : _c, _d = config.maxRetries, maxRetries = _d === void 0 ? 5 : _d, _e = config.jitter, jitter = _e === void 0 ? 0.1 : _e;
    var _f = react.useState(false), isRetrying = _f[0], setIsRetrying = _f[1];
    var _g = react.useState(0), retryCount = _g[0], setRetryCount = _g[1];
    var _h = react.useState(null), lastError = _h[0], setLastError = _h[1];
    var timeoutRef = react.useRef(null);
    var abortControllerRef = react.useRef(null);
    var calculateDelay = react.useCallback(function (attempt) {
        var baseDelay = Math.min(initialDelay * Math.pow(multiplier, attempt), maxDelay);
        // Add jitter to prevent thundering herd problem
        var jitterAmount = baseDelay * jitter * Math.random();
        var finalDelay = baseDelay + jitterAmount;
        return Math.floor(finalDelay);
    }, [initialDelay, maxDelay, multiplier, jitter]);
    var executeWithBackoff = react.useCallback(function (operation, onSuccess, onFailure) { return __awaiter(void 0, void 0, void 0, function () {
        var attemptOperation;
        return __generator(this, function (_a) {
            // Reset state
            setRetryCount(0);
            setLastError(null);
            setIsRetrying(false);
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            // Create new abort controller for this execution
            abortControllerRef.current = new AbortController();
            attemptOperation = function () {
                var args_1 = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args_1[_i] = arguments[_i];
                }
                return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (attempt) {
                    var result, error_1, err, delay_1;
                    var _a;
                    if (attempt === void 0) { attempt = 0; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 6]);
                                return [4 /*yield*/, operation(abortControllerRef.current.signal)];
                            case 1:
                                result = _b.sent();
                                // Success - reset state and call success callback
                                setIsRetrying(false);
                                setRetryCount(0);
                                setLastError(null);
                                if (onSuccess) {
                                    onSuccess(result);
                                }
                                return [2 /*return*/, result];
                            case 2:
                                error_1 = _b.sent();
                                err = error_1 instanceof Error ? error_1 : new Error(String(error_1));
                                // Check if operation was aborted
                                if (err.name === "AbortError") {
                                    return [2 /*return*/];
                                }
                                setLastError(err);
                                setRetryCount(attempt + 1);
                                if (!(attempt < maxRetries)) return [3 /*break*/, 4];
                                delay_1 = calculateDelay(attempt);
                                setIsRetrying(true);
                                // Wait for delay before retrying
                                return [4 /*yield*/, new Promise(function (resolve) {
                                        timeoutRef.current = setTimeout(resolve, delay_1);
                                    })];
                            case 3:
                                // Wait for delay before retrying
                                _b.sent();
                                // Check if not aborted before retrying
                                if (!((_a = abortControllerRef.current) === null || _a === void 0 ? void 0 : _a.signal.aborted)) {
                                    return [2 /*return*/, attemptOperation(attempt + 1)];
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                // Max retries reached
                                setIsRetrying(false);
                                if (onFailure) {
                                    onFailure(err, attempt + 1);
                                }
                                else {
                                    throw err;
                                }
                                _b.label = 5;
                            case 5: return [3 /*break*/, 6];
                            case 6: return [2 /*return*/];
                        }
                    });
                });
            };
            return [2 /*return*/, attemptOperation()];
        });
    }); }, [maxRetries, calculateDelay]);
    var cancel = react.useCallback(function () {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsRetrying(false);
        setRetryCount(0);
        setLastError(null);
    }, []);
    var reset = react.useCallback(function () {
        cancel();
    }, [cancel]);
    var getNextDelay = react.useCallback(function () {
        return calculateDelay(retryCount);
    }, [calculateDelay, retryCount]);
    // Cleanup on unmount
    react.useEffect(function () {
        return function () {
            cancel();
        };
    }, [cancel]);
    return {
        // State
        isRetrying: isRetrying,
        retryCount: retryCount,
        lastError: lastError,
        // Methods
        executeWithBackoff: executeWithBackoff,
        cancel: cancel,
        reset: reset,
        getNextDelay: getNextDelay,
        // Configuration (read-only)
        config: {
            initialDelay: initialDelay,
            maxDelay: maxDelay,
            multiplier: multiplier,
            maxRetries: maxRetries,
            jitter: jitter,
        },
    };
};

exports.useExponentialBackoff = useExponentialBackoff;
//# sourceMappingURL=index.js.map
