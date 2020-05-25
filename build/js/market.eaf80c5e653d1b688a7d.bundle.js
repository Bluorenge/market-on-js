/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 288);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(188);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(5);
var getOwnPropertyDescriptor = __webpack_require__(75).f;
var isForced = __webpack_require__(108);
var path = __webpack_require__(10);
var bind = __webpack_require__(45);
var createNonEnumerableProperty = __webpack_require__(19);
var has = __webpack_require__(15);

var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof NativeConstructor) {
      switch (arguments.length) {
        case 0: return new NativeConstructor();
        case 1: return new NativeConstructor(a);
        case 2: return new NativeConstructor(a, b);
      } return new NativeConstructor(a, b, c);
    } return NativeConstructor.apply(this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;

  var nativeSource = GLOBAL ? global : STATIC ? global[TARGET] : (global[TARGET] || {}).prototype;

  var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
  var targetPrototype = target.prototype;

  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  for (key in source) {
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && has(nativeSource, key);

    targetProperty = target[key];

    if (USE_NATIVE) if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

    if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

    // bind timers to global for call from export context
    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, global);
    // wrap global constructors for prevent changs in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && typeof sourceProperty == 'function') resultProperty = bind(Function.call, sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }

    target[key] = resultProperty;

    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!has(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      // export virtual prototype methods
      path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
      // export real prototype methods
      if (options.real && targetPrototype && !targetPrototype[key]) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var shared = __webpack_require__(64);
var has = __webpack_require__(15);
var uid = __webpack_require__(65);
var NATIVE_SYMBOL = __webpack_require__(66);
var USE_SYMBOL_AS_UID = __webpack_require__(92);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (NATIVE_SYMBOL && has(Symbol, name)) WellKnownSymbolsStore[name] = Symbol[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(10);
var has = __webpack_require__(15);
var wrappedWellKnownSymbolModule = __webpack_require__(82);
var defineProperty = __webpack_require__(26).f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(119)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(195);

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(10);

module.exports = function (CONSTRUCTOR) {
  return path[CONSTRUCTOR + 'Prototype'];
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(175);

/***/ }),
/* 15 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(56);

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var definePropertyModule = __webpack_require__(26);
var createPropertyDescriptor = __webpack_require__(39);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var fails = __webpack_require__(6);
var has = __webpack_require__(15);

var defineProperty = Object.defineProperty;
var cache = {};

var thrower = function (it) { throw it; };

module.exports = function (METHOD_NAME, options) {
  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
  if (!options) options = {};
  var method = [][METHOD_NAME];
  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
  var argument0 = has(options, 0) ? options[0] : thrower;
  var argument1 = has(options, 1) ? options[1] : undefined;

  return cache[METHOD_NAME] = !!method && !fails(function () {
    if (ACCESSORS && !DESCRIPTORS) return true;
    var O = { length: -1 };

    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
    else O[1] = 1;

    method.call(O, argument0, argument1);
  });
};


/***/ }),
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(55);
var requireObjectCoercible = __webpack_require__(56);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(183);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(50);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var IE8_DOM_DEFINE = __webpack_require__(89);
var anObject = __webpack_require__(17);
var toPrimitive = __webpack_require__(47);

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(45);
var IndexedObject = __webpack_require__(55);
var toObject = __webpack_require__(18);
var toLength = __webpack_require__(25);
var arraySpeciesCreate = __webpack_require__(70);

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(191);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(273);

/***/ }),
/* 32 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(10);
var global = __webpack_require__(5);

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(69);
var defineProperty = __webpack_require__(26).f;
var createNonEnumerableProperty = __webpack_require__(19);
var has = __webpack_require__(15);
var toString = __webpack_require__(131);
var wellKnownSymbol = __webpack_require__(3);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC, SET_METHOD) {
  if (it) {
    var target = STATIC ? it : it.prototype;
    if (!has(target, TO_STRING_TAG)) {
      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
    }
    if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
      createNonEnumerableProperty(target, 'toString', toString);
    }
  }
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(32);

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(214);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(243);

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(69);
var classofRaw = __webpack_require__(32);
var wellKnownSymbol = __webpack_require__(3);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);
var wellKnownSymbol = __webpack_require__(3);
var V8_VERSION = __webpack_require__(77);

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(126);
var DOMIterables = __webpack_require__(133);
var global = __webpack_require__(5);
var classof = __webpack_require__(40);
var createNonEnumerableProperty = __webpack_require__(19);
var Iterators = __webpack_require__(27);
var wellKnownSymbol = __webpack_require__(3);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG) {
    createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
  }
  Iterators[COLLECTION_NAME] = Iterators.Array;
}


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(134).charAt;
var InternalStateModule = __webpack_require__(57);
var defineIterator = __webpack_require__(90);

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(160);

var iterableToArray = __webpack_require__(162);

var unsupportedIterableToArray = __webpack_require__(103);

var nonIterableSpread = __webpack_require__(174);

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(28);

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(93);
var enumBugKeys = __webpack_require__(68);

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(64);
var uid = __webpack_require__(65);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 50 */
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var createNonEnumerableProperty = __webpack_require__(19);

module.exports = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(47);
var definePropertyModule = __webpack_require__(26);
var createPropertyDescriptor = __webpack_require__(39);

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(200);

var iterableToArrayLimit = __webpack_require__(201);

var unsupportedIterableToArray = __webpack_require__(103);

var nonIterableRest = __webpack_require__(202);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return createNavItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return createProductList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return createProductPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return createCartPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createCartBlock; });
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(80);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(53);
/* harmony import */ var _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_entries__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(71);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_entries__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_entries__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(0);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(14);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_6__);







// Обёртка меню
var marketMenuWrap = document.querySelector(".market-header__nav"); // Обёртка контента страницы

var marketContentWrap = document.querySelector(".market-content"); // Шаблон меню и его добавление на страницу

var createNavItem = function createNavItem(title, id, path) {
  var menu;

  if (path !== undefined) {
    menu = _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_6___default()(path).call(path, function (item) {
      var _context;

      return _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context = "<li id=\"menu-".concat(item.id, "\" class=\"market-header__nav-item market-header__nav-item--sub\">")).call(_context, item.name, "</li>");
    }).join("");
  } else {
    var _context2;

    menu = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context2 = "<li id=\"menu-".concat(id, "\" class=\"market-header__nav-item market-header__nav-item--sub\">")).call(_context2, title, "</li>");
  }

  var slider = marketMenuWrap.querySelector("div"); // Если обёртка слайдера найдена, то вставляем меню туда

  if (slider !== null) {
    slider.insertAdjacentHTML("beforeend", menu);
  } else {
    marketMenuWrap.insertAdjacentHTML("beforeend", menu);
  }
}; // Шаблон списка с категориями/товарами и его добавление на страницу


var createProductList = function createProductList(productListArray, globalSetting, contentId) {
  var productItemHtml = function productItemHtml(item) {
    var _context3, _context4, _context5, _context6, _context7;

    return _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context3 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context4 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context5 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context6 = "\n  <div id=\"product-".concat(item.id, "\" class=\"market-products__product\">\n    <div class=\"market-products__product-wrap\">\n      <h2 class=\"market-products__product-title\">")).call(_context6, item.name, "</h2>\n      <div class=\"market-products__product-img-wrap\"><img src=\"https://media.lpgenerator.ru/images/")).call(_context5, globalSetting.userId, "/")).call(_context4, item.img, "\"></div>\n      <div class=\"market-products__product-bottom\">\n        ")).call(_context3, item.price !== undefined ? _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context7 = "<span class=\"market-products__product-price\">".concat(item.price.toLocaleString("ru-RU"), " ")).call(_context7, globalSetting.currency, "</span>") : "", "\n        <button class=\"market-products__product-btn market-btn\">\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</button>\n      </div>\n    </div>\n  </div>");
  }; // Создаём тег li категории/товара с информацией из [] с информацией о категориях и о товарах


  var newProductList = _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_6___default()(productListArray).call(productListArray, function (productItem) {
    if (productItem.active) {
      return productItemHtml(productItem);
    } else if ("subCategory" in productItem || "productsInCategory" in productItem) {
      return productItemHtml(productItem);
    }
  }).join(""); // Создаём тег ul и вставляем туда получившиеся пункты


  var productListWrap = document.createElement("div"); // Задаём ему класс

  productListWrap.className = "market-products__list market-content--fade-in"; // Добавляем список

  productListWrap.innerHTML = newProductList; // Добавляем кнопки для карусели

  marketContentWrap.insertAdjacentHTML("afterbegin", "<div role=\"tablist\" class=\"dots\"></div>");

  if (contentId !== undefined) {
    marketContentWrap.id = contentId;
  } // Вставляем получившийся список категорий/товаров в html-разметку


  marketContentWrap.append(productListWrap);
}; // Шаблон описания товара и его добавление на страницу
// - какой же там громоздкий код внутри, для проверки активного класс


var createProductPage = function createProductPage(productObject, globalSetting, contentId) {
  var _context13, _context14, _context15, _context16, _context17, _context18, _context19;

  // Проходимся по массиву опций с установкой активного класса первой активной опции
  var optionsList = function optionsList() {
    var _context8;

    return _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_6___default()(_context8 = productObject.options.optionList).call(_context8, function (item, indexItem) {
      var _context9;

      return (// Превращаем каждый объект опции в массив и выбираем первую строчку
        _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_6___default()(_context9 = _babel_runtime_corejs3_core_js_stable_object_entries__WEBPACK_IMPORTED_MODULE_4___default()(item)).call(_context9, function (_ref) {
          var _context10, _context11;

          var _ref2 = _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          return _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context10 = "<li class=\"market-product__option-item\n              ".concat( // Если опция активна
          value === true ? // Ищем её индекс, и если он равен индексу родительского элемента
          _babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_2___default()(_context11 = productObject.options.optionList).call(_context11, function (option) {
            var _context12;

            return _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_6___default()(_context12 = _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_1___default()(option)).call(_context12, function (_ref3) {
              var _ref4 = _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_ref3, 1),
                  key = _ref4[0];

              return key === true;
            });
          }) === indexItem ? // Задаём активный класс
          "market-product__option-item--active" : "" : // Иначе отключаем опцию
          "market-product__option-item--disabled", "\n          \">")).call(_context10, key, "</li>");
        })[0]
      );
    }).join("");
  }; // Внутри превращаем productObject.option в массив и отрисовываем каждый элемент опций


  var productPage = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context13 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context14 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context15 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context16 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context17 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context18 = "<section class=\"market-product market-content--fade-in\">\n      <h2 class=\"market-product__title\">".concat(productObject.name, "</h2>\n      <div class=\"market-product__img-wrap\">\n        <img src=\"https://media.lpgenerator.ru/images/")).call(_context18, globalSetting.userId, "/")).call(_context17, productObject.img, "\" alt=\"product-img\">\n      </div>\n      <div class=\"market-product__content-wrap\">\n        ")).call(_context16, "options" in productObject && productObject.options !== undefined ? _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context19 = "<div class=\"market-product__option-wrap\">\n                <div class=\"market-product__option-title\">".concat(productObject.options.nameOptionList, ":</div>\n                <ul class=\"market-product__option-list\"> \n                  ")).call(_context19, optionsList(), "\n                </ul>\n              </div>") : "", "\n        <div class=\"market-product__price-wrap\">\n          <span>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C: </span>\n          <span class=\"market-product__price\">")).call(_context15, productObject.price.toLocaleString("ru-RU"), "</span>\n          <span>")).call(_context14, globalSetting.currency, "</span>\n        </div>\n        <button class=\"market-product__btn market-btn market-btn--add-to-cart\">\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</button>\n      </div>\n      ")).call(_context13, productObject.desc !== undefined ? "<div class=\"market-product__desc\">\n              <span class=\"market-product__desc-title\">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:</span>\n              <p class=\"market-product__desc-text\">".concat(productObject.desc, "</p>\n            </div>") : "", "\n    </section>");

  if (contentId !== undefined) {
    marketContentWrap.id = contentId;
  }

  marketContentWrap.innerHTML = productPage;
}; // Шаблон описания товара и его добавление на страницу


var createCartPage = function createCartPage(productObject, globalSetting) {
  var productPage; // Если переданный аргумент содержит элементы, то отрисовываем корзину с этими элементами, ...

  if (productObject.length > 0) {
    var _context29;

    productPage = "\n      <div class=\"market-cart market-content--fade-in\">\n      ".concat(_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_6___default()(productObject).call(productObject, function (item) {
      var _context20, _context21, _context22, _context23, _context24, _context25, _context26, _context27, _context28;

      return _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context20 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context21 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context22 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context23 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context24 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context25 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context26 = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context27 = "      \n        <div class=\"market-cart__product-content\">  \n          <div class=\"market-cart__img-wrap\">\n            <img src=\"https://media.lpgenerator.ru/images/".concat(globalSetting.userId, "/")).call(_context27, item.img, "\" alt=\"\">\n          </div>\n          <div class=\"market-cart__info-wrap\">\n            <h2 class=\"market-cart__title\">")).call(_context26, item.name, "</h2>\n            ")).call(_context25, item.option !== undefined ? _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context28 = "            \n              <div class=\"market-cart__option-wrap\">\n                <span class=\"market-cart__option-title\">".concat(item.option.optionName, "</span>\n                <span class=\"market-cart__option\">")).call(_context28, item.option.optionValue, "</span>\n              </div>") : "", "\n          </div>\n          <div class=\"market-cart__desc-wrap\">\n            <div class=\"market-cart__product-price-wrap\">\n              <span class=\"market-cart__product-price-title\">\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C:</span>\n              <span class=\"market-cart__product-total-price-wrap\">\n                <span class=\"market-cart__product-total-price\">")).call(_context24, item.price * item.quantity, "</span>\n                <span> ")).call(_context23, globalSetting.currency, "</span>\n              </span>\n              <span class=\"market-cart__total-product-price\">\n                <span class=\"market-cart__price-quantity\">")).call(_context22, item.quantity, "</span>\n                <span> x ")).call(_context21, item.price + " " + globalSetting.currency, "</span>\n              </span>\n            </div>\n            <div class=\"market-cart__quantity-wrap\">\n              <span>\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E:</span>\n              <div class=\"market-cart__quantity-field\">\n                <a class=\"market-cart__quantity-down\"></a>\n                <input type=\"text\" pattern=\"[0-9]\" value=\"")).call(_context20, item.quantity, "\" class=\"market-cart__quantity-input\">\n                <a class=\"market-cart__quantity-up\"></a>\n              </div>\n            </div>\n            <div class=\"market-cart__delete-wrap\">\n              <a class=\"market-cart__delete\"></a>\n            </div>\n          </div>\n        </div>\n      ");
    }).join("")) + _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_5___default()(_context29 = "<div class=\"market-cart__bottom-content\">\n          <div class=\"market-cart__total-price-wrap\">\n            <span>\u041E\u0431\u0449\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C: </span>\n            <span class=\"market-cart__total-price\">".concat(_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_0___default()(productObject).call(productObject, function (total, item) {
      return total + item.price * item.quantity;
    }, 0).toLocaleString("ru-RU"), "</span>\n            <span> ")).call(_context29, globalSetting.currency, "</span>\n          </div>\n          <a class=\"market-cart__link-to-main\">\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0435\u0449\u0451 \u0442\u043E\u0432\u0430\u0440\u044B</a>\n          <button class=\"market-btn market-cart__btn market-cart__btn--order\">\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</button>\n        </div>\n      </div>\n    ");
  } // ...иначе отрисовываем пустую корзины
  else {
      productPage = "\n    <div class=\"market-cart market-cart--empty market-content--fade-in\">\n      <div>\u0412\u0430\u0448\u0430 \u043A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430</div>\n      <a class=\"market-cart__link-to-main market-btn\">\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E</a>\n    </div>\n    ";
    }

  marketContentWrap.innerHTML = productPage;
};
/* 
Шаблон строки с инфой о товарах в блоке корзины (внутри сложные проверки окончаний - спасибо русскому языку за это)
*/


var createCartBlock = function createCartBlock(productObject, globalSetting) {
  var cartBlock; // Иконка корзины

  var iconCart = document.querySelector(".market-cart-link__icon-wrap");

  if (productObject.length > 0) {
    iconCart.classList.add("market-cart-link__icon-wrap--filled");
    cartBlock = "\n      <div class=\"market-cart-link__text-row\">\n        <span class=\"market-cart-link__price\">".concat(_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_0___default()(productObject).call(productObject, function (total, item) {
      return total + item.price * item.quantity;
    }, 0).toLocaleString("ru-RU") + " " + globalSetting.currency, "</span>\n      </div>\n    ");
  } else {
    if (iconCart.classList.contains("market-cart-link__icon-wrap--filled")) {
      iconCart.classList.remove("market-cart-link__icon-wrap--filled");
    }

    cartBlock = "\n      <div class=\"market-cart-link__empty\">\u041A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430</div>\n    ";
  } // Обёртка текста корзины


  var cartBlockText = document.querySelector(".market-cart-link__text");
  cartBlockText.innerHTML = cartBlock;
};



/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);
var classof = __webpack_require__(32);

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(127);
var global = __webpack_require__(5);
var isObject = __webpack_require__(13);
var createNonEnumerableProperty = __webpack_require__(19);
var objectHas = __webpack_require__(15);
var sharedKey = __webpack_require__(48);
var hiddenKeys = __webpack_require__(49);

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return findByName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return inputFindProduct; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return menuPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return debounce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return elementReady; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return carousel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return carouselNav; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addScrollBar; });
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(79);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(118);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_promise__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_promise__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(73);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_find__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(30);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_find__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_find__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(0);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(37);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_filter__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_filter__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(106);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(14);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(24);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_sort__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(222);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_sort__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_sort__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_set_timeout__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(72);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_set_timeout__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_set_timeout__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(85);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(31);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(38);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var perfect_scrollbar__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(223);















// Импорт кастомного скроллбара


(function (factory) {
  typeof define === "function" && __webpack_require__(226) ? define(factory) : typeof exports === "object" ? module.exports = factory() : factory();
})(function () {
  ;
  "use strict"; // eslint-disable-line no-unused-expressions

  /* globals window:true */


  var _window = typeof window !== "undefined" ? window : this;

  var Glider = _window.Glider = function (element, settings) {
    var _context, _context2;

    var _ = this;

    if (element._glider) return element._glider;
    _.ele = element;

    _.ele.classList.add("glider"); // expose glider object to its DOM element


    _.ele._glider = _; // merge user setting with defaults

    _.opt = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_14___default()({}, {
      slidesToScroll: 1,
      slidesToShow: 1,
      resizeLock: true,
      duration: 0.5,
      // easeInQuad
      easing: function easing(x, t, b, c, d) {
        return c * (t /= d) * t + b;
      }
    }, settings); // set defaults

    _.animate_id = _.page = _.slide = 0;
    _.arrows = {}; // preserve original options to
    // extend breakpoint settings

    _._opt = _.opt;

    if (_.opt.skipTrack) {
      // first and only child is the track
      _.track = _.ele.children[0];
    } else {
      // create track and wrap slides
      _.track = document.createElement("div");

      _.ele.appendChild(_.track);

      while (_.ele.children.length !== 1) {
        _.track.appendChild(_.ele.children[0]);
      }
    }

    _.track.classList.add("glider-track"); // start glider


    _.init(); // set events


    _.resize = _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_13___default()(_context = _.init).call(_context, _, true);

    _.event(_.ele, "add", {
      scroll: _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_13___default()(_context2 = _.updateControls).call(_context2, _)
    });

    _.event(_window, "add", {
      resize: _.resize
    });
  };

  var gliderPrototype = Glider.prototype;

  gliderPrototype.init = function (refresh, paging) {
    var _ = this;

    var width = 0;
    var height = 0;
    _.slides = _.track.children;

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()([]).call(_.slides, function (_) {
      _.classList.add("glider-slide");
    });

    _.containerWidth = _.ele.clientWidth;

    var breakpointChanged = _.settingsBreakpoint();

    if (!paging) paging = breakpointChanged;

    if (_.opt.slidesToShow === "auto" || _.opt._autoSlide) {
      var slideCount = _.containerWidth / _.opt.itemWidth;
      _.opt._autoSlide = _.opt.slidesToShow = _.opt.exactWidth ? slideCount : Math.floor(slideCount);
    }

    if (_.opt.slidesToScroll === "auto") {
      _.opt.slidesToScroll = Math.floor(_.opt.slidesToShow);
    }

    _.itemWidth = _.opt.exactWidth ? _.opt.itemWidth : _.containerWidth / _.opt.slidesToShow // set slide dimensions
    ;

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()([]).call(_.slides, function (__) {
      __.style.height = "auto";
      __.style.width = _.itemWidth + "px";
      width += _.itemWidth;
      height = Math.max(__.offsetHeight, height);
    });

    _.track.style.width = width + "px";
    _.trackWidth = width;
    _.opt.resizeLock && _.scrollTo(_.slide * _.itemWidth, 0);

    if (breakpointChanged || paging) {
      _.bindArrows();

      _.buildDots();

      _.bindDrag();
    }

    _.updateControls();

    _.emit(refresh ? "refresh" : "loaded");
  };

  gliderPrototype.bindDrag = function () {
    var _context3;

    var _ = this;

    _.mouse = _.mouse || _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_13___default()(_context3 = _.handleMouse).call(_context3, _);

    var mouseup = function mouseup() {
      _.mouseDown = undefined;

      _.ele.classList.remove("drag");
    };

    var events = {
      mouseup: mouseup,
      mouseleave: mouseup,
      mousedown: function mousedown(e) {
        _.mouseDown = e.clientX;

        _.ele.classList.add("drag");
      },
      mousemove: _.mouse
    };

    _.ele.classList.toggle("draggable", _.opt.draggable === true);

    _.event(_.ele, "remove", events);

    if (_.opt.draggable) _.event(_.ele, "add", events);
  };

  gliderPrototype.buildDots = function () {
    var _ = this;

    if (!_.opt.dots) {
      if (_.dots) _.dots.innerHTML = "";
      return;
    }

    if (typeof _.opt.dots === "string") {
      _.dots = document.querySelector(_.opt.dots);
    } else _.dots = _.opt.dots;

    if (!_.dots) return;
    _.dots.innerHTML = "";

    _.dots.classList.add("glider-dots");

    for (var i = 0; i < Math.ceil(_.slides.length / _.opt.slidesToShow); ++i) {
      var _context4;

      var dot = document.createElement("button");
      dot.dataset.index = i;
      dot.setAttribute("aria-label", "Page " + (i + 1));
      dot.className = "glider-dot " + (i ? "" : "active");

      _.event(dot, "add", {
        click: _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_13___default()(_context4 = _.scrollItem).call(_context4, _, i, true)
      });

      _.dots.appendChild(dot);
    }
  };

  gliderPrototype.bindArrows = function () {
    var _context6;

    var _ = this;

    if (!_.opt.arrows) {
      var _context5;

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(_context5 = _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(_.arrows)).call(_context5, function (direction) {
        var element = _.arrows[direction];

        _.event(element, "remove", {
          click: element._func
        });
      });

      return;
    }

    ;

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(_context6 = ["prev", "next"]).call(_context6, function (direction) {
      var arrow = _.opt.arrows[direction];

      if (arrow) {
        var _context7;

        if (typeof arrow === "string") arrow = document.querySelector(arrow);
        arrow._func = arrow._func || _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_13___default()(_context7 = _.scrollItem).call(_context7, _, direction);

        _.event(arrow, "remove", {
          click: arrow._func
        });

        _.event(arrow, "add", {
          click: arrow._func
        });

        _.arrows[direction] = arrow;
      }
    });
  };

  gliderPrototype.updateControls = function (event) {
    var _ = this;

    if (event && !_.opt.scrollPropagate) {
      event.stopPropagation();
    }

    var disableArrows = _.containerWidth >= _.trackWidth;

    if (!_.opt.rewind) {
      if (_.arrows.prev) {
        _.arrows.prev.classList.toggle("disabled", _.ele.scrollLeft <= 0 || disableArrows);
      }

      if (_.arrows.next) {
        _.arrows.next.classList.toggle("disabled", Math.ceil(_.ele.scrollLeft + _.containerWidth) >= Math.floor(_.trackWidth) || disableArrows);
      }
    }

    _.slide = Math.round(_.ele.scrollLeft / _.itemWidth);
    _.page = Math.round(_.ele.scrollLeft / _.containerWidth);
    var middle = _.slide + Math.floor(Math.floor(_.opt.slidesToShow) / 2);
    var extraMiddle = Math.floor(_.opt.slidesToShow) % 2 ? 0 : middle + 1;

    if (Math.floor(_.opt.slidesToShow) === 1) {
      extraMiddle = 0;
    } // the last page may be less than one half of a normal page width so
    // the page is rounded down. when at the end, force the page to turn


    if (_.ele.scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)) {
      _.page = _.dots ? _.dots.children.length - 1 : 0;
    }

    ;

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()([]).call(_.slides, function (slide, index) {
      var slideClasses = slide.classList;
      var wasVisible = slideClasses.contains("visible");
      var start = _.ele.scrollLeft;
      var end = _.ele.scrollLeft + _.containerWidth;
      var itemStart = _.itemWidth * index;
      var itemEnd = itemStart + _.itemWidth;

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()([]).call(slideClasses, function (className) {
        ;
        /^left|right/.test(className) && slideClasses.remove(className);
      });

      slideClasses.toggle("active", _.slide === index);

      if (middle === index || extraMiddle && extraMiddle === index) {
        slideClasses.add("center");
      } else {
        slideClasses.remove("center");
        slideClasses.add([index < middle ? "left" : "right", Math.abs(index - (index < middle ? middle : extraMiddle || middle))].join("-"));
      }

      var isVisible = Math.ceil(itemStart) >= start && Math.floor(itemEnd) <= end;
      slideClasses.toggle("visible", isVisible);

      if (isVisible !== wasVisible) {
        _.emit("slide-" + (isVisible ? "visible" : "hidden"), {
          slide: index
        });
      }
    });

    if (_.dots) {
      ;

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()([]).call(_.dots.children, function (dot, index) {
        dot.classList.toggle("active", _.page === index);
      });
    }

    if (event && _.opt.scrollLock) {
      clearTimeout(_.scrollLock);
      _.scrollLock = _babel_runtime_corejs3_core_js_stable_set_timeout__WEBPACK_IMPORTED_MODULE_10___default()(function () {
        clearTimeout(_.scrollLock); // dont attempt to scroll less than a pixel fraction - causes looping

        if (Math.abs(_.ele.scrollLeft / _.itemWidth - _.slide) > 0.02) {
          if (!_.mouseDown) {
            _.scrollItem(_.round(_.ele.scrollLeft / _.itemWidth));
          }
        }
      }, _.opt.scrollLockDelay || 250);
    }
  };

  gliderPrototype.scrollItem = function (slide, dot, e) {
    if (e) e.preventDefault();

    var _ = this;

    var originalSlide = slide;
    ++_.animate_id;

    if (dot === true) {
      slide = slide * _.containerWidth;
      slide = Math.round(slide / _.itemWidth) * _.itemWidth;
    } else {
      if (typeof slide === "string") {
        var backwards = slide === "prev"; // use precise location if fractional slides are on

        if (_.opt.slidesToScroll % 1 || _.opt.slidesToShow % 1) {
          slide = _.round(_.ele.scrollLeft / _.itemWidth);
        } else {
          slide = _.slide;
        }

        if (backwards) slide -= _.opt.slidesToScroll;else slide += _.opt.slidesToScroll;

        if (_.opt.rewind) {
          var scrollLeft = _.ele.scrollLeft;
          slide = backwards && !scrollLeft ? _.slides.length : !backwards && scrollLeft + _.containerWidth >= Math.floor(_.trackWidth) ? 0 : slide;
        }
      }

      slide = Math.max(Math.min(slide, _.slides.length), 0);
      _.slide = slide;
      slide = _.itemWidth * slide;
    }

    _.scrollTo(slide, _.opt.duration * Math.abs(_.ele.scrollLeft - slide), function () {
      _.updateControls();

      _.emit("animated", {
        value: originalSlide,
        type: typeof originalSlide === "string" ? "arrow" : dot ? "dot" : "slide"
      });
    });

    return false;
  };

  gliderPrototype.settingsBreakpoint = function () {
    var _ = this;

    var resp = _._opt.responsive;

    if (resp) {
      // Sort the breakpoints in mobile first order
      _babel_runtime_corejs3_core_js_stable_instance_sort__WEBPACK_IMPORTED_MODULE_9___default()(resp).call(resp, function (a, b) {
        return b.breakpoint - a.breakpoint;
      });

      for (var i = 0; i < resp.length; ++i) {
        var size = resp[i];

        if (_window.innerWidth >= size.breakpoint) {
          if (_.breakpoint !== size.breakpoint) {
            _.opt = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_14___default()({}, _._opt, size.settings);
            _.breakpoint = size.breakpoint;
            return true;
          }

          return false;
        }
      }
    } // set back to defaults in case they were overriden


    var breakpointChanged = _.breakpoint !== 0;
    _.opt = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_14___default()({}, _._opt);
    _.breakpoint = 0;
    return breakpointChanged;
  };

  gliderPrototype.scrollTo = function (scrollTarget, scrollDuration, callback) {
    var _ = this;

    var start = new Date().getTime();
    var animateIndex = _.animate_id;

    var animate = function animate() {
      var now = new Date().getTime() - start;
      _.ele.scrollLeft = _.ele.scrollLeft + (scrollTarget - _.ele.scrollLeft) * _.opt.easing(0, now, 0, 1, scrollDuration);

      if (now < scrollDuration && animateIndex === _.animate_id) {
        _window.requestAnimationFrame(animate);
      } else {
        _.ele.scrollLeft = scrollTarget;
        callback && callback.call(_);
      }
    };

    _window.requestAnimationFrame(animate);
  };

  gliderPrototype.removeItem = function (index) {
    var _ = this;

    if (_.slides.length) {
      _.track.removeChild(_.slides[index]);

      _.refresh(true);

      _.emit("remove");
    }
  };

  gliderPrototype.addItem = function (ele) {
    var _ = this;

    _.track.appendChild(ele);

    _.refresh(true);

    _.emit("add");
  };

  gliderPrototype.handleMouse = function (e) {
    var _ = this;

    if (_.mouseDown) {
      _.ele.scrollLeft += (_.mouseDown - e.clientX) * (_.opt.dragVelocity || 3.3);
      _.mouseDown = e.clientX;
    }
  }; // used to round to the nearest 0.XX fraction


  gliderPrototype.round = function (double) {
    var _ = this;

    var step = _.opt.slidesToScroll % 1 || 1;
    var inv = 1.0 / step;
    return Math.round(double * inv) / inv;
  };

  gliderPrototype.refresh = function (paging) {
    var _ = this;

    _.init(true, paging);
  };

  gliderPrototype.setOption = function (opt, global) {
    var _ = this;

    if (_.breakpoint && !global) {
      var _context8;

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(_context8 = _._opt.responsive).call(_context8, function (v) {
        if (v.breakpoint === _.breakpoint) {
          v.settings = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_14___default()({}, v.settings, opt);
        }
      });
    } else {
      _._opt = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_14___default()({}, _._opt, opt);
    }

    _.breakpoint = 0;

    _.settingsBreakpoint();
  };

  gliderPrototype.destroy = function () {
    var _ = this;

    var replace = _.ele.cloneNode(true);

    var clear = function clear(ele) {
      ele.removeAttribute("style");

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()([]).call(ele.classList, function (className) {
        ;
        /^glider/.test(className) && ele.classList.remove(className);
      });
    }; // remove track


    replace.children[0].outerHTML = replace.children[0].innerHTML;
    clear(replace);

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()([]).call(replace.getElementsByTagName("*"), clear);

    _.ele.parentNode.replaceChild(replace, _.ele);

    _.event(_window, "remove", {
      resize: _.resize
    });

    _.emit("destroy");
  };

  gliderPrototype.emit = function (name, arg) {
    var _ = this;

    var e = new _window.CustomEvent("glider-" + name, {
      bubbles: !_.opt.eventPropagate,
      detail: arg
    });

    _.ele.dispatchEvent(e);
  };

  gliderPrototype.event = function (ele, type, args) {
    var _context9, _context10;

    var eventHandler = _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_13___default()(_context9 = ele[type + "EventListener"]).call(_context9, ele);

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(_context10 = _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(args)).call(_context10, function (k) {
      eventHandler(k, args[k]);
    });
  };

  return Glider;
});
/* Рекурсивный поиск одного элемента по всему массиву
  Функция, принимающая на вход:
    arr - сам массив
    name - имя поиска
*/


var findByName = function findByName(arr, id, name) {
  return _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_8___default()(arr).call(arr, function (a, item) {
    // При первой итерации этот if пропускается, потому что передаётся null
    if (a) return a; // Если текущий элемент массива содержит нужное имя, возращаем его. Если нет, то..

    if (item.id === id && item.name === name) return item; // ..берём элемент с ключом nestingKey и снова ищём в нём нужное имя, либо..

    if ("subCategory" in item) return findByName(item.subCategory, id, name); // ..если нужно найти элемент в списке товаров в категории

    if ("productsInCategory" in item) return findByName(item.productsInCategory, id, name);
  }, null);
};
/* 
  Возвращает найденные элементы
  ! функция в функции, потому что привязка к внешней переменной
*/


var inputFindProduct = function inputFindProduct(arr, nameFromInput) {
  // [] с найденными через input элементами
  var foundItems = [];
  /**
   * Рекурсивный поиск всех элементов по всему массиву
   * ! здесь в блоке else привязка к subCategory из массива
   * @param {array} arr - массив, по которому осуществляется поиск
   * @param {string} searchName - имя поиска
   */

  var findProduct = function findProduct(arr, searchName) {
    if (arr !== undefined) {
      // Проходим по каждому элементу массива
      _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_7___default()(arr).call(arr, function (item) {
        var _context11;

        if (_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_6___default()(_context11 = item.name.toLowerCase()).call(_context11, searchName)) {
          foundItems.push(item);
        } // Если элемент массива содержит ключ поиска, то..
        else if ("productsInCategory" in item) {
            var _context12;

            /* Фильтруем переданный массив по имени поиска
                В каждом элементе ищем имя
                  приводим его к нижнему регистру
                  и проверяем на содержание символов, переданных в атрибуте searchName
            */
            var newItem = _babel_runtime_corejs3_core_js_stable_instance_filter__WEBPACK_IMPORTED_MODULE_5___default()(_context12 = item.productsInCategory).call(_context12, function (item) {
              var _context13;

              return _babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_6___default()(_context13 = item.name.toLowerCase()).call(_context13, searchName);
            }); // Добавляем отфильтрованный массив во внешнюю переменную foundItems


            foundItems = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_4___default()(foundItems).call(foundItems, newItem);
            return foundItems;
          } else {
            // Иначе снова вызываем функцию поиска в подкатегории
            return findProduct(item.subCategory, searchName);
          }
      });
    }
  }; // ! привязка к исходнуму массиву с данными и названиями категорий


  findProduct(arr, nameFromInput.toLowerCase());
  return foundItems;
}; // Путь к элементу (для меню из поиска)


var menuPath = function menuPath(arr, id, name) {
  var items = [];
  var stopFind = true;

  var pushData = function pushData(arr, id, name) {
    arr.push({
      id: id,
      name: name
    });
  };

  var find = function find(arr, findId, findName) {
    _babel_runtime_corejs3_core_js_stable_instance_find__WEBPACK_IMPORTED_MODULE_3___default()(arr).call(arr, function (item) {
      if (item.id === findId && item.name === findName) {
        // Добавлять или нет айди и имя найденного элемента
        // pushData(items, item.id, item.name)
        stopFind = false;
      } else if (stopFind) {
        if ("subCategory" in item) {
          // Если в этой ветке содержится нужный элемент
          var there = function there(newItem) {
            return _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_2___default()(newItem).call(newItem, function (product) {
              if (product.id === findId && product.name === findName) {
                pushData(items, item.id, item.name);
              } else if ("subCategory" in product) {
                there(product.subCategory);
              } else if ("productsInCategory" in product) {
                there(product.productsInCategory);
              }
            });
          };

          there(item.subCategory);
          return find(item.subCategory, findId, findName);
        } else if ("productsInCategory" in item) {
          var _context14;

          // Если в этой категории содержится нужный элемент
          var _there = _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_2___default()(_context14 = item.productsInCategory).call(_context14, function (product) {
            return product.id === findId && product.name === findName;
          });

          if (_there) {
            pushData(items, item.id, item.name);
          }

          return find(item.productsInCategory, findId, findName);
        }
      }
    });
  };

  find(arr, id, name);
  return items;
}; // Функция задержки выполнения функции


var debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = _babel_runtime_corejs3_core_js_stable_set_timeout__WEBPACK_IMPORTED_MODULE_10___default()(function () {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);
    if (callNow) func.apply(context, args);
  };
}; // Проверка, сенсорное ли устройство


var isTouchDevice = function isTouchDevice() {
  var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");

  var mq = function mq(query) {
    return window.matchMedia(query).matches;
  };

  if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  var query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
  return mq(query);
};

var elementReady = function elementReady(selector) {
  return new _babel_runtime_corejs3_core_js_stable_promise__WEBPACK_IMPORTED_MODULE_1___default.a(function (resolve) {
    var el = document.querySelector(selector);

    if (el) {
      resolve(el);
    }

    new MutationObserver(function (mutationRecords, observer) {
      var _context15;

      // Query for elements matching the specified selector
      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(_context15 = _babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_0___default()(document.querySelectorAll(selector))).call(_context15, function (element) {
        resolve(element); //Once we have resolved we don`t need the observer anymore.

        observer.disconnect();
      });
    }).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  });
};

var addScrollBar = function addScrollBar(element) {
  // Добавляем скроллбар, если это не тач-устройство
  if (isTouchDevice() === false) {
    new perfect_scrollbar__WEBPACK_IMPORTED_MODULE_15__[/* default */ "a"](element);
  }
}; // Создание карусели и скролбара


var carousel = function carousel(width, horizontal) {
  // Обёртка контента страницы
  var marketContentWrap = document.querySelector(".market-content"); // Размер обёртки карусели

  var carouselWrap = document.querySelector(".market-products__list");

  if (!horizontal) {
    // Добавляем списку вертикальную раскладку
    marketContentWrap.querySelector(".market-products__list").classList.add("market-products__list--vertical");
  }

  elementReady(".market-products__list").then(function (element) {
    // Проверяем, больше ли длина списка элементов блока, в котором они находятся
    if (element.offsetWidth < width) {
      marketContentWrap.classList.add("market-content--shadow");

      if (horizontal) {
        // Создаём карусель
        new Glider(carouselWrap, {
          slidesToShow: "auto",
          slidesToScroll: "auto",
          dots: ".dots",
          dragVelocity: 1,
          responsive: [{
            // screens greater than >= 775px
            breakpoint: 775,
            settings: {
              draggable: true
            }
          }, {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3.5,
              slidesToScroll: 1,
              draggable: true
            }
          }]
        }); // Проверка, долистан ли скролл до конца блока

        var checkScrollY = function checkScrollY(element) {
          var maxScrollLeft = carouselWrap.scrollWidth - carouselWrap.clientWidth; // Расчёт максимального скролла с запасом

          if (element.scrollLeft >= maxScrollLeft - 15) {
            marketContentWrap.classList.remove("market-content--shadow");
          } else {
            marketContentWrap.classList.add("market-content--shadow");
          }
        }; // Прокрутка контекта внутри блока


        carouselWrap.addEventListener("wheel", function (e) {
          if (e.deltaY > 0) this.scrollLeft += 50;else this.scrollLeft -= 50;
          checkScrollY(this);
        });
        carouselWrap.addEventListener("scroll", function () {
          checkScrollY(this);
        });
      } else {
        // Проверка, долистан ли скролл до конца блока
        var checkScrollX = function checkScrollX(element) {
          var maxScrollBottom = carouselWrap.scrollHeight - carouselWrap.clientHeight; // Расчёт максимального скролла с запасом

          if (element.scrollTop >= maxScrollBottom - 15) {
            marketContentWrap.classList.remove("market-content--shadow");
          } else {
            marketContentWrap.classList.add("market-content--shadow");
          }
        }; // * сюда можно сделать какой-нибудь эффект при пролистывания до низа блока


        carouselWrap.addEventListener("scroll", function () {// checkScrollX(this)
        });
      }

      addScrollBar(carouselWrap);
    }
  });
}; // Карусель навигации


var carouselNav = function carouselNav(width) {
  var nav = document.querySelector(".market-header__nav");

  if (nav.offsetWidth < width) {
    new Glider(nav, {
      slidesToShow: "auto",
      dragVelocity: 1,
      draggable: true
    }).scrollTo(width);
  }
};


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(124)(module)))

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(40);
var Iterators = __webpack_require__(27);
var wellKnownSymbol = __webpack_require__(3);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(6);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(136);

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__(35);
var store = __webpack_require__(88);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.4',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 65 */
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(50);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(3);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);
var isArray = __webpack_require__(36);
var wellKnownSymbol = __webpack_require__(3);

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(203);

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(218);

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(239);

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var isObject = __webpack_require__(13);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var propertyIsEnumerableModule = __webpack_require__(58);
var createPropertyDescriptor = __webpack_require__(39);
var toIndexedObject = __webpack_require__(23);
var toPrimitive = __webpack_require__(47);
var has = __webpack_require__(15);
var IE8_DOM_DEFINE = __webpack_require__(89);

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);
var defineProperties = __webpack_require__(130);
var enumBugKeys = __webpack_require__(68);
var hiddenKeys = __webpack_require__(49);
var html = __webpack_require__(110);
var documentCreateElement = __webpack_require__(74);
var sharedKey = __webpack_require__(48);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var userAgent = __webpack_require__(78);

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(33);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(154);

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(235);

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(15);
var toObject = __webpack_require__(18);
var sharedKey = __webpack_require__(48);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(120);

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(3);

exports.f = wellKnownSymbol;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(166);

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(125);

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(247);

/***/ }),
/* 86 */,
/* 87 */,
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var setGlobal = __webpack_require__(128);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var fails = __webpack_require__(6);
var createElement = __webpack_require__(74);

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var createIteratorConstructor = __webpack_require__(129);
var getPrototypeOf = __webpack_require__(81);
var setPrototypeOf = __webpack_require__(121);
var setToStringTag = __webpack_require__(34);
var createNonEnumerableProperty = __webpack_require__(19);
var redefine = __webpack_require__(51);
var wellKnownSymbol = __webpack_require__(3);
var IS_PURE = __webpack_require__(35);
var Iterators = __webpack_require__(27);
var IteratorsCore = __webpack_require__(91);

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getPrototypeOf = __webpack_require__(81);
var createNonEnumerableProperty = __webpack_require__(19);
var has = __webpack_require__(15);
var wellKnownSymbol = __webpack_require__(3);
var IS_PURE = __webpack_require__(35);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__(66);

module.exports = NATIVE_SYMBOL
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(15);
var toIndexedObject = __webpack_require__(23);
var indexOf = __webpack_require__(109).indexOf;
var hiddenKeys = __webpack_require__(49);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(137);
var path = __webpack_require__(10);

module.exports = path.Array.isArray;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var fails = __webpack_require__(6);
var isArray = __webpack_require__(36);
var isObject = __webpack_require__(13);
var toObject = __webpack_require__(18);
var toLength = __webpack_require__(25);
var createProperty = __webpack_require__(52);
var arraySpeciesCreate = __webpack_require__(70);
var arrayMethodHasSpeciesSupport = __webpack_require__(41);
var wellKnownSymbol = __webpack_require__(3);
var V8_VERSION = __webpack_require__(77);

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(93);
var enumBugKeys = __webpack_require__(68);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(43);
__webpack_require__(155);
var path = __webpack_require__(10);

module.exports = path.Array.from;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var slice = __webpack_require__(158);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.slice;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.slice) ? slice : own;
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(161);

/***/ }),
/* 100 */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(163);

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(164);

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var _Array$from = __webpack_require__(101);

var _sliceInstanceProperty = __webpack_require__(172);

var arrayLikeToArray = __webpack_require__(100);

function _unsupportedIterableToArray(o, minLen) {
  var _context;

  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);

  var n = _sliceInstanceProperty(_context = Object.prototype.toString.call(o)).call(_context, 8, -1);

  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return _Array$from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(157);

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(179);

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(260);

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(88);

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(23);
var toLength = __webpack_require__(25);
var toAbsoluteIndex = __webpack_require__(67);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(33);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(95);
__webpack_require__(112);
__webpack_require__(138);
__webpack_require__(139);
__webpack_require__(140);
__webpack_require__(141);
__webpack_require__(142);
__webpack_require__(123);
__webpack_require__(143);
__webpack_require__(144);
__webpack_require__(145);
__webpack_require__(146);
__webpack_require__(147);
__webpack_require__(148);
__webpack_require__(149);
__webpack_require__(150);
__webpack_require__(151);
__webpack_require__(152);
__webpack_require__(153);
var path = __webpack_require__(10);

module.exports = path.Symbol;


/***/ }),
/* 112 */
/***/ (function(module, exports) {

// empty


/***/ }),
/* 113 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(3);
var Iterators = __webpack_require__(27);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(3);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(28);

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(250);

/***/ }),
/* 119 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);
var aPossiblePrototype = __webpack_require__(132);

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(23);
var nativeGetOwnPropertyNames = __webpack_require__(96).f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),
/* 124 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(42);
__webpack_require__(43);
var getIterator = __webpack_require__(135);

module.exports = getIterator;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(23);
var addToUnscopables = __webpack_require__(60);
var Iterators = __webpack_require__(27);
var InternalStateModule = __webpack_require__(57);
var defineIterator = __webpack_require__(90);

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var inspectSource = __webpack_require__(107);

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var createNonEnumerableProperty = __webpack_require__(19);

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__(91).IteratorPrototype;
var create = __webpack_require__(76);
var createPropertyDescriptor = __webpack_require__(39);
var setToStringTag = __webpack_require__(34);
var Iterators = __webpack_require__(27);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var definePropertyModule = __webpack_require__(26);
var anObject = __webpack_require__(17);
var objectKeys = __webpack_require__(46);

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(69);
var classof = __webpack_require__(40);

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),
/* 133 */
/***/ (function(module, exports) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(50);
var requireObjectCoercible = __webpack_require__(56);

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);
var getIteratorMethod = __webpack_require__(61);

module.exports = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(94);

module.exports = parent;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var isArray = __webpack_require__(36);

// `Array.isArray` method
// https://tc39.github.io/ecma262/#sec-array.isarray
$({ target: 'Array', stat: true }, {
  isArray: isArray
});


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var global = __webpack_require__(5);
var getBuiltIn = __webpack_require__(33);
var IS_PURE = __webpack_require__(35);
var DESCRIPTORS = __webpack_require__(16);
var NATIVE_SYMBOL = __webpack_require__(66);
var USE_SYMBOL_AS_UID = __webpack_require__(92);
var fails = __webpack_require__(6);
var has = __webpack_require__(15);
var isArray = __webpack_require__(36);
var isObject = __webpack_require__(13);
var anObject = __webpack_require__(17);
var toObject = __webpack_require__(18);
var toIndexedObject = __webpack_require__(23);
var toPrimitive = __webpack_require__(47);
var createPropertyDescriptor = __webpack_require__(39);
var nativeObjectCreate = __webpack_require__(76);
var objectKeys = __webpack_require__(46);
var getOwnPropertyNamesModule = __webpack_require__(96);
var getOwnPropertyNamesExternal = __webpack_require__(122);
var getOwnPropertySymbolsModule = __webpack_require__(113);
var getOwnPropertyDescriptorModule = __webpack_require__(75);
var definePropertyModule = __webpack_require__(26);
var propertyIsEnumerableModule = __webpack_require__(58);
var createNonEnumerableProperty = __webpack_require__(19);
var redefine = __webpack_require__(51);
var shared = __webpack_require__(64);
var sharedKey = __webpack_require__(48);
var hiddenKeys = __webpack_require__(49);
var uid = __webpack_require__(65);
var wellKnownSymbol = __webpack_require__(3);
var wrappedWellKnownSymbolModule = __webpack_require__(82);
var defineWellKnownSymbol = __webpack_require__(4);
var setToStringTag = __webpack_require__(34);
var InternalStateModule = __webpack_require__(57);
var $forEach = __webpack_require__(29).forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.asyncIterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');


/***/ }),
/* 140 */
/***/ (function(module, exports) {

// empty


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.hasInstance` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.match` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.matchAll` well-known symbol
defineWellKnownSymbol('matchAll');


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.replace` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.search` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.species` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.split` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.toPrimitive` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.toStringTag` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.unscopables` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var setToStringTag = __webpack_require__(34);

// Math[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var setToStringTag = __webpack_require__(34);

// JSON[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(97);

module.exports = parent;


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var from = __webpack_require__(156);
var checkCorrectnessOfIteration = __webpack_require__(116);

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(45);
var toObject = __webpack_require__(18);
var callWithSafeIterationClosing = __webpack_require__(114);
var isArrayIteratorMethod = __webpack_require__(115);
var toLength = __webpack_require__(25);
var createProperty = __webpack_require__(52);
var getIteratorMethod = __webpack_require__(61);

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(98);

module.exports = parent;


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(159);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').slice;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var isObject = __webpack_require__(13);
var isArray = __webpack_require__(36);
var toAbsoluteIndex = __webpack_require__(67);
var toLength = __webpack_require__(25);
var toIndexedObject = __webpack_require__(23);
var createProperty = __webpack_require__(52);
var wellKnownSymbol = __webpack_require__(3);
var arrayMethodHasSpeciesSupport = __webpack_require__(41);
var arrayMethodUsesToLength = __webpack_require__(20);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
var USES_TO_LENGTH = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var _Array$isArray = __webpack_require__(99);

var arrayLikeToArray = __webpack_require__(100);

function _arrayWithoutHoles(arr) {
  if (_Array$isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(94);

module.exports = parent;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var _Array$from = __webpack_require__(101);

var _isIterable = __webpack_require__(102);

var _Symbol = __webpack_require__(83);

function _iterableToArray(iter) {
  if (typeof _Symbol !== "undefined" && _isIterable(Object(iter))) return _Array$from(iter);
}

module.exports = _iterableToArray;

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(97);

module.exports = parent;


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(42);
__webpack_require__(43);
var isIterable = __webpack_require__(165);

module.exports = isIterable;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(40);
var wellKnownSymbol = __webpack_require__(3);
var Iterators = __webpack_require__(27);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(111);
__webpack_require__(167);
__webpack_require__(168);
__webpack_require__(169);
__webpack_require__(170);
// TODO: Remove from `core-js@4`
__webpack_require__(171);

module.exports = parent;


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.asyncDispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('asyncDispose');


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('dispose');


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol('observable');


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('patternMatch');


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

// TODO: remove from `core-js@4`
var defineWellKnownSymbol = __webpack_require__(4);

defineWellKnownSymbol('replaceAll');


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(173);

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(98);

module.exports = parent;


/***/ }),
/* 174 */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(176);

module.exports = parent;


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var map = __webpack_require__(177);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.map;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.map) ? map : own;
};


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(178);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').map;


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $map = __webpack_require__(29).map;
var arrayMethodHasSpeciesSupport = __webpack_require__(41);
var arrayMethodUsesToLength = __webpack_require__(20);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
// FF49- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('map');

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(180);

module.exports = parent;


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

var splice = __webpack_require__(181);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.splice;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.splice) ? splice : own;
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(182);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').splice;


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var toAbsoluteIndex = __webpack_require__(67);
var toInteger = __webpack_require__(50);
var toLength = __webpack_require__(25);
var toObject = __webpack_require__(18);
var arraySpeciesCreate = __webpack_require__(70);
var createProperty = __webpack_require__(52);
var arrayMethodHasSpeciesSupport = __webpack_require__(41);
var arrayMethodUsesToLength = __webpack_require__(20);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
var USES_TO_LENGTH = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(184);

module.exports = parent;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

var reduce = __webpack_require__(185);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.reduce;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.reduce) ? reduce : own;
};


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(186);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').reduce;


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $reduce = __webpack_require__(187).left;
var arrayMethodIsStrict = __webpack_require__(62);
var arrayMethodUsesToLength = __webpack_require__(20);

var STRICT_METHOD = arrayMethodIsStrict('reduce');
var USES_TO_LENGTH = arrayMethodUsesToLength('reduce', { 1: 0 });

// `Array.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(28);
var toObject = __webpack_require__(18);
var IndexedObject = __webpack_require__(55);
var toLength = __webpack_require__(25);

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(189);

module.exports = parent;


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

var concat = __webpack_require__(190);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.concat;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.concat) ? concat : own;
};


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(95);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').concat;


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(192);

module.exports = parent;


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

var find = __webpack_require__(193);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.find;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.find) ? find : own;
};


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(194);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').find;


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $find = __webpack_require__(29).find;
var addToUnscopables = __webpack_require__(60);
var arrayMethodUsesToLength = __webpack_require__(20);

var FIND = 'find';
var SKIPS_HOLES = true;

var USES_TO_LENGTH = arrayMethodUsesToLength(FIND);

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.github.io/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(42);
var forEach = __webpack_require__(196);
var classof = __webpack_require__(40);
var ArrayPrototype = Array.prototype;

var DOMIterables = {
  DOMTokenList: true,
  NodeList: true
};

module.exports = function (it) {
  var own = it.forEach;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.forEach)
    // eslint-disable-next-line no-prototype-builtins
    || DOMIterables.hasOwnProperty(classof(it)) ? forEach : own;
};


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(197);

module.exports = parent;


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(198);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').forEach;


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var forEach = __webpack_require__(199);

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__(29).forEach;
var arrayMethodIsStrict = __webpack_require__(62);
var arrayMethodUsesToLength = __webpack_require__(20);

var STRICT_METHOD = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

var _Array$isArray = __webpack_require__(99);

function _arrayWithHoles(arr) {
  if (_Array$isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

var _getIterator = __webpack_require__(84);

var _isIterable = __webpack_require__(102);

var _Symbol = __webpack_require__(83);

function _iterableToArrayLimit(arr, i) {
  if (typeof _Symbol === "undefined" || !_isIterable(Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),
/* 202 */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(204);

module.exports = parent;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(205);
var path = __webpack_require__(10);

module.exports = path.Object.entries;


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var $entries = __webpack_require__(206).entries;

// `Object.entries` method
// https://tc39.github.io/ecma262/#sec-object.entries
$({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var objectKeys = __webpack_require__(46);
var toIndexedObject = __webpack_require__(23);
var propertyIsEnumerable = __webpack_require__(58).f;

// `Object.{ entries, values }` methods implementation
var createMethod = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(O, key)) {
        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

module.exports = {
  // `Object.entries` method
  // https://tc39.github.io/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.github.io/ecma262/#sec-object.values
  values: createMethod(false)
};


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);

module.exports = global.Promise;


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);
var isArrayIteratorMethod = __webpack_require__(115);
var toLength = __webpack_require__(25);
var bind = __webpack_require__(45);
var getIteratorMethod = __webpack_require__(61);
var callWithSafeIterationClosing = __webpack_require__(114);

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = bind(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, next, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);
var aFunction = __webpack_require__(28);
var wellKnownSymbol = __webpack_require__(3);

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var fails = __webpack_require__(6);
var classof = __webpack_require__(32);
var bind = __webpack_require__(45);
var html = __webpack_require__(110);
var createElement = __webpack_require__(74);
var IS_IOS = __webpack_require__(211);

var location = global.location;
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (classof(process) == 'process') {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    typeof postMessage == 'function' &&
    !global.importScripts &&
    !fails(post) &&
    location.protocol !== 'file:'
  ) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

var userAgent = __webpack_require__(78);

module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);
var isObject = __webpack_require__(13);
var newPromiseCapability = __webpack_require__(117);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 213 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(215);

module.exports = parent;


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

var filter = __webpack_require__(216);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.filter;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.filter) ? filter : own;
};


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(217);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').filter;


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $filter = __webpack_require__(29).filter;
var arrayMethodHasSpeciesSupport = __webpack_require__(41);
var arrayMethodUsesToLength = __webpack_require__(20);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
// Edge 14- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(219);
var path = __webpack_require__(10);

module.exports = path.setTimeout;


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var global = __webpack_require__(5);
var userAgent = __webpack_require__(78);

var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

var wrap = function (scheduler) {
  return function (handler, timeout /* , ...arguments */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
    } : handler, timeout);
  };
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
$({ global: true, bind: true, forced: MSIE }, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global.setInterval)
});


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(233);

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(234);

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(269);

/***/ }),
/* 223 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*!
 * perfect-scrollbar v1.5.0
 * Copyright 2020 Hyunje Jun, MDBootstrap and Contributors
 * Licensed under MIT
 */

function get(element) {
  return getComputedStyle(element);
}

function set(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val + "px";
    }
    element.style[key] = val;
  }
  return element;
}

function div(className) {
  var div = document.createElement('div');
  div.className = className;
  return div;
}

var elMatches =
  typeof Element !== 'undefined' &&
  (Element.prototype.matches ||
    Element.prototype.webkitMatchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector);

function matches(element, query) {
  if (!elMatches) {
    throw new Error('No element matching method supported');
  }

  return elMatches.call(element, query);
}

function remove(element) {
  if (element.remove) {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

function queryChildren(element, selector) {
  return Array.prototype.filter.call(element.children, function (child) { return matches(child, selector); }
  );
}

var cls = {
  main: 'ps',
  rtl: 'ps__rtl',
  element: {
    thumb: function (x) { return ("ps__thumb-" + x); },
    rail: function (x) { return ("ps__rail-" + x); },
    consuming: 'ps__child--consume',
  },
  state: {
    focus: 'ps--focus',
    clicking: 'ps--clicking',
    active: function (x) { return ("ps--active-" + x); },
    scrolling: function (x) { return ("ps--scrolling-" + x); },
  },
};

/*
 * Helper methods
 */
var scrollingClassTimeout = { x: null, y: null };

function addScrollingClass(i, x) {
  var classList = i.element.classList;
  var className = cls.state.scrolling(x);

  if (classList.contains(className)) {
    clearTimeout(scrollingClassTimeout[x]);
  } else {
    classList.add(className);
  }
}

function removeScrollingClass(i, x) {
  scrollingClassTimeout[x] = setTimeout(
    function () { return i.isAlive && i.element.classList.remove(cls.state.scrolling(x)); },
    i.settings.scrollingThreshold
  );
}

function setScrollingClassInstantly(i, x) {
  addScrollingClass(i, x);
  removeScrollingClass(i, x);
}

var EventElement = function EventElement(element) {
  this.element = element;
  this.handlers = {};
};

var prototypeAccessors = { isEmpty: { configurable: true } };

EventElement.prototype.bind = function bind (eventName, handler) {
  if (typeof this.handlers[eventName] === 'undefined') {
    this.handlers[eventName] = [];
  }
  this.handlers[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function unbind (eventName, target) {
    var this$1 = this;

  this.handlers[eventName] = this.handlers[eventName].filter(function (handler) {
    if (target && handler !== target) {
      return true;
    }
    this$1.element.removeEventListener(eventName, handler, false);
    return false;
  });
};

EventElement.prototype.unbindAll = function unbindAll () {
  for (var name in this.handlers) {
    this.unbind(name);
  }
};

prototypeAccessors.isEmpty.get = function () {
    var this$1 = this;

  return Object.keys(this.handlers).every(
    function (key) { return this$1.handlers[key].length === 0; }
  );
};

Object.defineProperties( EventElement.prototype, prototypeAccessors );

var EventManager = function EventManager() {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function eventElement (element) {
  var ee = this.eventElements.filter(function (ee) { return ee.element === element; })[0];
  if (!ee) {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function bind (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function unbind (element, eventName, handler) {
  var ee = this.eventElement(element);
  ee.unbind(eventName, handler);

  if (ee.isEmpty) {
    // remove
    this.eventElements.splice(this.eventElements.indexOf(ee), 1);
  }
};

EventManager.prototype.unbindAll = function unbindAll () {
  this.eventElements.forEach(function (e) { return e.unbindAll(); });
  this.eventElements = [];
};

EventManager.prototype.once = function once (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (evt) {
    ee.unbind(eventName, onceHandler);
    handler(evt);
  };
  ee.bind(eventName, onceHandler);
};

function createEvent(name) {
  if (typeof window.CustomEvent === 'function') {
    return new CustomEvent(name);
  } else {
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, false, false, undefined);
    return evt;
  }
}

function processScrollDiff(
  i,
  axis,
  diff,
  useScrollingClass,
  forceFireReachEvent
) {
  if ( useScrollingClass === void 0 ) useScrollingClass = true;
  if ( forceFireReachEvent === void 0 ) forceFireReachEvent = false;

  var fields;
  if (axis === 'top') {
    fields = [
      'contentHeight',
      'containerHeight',
      'scrollTop',
      'y',
      'up',
      'down' ];
  } else if (axis === 'left') {
    fields = [
      'contentWidth',
      'containerWidth',
      'scrollLeft',
      'x',
      'left',
      'right' ];
  } else {
    throw new Error('A proper axis should be provided');
  }

  processScrollDiff$1(i, diff, fields, useScrollingClass, forceFireReachEvent);
}

function processScrollDiff$1(
  i,
  diff,
  ref,
  useScrollingClass,
  forceFireReachEvent
) {
  var contentHeight = ref[0];
  var containerHeight = ref[1];
  var scrollTop = ref[2];
  var y = ref[3];
  var up = ref[4];
  var down = ref[5];
  if ( useScrollingClass === void 0 ) useScrollingClass = true;
  if ( forceFireReachEvent === void 0 ) forceFireReachEvent = false;

  var element = i.element;

  // reset reach
  i.reach[y] = null;

  // 1 for subpixel rounding
  if (element[scrollTop] < 1) {
    i.reach[y] = 'start';
  }

  // 1 for subpixel rounding
  if (element[scrollTop] > i[contentHeight] - i[containerHeight] - 1) {
    i.reach[y] = 'end';
  }

  if (diff) {
    element.dispatchEvent(createEvent(("ps-scroll-" + y)));

    if (diff < 0) {
      element.dispatchEvent(createEvent(("ps-scroll-" + up)));
    } else if (diff > 0) {
      element.dispatchEvent(createEvent(("ps-scroll-" + down)));
    }

    if (useScrollingClass) {
      setScrollingClassInstantly(i, y);
    }
  }

  if (i.reach[y] && (diff || forceFireReachEvent)) {
    element.dispatchEvent(createEvent(("ps-" + y + "-reach-" + (i.reach[y]))));
  }
}

function toInt(x) {
  return parseInt(x, 10) || 0;
}

function isEditable(el) {
  return (
    matches(el, 'input,[contenteditable]') ||
    matches(el, 'select,[contenteditable]') ||
    matches(el, 'textarea,[contenteditable]') ||
    matches(el, 'button,[contenteditable]')
  );
}

function outerWidth(element) {
  var styles = get(element);
  return (
    toInt(styles.width) +
    toInt(styles.paddingLeft) +
    toInt(styles.paddingRight) +
    toInt(styles.borderLeftWidth) +
    toInt(styles.borderRightWidth)
  );
}

var env = {
  isWebKit:
    typeof document !== 'undefined' &&
    'WebkitAppearance' in document.documentElement.style,
  supportsTouch:
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      ('maxTouchPoints' in window.navigator &&
        window.navigator.maxTouchPoints > 0) ||
      (window.DocumentTouch && document instanceof window.DocumentTouch)),
  supportsIePointer:
    typeof navigator !== 'undefined' && navigator.msMaxTouchPoints,
  isChrome:
    typeof navigator !== 'undefined' &&
    /Chrome/i.test(navigator && navigator.userAgent),
};

function updateGeometry(i) {
  var element = i.element;
  var roundedScrollTop = Math.floor(element.scrollTop);
  var rect = element.getBoundingClientRect();

  i.containerWidth = Math.ceil(rect.width);
  i.containerHeight = Math.ceil(rect.height);
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  if (!element.contains(i.scrollbarXRail)) {
    // clean up and append
    queryChildren(element, cls.element.rail('x')).forEach(function (el) { return remove(el); }
    );
    element.appendChild(i.scrollbarXRail);
  }
  if (!element.contains(i.scrollbarYRail)) {
    // clean up and append
    queryChildren(element, cls.element.rail('y')).forEach(function (el) { return remove(el); }
    );
    element.appendChild(i.scrollbarYRail);
  }

  if (
    !i.settings.suppressScrollX &&
    i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth
  ) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(
      i,
      toInt((i.railXWidth * i.containerWidth) / i.contentWidth)
    );
    i.scrollbarXLeft = toInt(
      ((i.negativeScrollAdjustment + element.scrollLeft) *
        (i.railXWidth - i.scrollbarXWidth)) /
        (i.contentWidth - i.containerWidth)
    );
  } else {
    i.scrollbarXActive = false;
  }

  if (
    !i.settings.suppressScrollY &&
    i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight
  ) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(
      i,
      toInt((i.railYHeight * i.containerHeight) / i.contentHeight)
    );
    i.scrollbarYTop = toInt(
      (roundedScrollTop * (i.railYHeight - i.scrollbarYHeight)) /
        (i.contentHeight - i.containerHeight)
    );
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    element.classList.add(cls.state.active('x'));
  } else {
    element.classList.remove(cls.state.active('x'));
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    element.scrollLeft = i.isRtl === true ? i.contentWidth : 0;
  }
  if (i.scrollbarYActive) {
    element.classList.add(cls.state.active('y'));
  } else {
    element.classList.remove(cls.state.active('y'));
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    element.scrollTop = 0;
  }
}

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = { width: i.railXWidth };
  var roundedScrollTop = Math.floor(element.scrollTop);

  if (i.isRtl) {
    xRailOffset.left =
      i.negativeScrollAdjustment +
      element.scrollLeft +
      i.containerWidth -
      i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - roundedScrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + roundedScrollTop;
  }
  set(i.scrollbarXRail, xRailOffset);

  var yRailOffset = { top: roundedScrollTop, height: i.railYHeight };
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right =
        i.contentWidth -
        (i.negativeScrollAdjustment + element.scrollLeft) -
        i.scrollbarYRight -
        i.scrollbarYOuterWidth -
        9;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left =
        i.negativeScrollAdjustment +
        element.scrollLeft +
        i.containerWidth * 2 -
        i.contentWidth -
        i.scrollbarYLeft -
        i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  set(i.scrollbarYRail, yRailOffset);

  set(i.scrollbarX, {
    left: i.scrollbarXLeft,
    width: i.scrollbarXWidth - i.railBorderXWidth,
  });
  set(i.scrollbarY, {
    top: i.scrollbarYTop,
    height: i.scrollbarYHeight - i.railBorderYWidth,
  });
}

function clickRail(i) {
  var element = i.element;

  i.event.bind(i.scrollbarY, 'mousedown', function (e) { return e.stopPropagation(); });
  i.event.bind(i.scrollbarYRail, 'mousedown', function (e) {
    var positionTop =
      e.pageY -
      window.pageYOffset -
      i.scrollbarYRail.getBoundingClientRect().top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;

    i.element.scrollTop += direction * i.containerHeight;
    updateGeometry(i);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'mousedown', function (e) { return e.stopPropagation(); });
  i.event.bind(i.scrollbarXRail, 'mousedown', function (e) {
    var positionLeft =
      e.pageX -
      window.pageXOffset -
      i.scrollbarXRail.getBoundingClientRect().left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    i.element.scrollLeft += direction * i.containerWidth;
    updateGeometry(i);

    e.stopPropagation();
  });
}

function dragThumb(i) {
  bindMouseScrollHandler(i, [
    'containerWidth',
    'contentWidth',
    'pageX',
    'railXWidth',
    'scrollbarX',
    'scrollbarXWidth',
    'scrollLeft',
    'x',
    'scrollbarXRail' ]);
  bindMouseScrollHandler(i, [
    'containerHeight',
    'contentHeight',
    'pageY',
    'railYHeight',
    'scrollbarY',
    'scrollbarYHeight',
    'scrollTop',
    'y',
    'scrollbarYRail' ]);
}

function bindMouseScrollHandler(
  i,
  ref
) {
  var containerHeight = ref[0];
  var contentHeight = ref[1];
  var pageY = ref[2];
  var railYHeight = ref[3];
  var scrollbarY = ref[4];
  var scrollbarYHeight = ref[5];
  var scrollTop = ref[6];
  var y = ref[7];
  var scrollbarYRail = ref[8];

  var element = i.element;

  var startingScrollTop = null;
  var startingMousePageY = null;
  var scrollBy = null;

  function mouseMoveHandler(e) {
    if (e.touches && e.touches[0]) {
      e[pageY] = e.touches[0].pageY;
    }
    element[scrollTop] =
      startingScrollTop + scrollBy * (e[pageY] - startingMousePageY);
    addScrollingClass(i, y);
    updateGeometry(i);

    e.stopPropagation();
    e.preventDefault();
  }

  function mouseUpHandler() {
    removeScrollingClass(i, y);
    i[scrollbarYRail].classList.remove(cls.state.clicking);
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  function bindMoves(e, touchMode) {
    startingScrollTop = element[scrollTop];
    if (touchMode && e.touches) {
      e[pageY] = e.touches[0].pageY;
    }
    startingMousePageY = e[pageY];
    scrollBy =
      (i[contentHeight] - i[containerHeight]) /
      (i[railYHeight] - i[scrollbarYHeight]);
    if (!touchMode) {
      i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
      i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);
      e.preventDefault();
    } else {
      i.event.bind(i.ownerDocument, 'touchmove', mouseMoveHandler);
    }

    i[scrollbarYRail].classList.add(cls.state.clicking);

    e.stopPropagation();
  }

  i.event.bind(i[scrollbarY], 'mousedown', function (e) {
    bindMoves(e);
  });
  i.event.bind(i[scrollbarY], 'touchstart', function (e) {
    bindMoves(e, true);
  });
}

function keyboard(i) {
  var element = i.element;

  var elementHovered = function () { return matches(element, ':hover'); };
  var scrollbarFocused = function () { return matches(i.scrollbarX, ':focus') || matches(i.scrollbarY, ':focus'); };

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = Math.floor(element.scrollTop);
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if (
        (scrollTop === 0 && deltaY > 0) ||
        (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if (
        (scrollLeft === 0 && deltaX < 0) ||
        (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if (
      (e.isDefaultPrevented && e.isDefaultPrevented()) ||
      e.defaultPrevented
    ) {
      return;
    }

    if (!elementHovered() && !scrollbarFocused()) {
      return;
    }

    var activeElement = document.activeElement
      ? document.activeElement
      : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
      case 37: // left
        if (e.metaKey) {
          deltaX = -i.contentWidth;
        } else if (e.altKey) {
          deltaX = -i.containerWidth;
        } else {
          deltaX = -30;
        }
        break;
      case 38: // up
        if (e.metaKey) {
          deltaY = i.contentHeight;
        } else if (e.altKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = 30;
        }
        break;
      case 39: // right
        if (e.metaKey) {
          deltaX = i.contentWidth;
        } else if (e.altKey) {
          deltaX = i.containerWidth;
        } else {
          deltaX = 30;
        }
        break;
      case 40: // down
        if (e.metaKey) {
          deltaY = -i.contentHeight;
        } else if (e.altKey) {
          deltaY = -i.containerHeight;
        } else {
          deltaY = -30;
        }
        break;
      case 32: // space bar
        if (e.shiftKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = -i.containerHeight;
        }
        break;
      case 33: // page up
        deltaY = i.containerHeight;
        break;
      case 34: // page down
        deltaY = -i.containerHeight;
        break;
      case 36: // home
        deltaY = i.contentHeight;
        break;
      case 35: // end
        deltaY = -i.contentHeight;
        break;
      default:
        return;
    }

    if (i.settings.suppressScrollX && deltaX !== 0) {
      return;
    }
    if (i.settings.suppressScrollY && deltaY !== 0) {
      return;
    }

    element.scrollTop -= deltaY;
    element.scrollLeft += deltaX;
    updateGeometry(i);

    if (shouldPreventDefault(deltaX, deltaY)) {
      e.preventDefault();
    }
  });
}

function wheel(i) {
  var element = i.element;

  function shouldPreventDefault(deltaX, deltaY) {
    var roundedScrollTop = Math.floor(element.scrollTop);
    var isTop = element.scrollTop === 0;
    var isBottom =
      roundedScrollTop + element.offsetHeight === element.scrollHeight;
    var isLeft = element.scrollLeft === 0;
    var isRight =
      element.scrollLeft + element.offsetWidth === element.scrollWidth;

    var hitsBound;

    // pick axis with primary direction
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      hitsBound = isTop || isBottom;
    } else {
      hitsBound = isLeft || isRight;
    }

    return hitsBound ? !i.settings.wheelPropagation : true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
      // OS X Safari
      deltaX = (-1 * e.wheelDeltaX) / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    // FIXME: this is a workaround for <select> issue in FF and IE #571
    if (!env.isWebKit && element.querySelector('select:focus')) {
      return true;
    }

    if (!element.contains(target)) {
      return false;
    }

    var cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      var style = get(cursor);

      // if deltaY && vertical scrollable
      if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
        var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if (
            (cursor.scrollTop > 0 && deltaY < 0) ||
            (cursor.scrollTop < maxScrollTop && deltaY > 0)
          ) {
            return true;
          }
        }
      }
      // if deltaX && horizontal scrollable
      if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
        var maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if (
            (cursor.scrollLeft > 0 && deltaX < 0) ||
            (cursor.scrollLeft < maxScrollLeft && deltaX > 0)
          ) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  function mousewheelHandler(e) {
    var ref = getDeltaFromEvent(e);
    var deltaX = ref[0];
    var deltaY = ref[1];

    if (shouldBeConsumedByChild(e.target, deltaX, deltaY)) {
      return;
    }

    var shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      element.scrollTop -= deltaY * i.settings.wheelSpeed;
      element.scrollLeft += deltaX * i.settings.wheelSpeed;
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        element.scrollTop -= deltaY * i.settings.wheelSpeed;
      } else {
        element.scrollTop += deltaX * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        element.scrollLeft += deltaX * i.settings.wheelSpeed;
      } else {
        element.scrollLeft -= deltaY * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    }

    updateGeometry(i);

    shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent && !e.ctrlKey) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== 'undefined') {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== 'undefined') {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

function touch(i) {
  if (!env.supportsTouch && !env.supportsIePointer) {
    return;
  }

  var element = i.element;

  function shouldPrevent(deltaX, deltaY) {
    var scrollTop = Math.floor(element.scrollTop);
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (
        (deltaY < 0 && scrollTop === i.contentHeight - i.containerHeight) ||
        (deltaY > 0 && scrollTop === 0)
      ) {
        // set prevent for mobile Chrome refresh
        return window.scrollY === 0 && deltaY > 0 && env.isChrome;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (
        (deltaX < 0 && scrollLeft === i.contentWidth - i.containerWidth) ||
        (deltaX > 0 && scrollLeft === 0)
      ) {
        return true;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    element.scrollTop -= differenceY;
    element.scrollLeft -= differenceX;

    updateGeometry(i);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }

  function shouldHandle(e) {
    if (e.pointerType && e.pointerType === 'pen' && e.buttons === 0) {
      return false;
    }
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (
      e.pointerType &&
      e.pointerType !== 'mouse' &&
      e.pointerType !== e.MSPOINTER_TYPE_MOUSE
    ) {
      return true;
    }
    return false;
  }

  function touchStart(e) {
    if (!shouldHandle(e)) {
      return;
    }

    var touch = getTouch(e);

    startOffset.pageX = touch.pageX;
    startOffset.pageY = touch.pageY;

    startTime = new Date().getTime();

    if (easingLoop !== null) {
      clearInterval(easingLoop);
    }
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    if (!element.contains(target)) {
      return false;
    }

    var cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      var style = get(cursor);

      // if deltaY && vertical scrollable
      if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
        var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if (
            (cursor.scrollTop > 0 && deltaY < 0) ||
            (cursor.scrollTop < maxScrollTop && deltaY > 0)
          ) {
            return true;
          }
        }
      }
      // if deltaX && horizontal scrollable
      if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
        var maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if (
            (cursor.scrollLeft > 0 && deltaX < 0) ||
            (cursor.scrollLeft < maxScrollLeft && deltaX > 0)
          ) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  function touchMove(e) {
    if (shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = { pageX: touch.pageX, pageY: touch.pageY };

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      if (shouldBeConsumedByChild(e.target, differenceX, differenceY)) {
        return;
      }

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = new Date().getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPrevent(differenceX, differenceY)) {
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (i.settings.swipeEasing) {
      clearInterval(easingLoop);
      easingLoop = setInterval(function() {
        if (i.isInitialized) {
          clearInterval(easingLoop);
          return;
        }

        if (!speed.x && !speed.y) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (env.supportsTouch) {
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  } else if (env.supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

var defaultSettings = function () { return ({
  handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollingThreshold: 1000,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipeEasing: true,
  useBothWheelAxes: false,
  wheelPropagation: true,
  wheelSpeed: 1,
}); };

var handlers = {
  'click-rail': clickRail,
  'drag-thumb': dragThumb,
  keyboard: keyboard,
  wheel: wheel,
  touch: touch,
};

var PerfectScrollbar = function PerfectScrollbar(element, userSettings) {
  var this$1 = this;
  if ( userSettings === void 0 ) userSettings = {};

  if (typeof element === 'string') {
    element = document.querySelector(element);
  }

  if (!element || !element.nodeName) {
    throw new Error('no element is specified to initialize PerfectScrollbar');
  }

  this.element = element;

  element.classList.add(cls.main);

  this.settings = defaultSettings();
  for (var key in userSettings) {
    this.settings[key] = userSettings[key];
  }

  this.containerWidth = null;
  this.containerHeight = null;
  this.contentWidth = null;
  this.contentHeight = null;

  var focus = function () { return element.classList.add(cls.state.focus); };
  var blur = function () { return element.classList.remove(cls.state.focus); };

  this.isRtl = get(element).direction === 'rtl';
  if (this.isRtl === true) {
    element.classList.add(cls.rtl);
  }
  this.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  this.negativeScrollAdjustment = this.isNegativeScroll
    ? element.scrollWidth - element.clientWidth
    : 0;
  this.event = new EventManager();
  this.ownerDocument = element.ownerDocument || document;

  this.scrollbarXRail = div(cls.element.rail('x'));
  element.appendChild(this.scrollbarXRail);
  this.scrollbarX = div(cls.element.thumb('x'));
  this.scrollbarXRail.appendChild(this.scrollbarX);
  this.scrollbarX.setAttribute('tabindex', 0);
  this.event.bind(this.scrollbarX, 'focus', focus);
  this.event.bind(this.scrollbarX, 'blur', blur);
  this.scrollbarXActive = null;
  this.scrollbarXWidth = null;
  this.scrollbarXLeft = null;
  var railXStyle = get(this.scrollbarXRail);
  this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);
  if (isNaN(this.scrollbarXBottom)) {
    this.isScrollbarXUsingBottom = false;
    this.scrollbarXTop = toInt(railXStyle.top);
  } else {
    this.isScrollbarXUsingBottom = true;
  }
  this.railBorderXWidth =
    toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth);
  // Set rail to display:block to calculate margins
  set(this.scrollbarXRail, { display: 'block' });
  this.railXMarginWidth =
    toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight);
  set(this.scrollbarXRail, { display: '' });
  this.railXWidth = null;
  this.railXRatio = null;

  this.scrollbarYRail = div(cls.element.rail('y'));
  element.appendChild(this.scrollbarYRail);
  this.scrollbarY = div(cls.element.thumb('y'));
  this.scrollbarYRail.appendChild(this.scrollbarY);
  this.scrollbarY.setAttribute('tabindex', 0);
  this.event.bind(this.scrollbarY, 'focus', focus);
  this.event.bind(this.scrollbarY, 'blur', blur);
  this.scrollbarYActive = null;
  this.scrollbarYHeight = null;
  this.scrollbarYTop = null;
  var railYStyle = get(this.scrollbarYRail);
  this.scrollbarYRight = parseInt(railYStyle.right, 10);
  if (isNaN(this.scrollbarYRight)) {
    this.isScrollbarYUsingRight = false;
    this.scrollbarYLeft = toInt(railYStyle.left);
  } else {
    this.isScrollbarYUsingRight = true;
  }
  this.scrollbarYOuterWidth = this.isRtl ? outerWidth(this.scrollbarY) : null;
  this.railBorderYWidth =
    toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth);
  set(this.scrollbarYRail, { display: 'block' });
  this.railYMarginHeight =
    toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom);
  set(this.scrollbarYRail, { display: '' });
  this.railYHeight = null;
  this.railYRatio = null;

  this.reach = {
    x:
      element.scrollLeft <= 0
        ? 'start'
        : element.scrollLeft >= this.contentWidth - this.containerWidth
        ? 'end'
        : null,
    y:
      element.scrollTop <= 0
        ? 'start'
        : element.scrollTop >= this.contentHeight - this.containerHeight
        ? 'end'
        : null,
  };

  this.isAlive = true;

  this.settings.handlers.forEach(function (handlerName) { return handlers[handlerName](this$1); });

  this.lastScrollTop = Math.floor(element.scrollTop); // for onScroll only
  this.lastScrollLeft = element.scrollLeft; // for onScroll only
  this.event.bind(this.element, 'scroll', function (e) { return this$1.onScroll(e); });
  updateGeometry(this);
};

PerfectScrollbar.prototype.update = function update () {
  if (!this.isAlive) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  this.negativeScrollAdjustment = this.isNegativeScroll
    ? this.element.scrollWidth - this.element.clientWidth
    : 0;

  // Recalculate rail margins
  set(this.scrollbarXRail, { display: 'block' });
  set(this.scrollbarYRail, { display: 'block' });
  this.railXMarginWidth =
    toInt(get(this.scrollbarXRail).marginLeft) +
    toInt(get(this.scrollbarXRail).marginRight);
  this.railYMarginHeight =
    toInt(get(this.scrollbarYRail).marginTop) +
    toInt(get(this.scrollbarYRail).marginBottom);

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  set(this.scrollbarXRail, { display: 'none' });
  set(this.scrollbarYRail, { display: 'none' });

  updateGeometry(this);

  processScrollDiff(this, 'top', 0, false, true);
  processScrollDiff(this, 'left', 0, false, true);

  set(this.scrollbarXRail, { display: '' });
  set(this.scrollbarYRail, { display: '' });
};

PerfectScrollbar.prototype.onScroll = function onScroll (e) {
  if (!this.isAlive) {
    return;
  }

  updateGeometry(this);
  processScrollDiff(this, 'top', this.element.scrollTop - this.lastScrollTop);
  processScrollDiff(
    this,
    'left',
    this.element.scrollLeft - this.lastScrollLeft
  );

  this.lastScrollTop = Math.floor(this.element.scrollTop);
  this.lastScrollLeft = this.element.scrollLeft;
};

PerfectScrollbar.prototype.destroy = function destroy () {
  if (!this.isAlive) {
    return;
  }

  this.event.unbindAll();
  remove(this.scrollbarX);
  remove(this.scrollbarY);
  remove(this.scrollbarXRail);
  remove(this.scrollbarYRail);
  this.removePsClasses();

  // unset elements
  this.element = null;
  this.scrollbarX = null;
  this.scrollbarY = null;
  this.scrollbarXRail = null;
  this.scrollbarYRail = null;

  this.isAlive = false;
};

PerfectScrollbar.prototype.removePsClasses = function removePsClasses () {
  this.element.className = this.element.className
    .split(' ')
    .filter(function (name) { return !name.match(/^ps([-_].+|)$/); })
    .join(' ');
};

/* harmony default export */ __webpack_exports__["a"] = (PerfectScrollbar);
//# sourceMappingURL=perfect-scrollbar.esm.js.map


/***/ }),
/* 224 */,
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(28);
var isObject = __webpack_require__(13);

var slice = [].slice;
var factories = {};

var construct = function (C, argsLength, args) {
  if (!(argsLength in factories)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = slice.call(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = partArgs.concat(slice.call(arguments));
    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
  };
  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
  return boundFunction;
};


/***/ }),
/* 226 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),
/* 227 */,
/* 228 */
/***/ (function(module, exports) {

!function(){function t(){var e=Array.prototype.slice.call(arguments),n=document.createDocumentFragment();e.forEach(function(e){var t=e instanceof Node;n.appendChild(t?e:document.createTextNode(String(e)))}),this.appendChild(n)}[Element.prototype,Document.prototype,DocumentFragment.prototype].forEach(function(e){e.hasOwnProperty("append")||Object.defineProperty(e,"append",{configurable:!0,enumerable:!0,writable:!0,value:t})})}();


/***/ }),
/* 229 */
/***/ (function(module, exports) {

!function(){function t(){null!==this.parentNode&&this.parentNode.removeChild(this)}[Element.prototype,CharacterData.prototype,DocumentType.prototype].forEach(function(e){e.hasOwnProperty("remove")||Object.defineProperty(e,"remove",{configurable:!0,enumerable:!0,writable:!0,value:t})})}();


/***/ }),
/* 230 */
/***/ (function(module, exports) {

!function(){function t(){var e=Array.prototype.slice.call(arguments),r=document.createDocumentFragment();e.forEach(function(e){var t=e instanceof Node;r.appendChild(t?e:document.createTextNode(String(e)))}),this.parentNode.insertBefore(r,this.nextSibling)}[Element.prototype,CharacterData.prototype,DocumentType.prototype].forEach(function(e){e.hasOwnProperty("after")||Object.defineProperty(e,"after",{configurable:!0,enumerable:!0,writable:!0,value:t})})}();


/***/ }),
/* 231 */
/***/ (function(module, exports) {

Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),window.Element&&!Element.prototype.closest&&(Element.prototype.closest=function(e){var t=this;do{if(t.matches(e))return t;t=t.parentElement||t.parentNode}while(null!==t&&1===t.nodeType);return null});


/***/ }),
/* 232 */
/***/ (function(module, exports) {

!function(){function t(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),n}"function"!=typeof window.CustomEvent&&(t.prototype=window.Event.prototype,window.CustomEvent=t)}();


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(42);
__webpack_require__(43);
var getIteratorMethod = __webpack_require__(61);

module.exports = getIteratorMethod;


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(111);

module.exports = parent;


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(236);

module.exports = parent;


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

var findIndex = __webpack_require__(237);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.findIndex;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.findIndex) ? findIndex : own;
};


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(238);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').findIndex;


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $findIndex = __webpack_require__(29).findIndex;
var addToUnscopables = __webpack_require__(60);
var arrayMethodUsesToLength = __webpack_require__(20);

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

var USES_TO_LENGTH = arrayMethodUsesToLength(FIND_INDEX);

// Shouldn't skip holes
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
$({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(240);

module.exports = parent;


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

var some = __webpack_require__(241);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.some;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.some) ? some : own;
};


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(242);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').some;


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $some = __webpack_require__(29).some;
var arrayMethodIsStrict = __webpack_require__(62);
var arrayMethodUsesToLength = __webpack_require__(20);

var STRICT_METHOD = arrayMethodIsStrict('some');
var USES_TO_LENGTH = arrayMethodUsesToLength('some');

// `Array.prototype.some` method
// https://tc39.github.io/ecma262/#sec-array.prototype.some
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(244);

module.exports = parent;


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(245);
var path = __webpack_require__(10);

module.exports = path.Object.assign;


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var assign = __webpack_require__(246);

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
$({ target: 'Object', stat: true, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(16);
var fails = __webpack_require__(6);
var objectKeys = __webpack_require__(46);
var getOwnPropertySymbolsModule = __webpack_require__(113);
var propertyIsEnumerableModule = __webpack_require__(58);
var toObject = __webpack_require__(18);
var IndexedObject = __webpack_require__(55);

var nativeAssign = Object.assign;
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
module.exports = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(248);

module.exports = parent;


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(249);
var path = __webpack_require__(10);

module.exports = path.Object.keys;


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var toObject = __webpack_require__(18);
var nativeKeys = __webpack_require__(46);
var fails = __webpack_require__(6);

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(251);

module.exports = parent;


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(112);
__webpack_require__(43);
__webpack_require__(42);
__webpack_require__(252);
__webpack_require__(258);
__webpack_require__(259);
var path = __webpack_require__(10);

module.exports = path.Promise;


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var IS_PURE = __webpack_require__(35);
var global = __webpack_require__(5);
var getBuiltIn = __webpack_require__(33);
var NativePromise = __webpack_require__(207);
var redefine = __webpack_require__(51);
var redefineAll = __webpack_require__(253);
var setToStringTag = __webpack_require__(34);
var setSpecies = __webpack_require__(254);
var isObject = __webpack_require__(13);
var aFunction = __webpack_require__(28);
var anInstance = __webpack_require__(255);
var classof = __webpack_require__(32);
var inspectSource = __webpack_require__(107);
var iterate = __webpack_require__(208);
var checkCorrectnessOfIteration = __webpack_require__(116);
var speciesConstructor = __webpack_require__(209);
var task = __webpack_require__(210).set;
var microtask = __webpack_require__(256);
var promiseResolve = __webpack_require__(212);
var hostReportErrors = __webpack_require__(257);
var newPromiseCapabilityModule = __webpack_require__(117);
var perform = __webpack_require__(213);
var InternalStateModule = __webpack_require__(57);
var isForced = __webpack_require__(108);
var wellKnownSymbol = __webpack_require__(3);
var V8_VERSION = __webpack_require__(77);

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var PromiseConstructor = NativePromise;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var IS_NODE = classof(process) == 'process';
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (V8_VERSION === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!IS_NODE && typeof PromiseRejectionEvent != 'function') return true;
  }
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromiseConstructor.prototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function (promise, state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(promise, state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (handler = global['on' + name]) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (promise, state) {
  task.call(global, function () {
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (promise, state) {
  task.call(global, function () {
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, promise, state, unwrap) {
  return function (value) {
    fn(promise, state, value, unwrap);
  };
};

var internalReject = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(promise, state, true);
};

var internalResolve = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, promise, wrapper, state),
            bind(internalReject, promise, wrapper, state)
          );
        } catch (error) {
          internalReject(promise, wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(promise, state, false);
    }
  } catch (error) {
    internalReject(promise, { done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
    } catch (error) {
      internalReject(this, state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(this, state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, promise, state);
    this.reject = bind(internalReject, promise, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && typeof NativePromise == 'function') {
    nativeThen = NativePromise.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(NativePromise.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') $({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));
      }
    });
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.github.io/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.github.io/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.github.io/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.github.io/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(51);

module.exports = function (target, src, options) {
  for (var key in src) {
    if (options && options.unsafe && target[key]) target[key] = src[key];
    else redefine(target, key, src[key], options);
  } return target;
};


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(33);
var definePropertyModule = __webpack_require__(26);
var wellKnownSymbol = __webpack_require__(3);
var DESCRIPTORS = __webpack_require__(16);

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),
/* 255 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var getOwnPropertyDescriptor = __webpack_require__(75).f;
var classof = __webpack_require__(32);
var macrotask = __webpack_require__(210).set;
var IS_IOS = __webpack_require__(211);

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var IS_NODE = classof(process) == 'process';
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  } else if (MutationObserver && !IS_IOS) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var aFunction = __webpack_require__(28);
var newPromiseCapabilityModule = __webpack_require__(117);
var perform = __webpack_require__(213);
var iterate = __webpack_require__(208);

// `Promise.allSettled` method
// https://github.com/tc39/proposal-promise-allSettled
$({ target: 'Promise', stat: true }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (e) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: e };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var IS_PURE = __webpack_require__(35);
var NativePromise = __webpack_require__(207);
var fails = __webpack_require__(6);
var getBuiltIn = __webpack_require__(33);
var speciesConstructor = __webpack_require__(209);
var promiseResolve = __webpack_require__(212);
var redefine = __webpack_require__(51);

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!NativePromise && fails(function () {
  NativePromise.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.github.io/ecma262/#sec-promise.prototype.finally
$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = typeof onFinally == 'function';
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// patch native Promise.prototype for native async functions
if (!IS_PURE && typeof NativePromise == 'function' && !NativePromise.prototype['finally']) {
  redefine(NativePromise.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);
}


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(261);

module.exports = parent;


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

var arrayIncludes = __webpack_require__(262);
var stringIncludes = __webpack_require__(264);

var ArrayPrototype = Array.prototype;
var StringPrototype = String.prototype;

module.exports = function (it) {
  var own = it.includes;
  if (it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.includes)) return arrayIncludes;
  if (typeof it === 'string' || it === StringPrototype || (it instanceof String && own === StringPrototype.includes)) {
    return stringIncludes;
  } return own;
};


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(263);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').includes;


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $includes = __webpack_require__(109).includes;
var addToUnscopables = __webpack_require__(60);
var arrayMethodUsesToLength = __webpack_require__(20);

var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: !USES_TO_LENGTH }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(265);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('String').includes;


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var notARegExp = __webpack_require__(266);
var requireObjectCoercible = __webpack_require__(56);
var correctIsRegExpLogic = __webpack_require__(268);

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

var isRegExp = __webpack_require__(267);

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);
var classof = __webpack_require__(32);
var wellKnownSymbol = __webpack_require__(3);

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(3);

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(270);

module.exports = parent;


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

var sort = __webpack_require__(271);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.sort;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.sort) ? sort : own;
};


/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(272);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Array').sort;


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var aFunction = __webpack_require__(28);
var toObject = __webpack_require__(18);
var fails = __webpack_require__(6);
var arrayMethodIsStrict = __webpack_require__(62);

var test = [];
var nativeSort = test.sort;

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var STRICT_METHOD = arrayMethodIsStrict('sort');

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD;

// `Array.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-array.prototype.sort
$({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(274);

module.exports = parent;


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(275);

var FunctionPrototype = Function.prototype;

module.exports = function (it) {
  var own = it.bind;
  return it === FunctionPrototype || (it instanceof Function && own === FunctionPrototype.bind) ? bind : own;
};


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(276);
var entryVirtual = __webpack_require__(12);

module.exports = entryVirtual('Function').bind;


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var bind = __webpack_require__(225);

// `Function.prototype.bind` method
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
$({ target: 'Function', proto: true }, {
  bind: bind
});


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mdn_polyfills_Node_prototype_append__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(228);
/* harmony import */ var mdn_polyfills_Node_prototype_append__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mdn_polyfills_Node_prototype_append__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mdn_polyfills_Node_prototype_remove__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(229);
/* harmony import */ var mdn_polyfills_Node_prototype_remove__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mdn_polyfills_Node_prototype_remove__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mdn_polyfills_Node_prototype_after__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(230);
/* harmony import */ var mdn_polyfills_Node_prototype_after__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mdn_polyfills_Node_prototype_after__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var mdn_polyfills_Element_prototype_closest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(231);
/* harmony import */ var mdn_polyfills_Element_prototype_closest__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(mdn_polyfills_Element_prototype_closest__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var mdn_polyfills_CustomEvent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(232);
/* harmony import */ var mdn_polyfills_CustomEvent__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(mdn_polyfills_CustomEvent__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _js_market_market__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(289);
/* harmony import */ var _styles_market_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(277);
/* harmony import */ var _styles_market_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_styles_market_scss__WEBPACK_IMPORTED_MODULE_6__);
// require.context("./img/", true, /\.(gif|png|jpe?g|svg)$/i);





 // import 'normalize.css'



/***/ }),
/* 289 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_corejs3_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
/* harmony import */ var _babel_runtime_corejs3_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_array_is_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_array_is_array__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_array_is_array__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs3_core_js_get_iterator_method__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(220);
/* harmony import */ var _babel_runtime_corejs3_core_js_get_iterator_method__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_get_iterator_method__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(221);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(79);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_slice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(104);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_slice__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_slice__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(44);
/* harmony import */ var _babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(14);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(80);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_splice__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(105);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_splice__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_splice__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(24);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(0);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_find__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(30);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_find__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_find__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(73);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(38);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _tamplates__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(54);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(59);

















function _createForOfIteratorHelper(o) { if (typeof _babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_3___default.a === "undefined" || _babel_runtime_corejs3_core_js_get_iterator_method__WEBPACK_IMPORTED_MODULE_2___default()(o) == null) { if (_babel_runtime_corejs3_core_js_stable_array_is_array__WEBPACK_IMPORTED_MODULE_1___default()(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = _babel_runtime_corejs3_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_0___default()(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { var _context3; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _babel_runtime_corejs3_core_js_stable_instance_slice__WEBPACK_IMPORTED_MODULE_5___default()(_context3 = Object.prototype.toString.call(o)).call(_context3, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_4___default()(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// // TODO: повесить обработчик на весь контент магазина
// // TODO: отображать 'ничего не найдено' при нулевом поиске
// // TODO: Уменьшить задержку при поиске
// // TODO: изменять цену при выборе опции
// // TODO: теперь можно дублировать названия
// // TODO: кнопка назад из товара
// // TODO: сделать вертикальную прокрутку в корзине
// // TODO: сделать опцию, чтобы сделать вертикальную прокрутку
// TODO: сделать опцию, чтобы отобрадать опции как селект
// TODO: добавить бы ссылку на товар из корзины
// TODO: а если отсутствует картинка товара?
// TODO: добавить кнопку в корзину на карточке
// TODO: сделать поиск по уровню
// TODO: сделать проверку наличия товара в категории
// TODO: удалять слайдер и кастомный бар после работы?
// Импортируем шаблоны
 // Имортируем служебные функции



(function (factory) {
  typeof define === "function" && __webpack_require__(226) ? define(factory) : typeof exports === "object" ? module.exports = factory() : factory();
})(function () {
  ;
  "use strict"; // eslint-disable-line no-unused-expressions

  /* globals window:true */


  var _window = typeof window !== "undefined" ? window : this;

  var market = _window.market = function (globalSettingJson, productListJson, userCallbacks, settings) {
    // Глобальные настройки магазина (id пользователя, валюта магазина)
    var globalSetting = JSON.parse(globalSettingJson); // Товары магазина

    var productList = JSON.parse(productListJson);
    var callbacks = {
      order: function order() {}
    };
    console.log("callbacks :", callbacks);
    var parameters = {
      horizontalScroll: true,
      optionStyle: "button"
    };
    parameters = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_15___default()(parameters, settings);
    callbacks = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_15___default()(callbacks, userCallbacks); // [] с текущим состоянии приложения (листом товаров, категории)

    var currentState; // [] с товарами в корзине

    var cart = []; // Корзина (миниатюра)

    var cartWrap = document.querySelector(".market-cart-link"); // Поле поиска

    var searchInput = document.querySelector(".market-header__search-input"); // Обёртка меню

    var marketMenuWrap = document.querySelector(".market-header__nav"); // Иконка корзины

    var iconCart = document.querySelector(".market-cart-link__icon-wrap"); // Обёртка контента страницы

    var marketContentWrap = document.querySelector(".market-content"); // * Блок с функциями программы
    // Удаление тени у блока с контентом

    var deleteShadow = function deleteShadow() {
      // Если обёртка контента имеент тень...
      if (marketContentWrap.classList.contains("market-content--shadow")) {
        // ...удаляем её
        marketContentWrap.classList.remove("market-content--shadow");
      }
    }; // Получаем общую ширину всех элементов навигации


    var checkForNeedCarouselToNav = function checkForNeedCarouselToNav() {
      // Находим все карточки в каталоге
      // ! привязка к классу
      var navItems = document.querySelectorAll(".market-header__nav-item");
      Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* elementReady */ "e"])(".market-header__nav-item").then(function () {
        // Задаём начальную ширину
        var width = 0; // Проходим по каждой карточке в каталоге и складываем их ширину

        var _iterator = _createForOfIteratorHelper(navItems),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            // + 20 потому что маргин
            width += item.offsetWidth + 20;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* carouselNav */ "c"])(width);
      });
    }; // Добавление пункта в меню


    var addMunuItem = function addMunuItem(currentState, id) {
      // Находим имя категории/товара
      var nameMenuItem = currentState.name; // ...добавляем его в меню, и...

      Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createNavItem */ "c"])(nameMenuItem, id);
      checkForNeedCarouselToNav();
    }; // Проверка клика по карточке каталога (для лучшего UX)


    var checkClickOnCartProduct = function checkClickOnCartProduct(element) {
      // ! привязка к имени тега. что если ещё будет ещё одно изображение в блоке
      var checkElement = [element.classList.contains("market-products__product-title"), element.classList.contains("market-products__product-img-wrap"), element.tagName === "IMG", element.classList.contains("market-btn")]; // Проверка, содержит ли переданный элемент класс из массива

      return _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_14___default()(checkElement).call(checkElement, function (item) {
        return item === true;
      });
    }; // Удаляем все пункты меню, кроме первого


    var deleteNavItemToFirst = function deleteNavItemToFirst() {
      // Находим все пункты меню
      var navItems = document.querySelectorAll(".market-header__nav-item"); // Проходим по коллекции пунктов меню

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_13___default()(navItems).call(navItems, function (item, index) {
        // Если индекс элемента не первый, т.е. "Главная" то...
        if (index !== 0) {
          // ...удаляем его
          item.remove();
        }
      });
    }; // Вернуться на предудщую страницу


    var oneStepBack = function oneStepBack() {
      var menuItems = marketMenuWrap.querySelectorAll(".market-header__nav-item");
      var prevMenuItem = menuItems[menuItems.length - 2];
      var lastMenuItem = menuItems[menuItems.length - 1]; // Находим в [productList] подкатегорию/товар, соответствующие подзаголовку

      var findElementInArr = Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* findByName */ "f"])(productList, Number(prevMenuItem.id.replace(/[^+\d]/g, "")), prevMenuItem.textContent);
      lastMenuItem.remove();

      if (findElementInArr !== undefined) {
        // Проверяем, что именно отрисовывать
        createCurrentState(findElementInArr, findElementInArr.id, false);
      } else {
        createCurrentState(findElementInArr);
      }
    }; // Создаём путь до элемента (нужно после использования поиска)


    var createMenuPath = function createMenuPath(id, name) {
      var marketMenu = Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* menuPath */ "h"])(productList, id, name);
      Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createNavItem */ "c"])(undefined, undefined, marketMenu);
      checkForNeedCarouselToNav();
    }; // Возвращаем состояние после использования поиска


    var stateAfterSearch = function stateAfterSearch(id, name) {
      // Если в поле поиска есть текст...
      if (searchInput.value.length > 0) {
        // ...удаляем его
        searchInput.value = "";
      } // Удаляем последний пункт меню


      var lastMenuItem = marketMenuWrap.querySelector(".market-header__nav li:last-child");

      if (lastMenuItem.textContent === "\u041F\u043E\u0438\u0441\u043A") {
        deleteNavItemToFirst();
        createMenuPath(id, name);
      }
    }; // Создать текущее состояние приложения


    var createCurrentStateData = function createCurrentStateData() {
      // Всплываем до карточки каталога
      var productItem = event.target.closest(".market-products__product"); // Получаем текст подзаголовка текущей карточки

      var nameOfItem = productItem.querySelector(".market-products__product-title").textContent;
      var productId = Number(productItem.id.replace(/[^+\d]/g, ""));
      stateAfterSearch(productId, nameOfItem); // Находим в [productList] подкатегорию/товар, соответствующие подзаголовку

      currentState = Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* findByName */ "f"])(productList, productId, nameOfItem);
      createCurrentState(currentState, currentState.id);
    }; // Обработчик клика на список товаров (категорию/товар) листа, в котором...


    var onProductHendler = function onProductHendler() {
      var productListWrap = marketContentWrap.querySelector(".market-products__list");
      var previousBtn = marketContentWrap.querySelector(".market-btn--prev-step"); // Если это страница с карточками

      if (productListWrap !== null) {
        // Прверяем клик по элементам карточки
        if (checkClickOnCartProduct(event.target)) {
          createCurrentStateData();
        } else if (event.target === previousBtn) {
          oneStepBack();
        }
      }
    }; // Проверяем, нужна ли карусель


    var checkForNeedCarousel = function checkForNeedCarousel() {
      // Находим все товары
      var productsItem = document.querySelectorAll(".market-products__product"); // Проверяем загрузились ли дом-элементы карточек списка

      Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* elementReady */ "e"])(".market-products__product").then(function () {
        // Задаём начальное значение
        var productListWidth = 0; // Проходим по коллекции, в которой...

        var _iterator2 = _createForOfIteratorHelper(productsItem),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var item = _step2.value;
            // ...прибавляем ширину карточки к начальному значению
            productListWidth += item.offsetWidth;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* carousel */ "b"])(productListWidth, parameters.horizontalScroll);
      });
    }; // * Страница товара
    // Изменение классов опций товара


    var changeClassOfActiveOption = function changeClassOfActiveOption() {
      // Обёртка кнопок опций
      var optionList = marketContentWrap.querySelector(".market-product__option-list"); // Если это активная кнопка

      if (event.target.tagName === "LI" && event.target.classList.contains("market-product__option-item--disabled") === false) {
        // Находим все кнопки опций
        var optionBtn = optionList.querySelectorAll(".market-product__option-item--active"); // Удаляем активный класс у всех опций

        _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_13___default()(optionBtn).call(optionBtn, function (item) {
          return item.classList.remove("market-product__option-item--active");
        }); // Добавляем активный класс на нажатую кнопку


        event.target.classList.toggle("market-product__option-item--active");
      }
    }; // Создание [] с товарами и их отрисовка в миниатюре


    var addProductToCart = function addProductToCart(product, productPrice, optionName, optionValue) {
      // Объект c инфой о выбранном товаре
      var newProductCart = {
        name: product.name,
        img: product.img,
        price: productPrice,
        option: optionName !== undefined ? {
          optionName: optionName,
          optionValue: optionValue
        } : undefined,
        quantity: 1
      }; // Проверяем существует ли товар {newProductCart} в корзине [cart]

      var existingProduct = _babel_runtime_corejs3_core_js_stable_instance_find__WEBPACK_IMPORTED_MODULE_12___default()(cart).call(cart, function (item) {
        return item.option !== undefined ? item.name === newProductCart.name && item.option.optionValue === optionValue : item.name === newProductCart.name;
      }); // Если товар {newProductCart} существует, то увеличиваем количество quantity этого объекта


      if (existingProduct) {
        existingProduct.quantity++;
      } // Иначе присоединяем этот объект к [cart]
      else {
          cart = _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_11___default()(cart).call(cart, newProductCart);
        }

      quantityInCartBlock();
    };

    var animatedAddToCart = function animatedAddToCart() {
      // Находим изображение товара
      var productPic = document.querySelector(".market-product__img-wrap img"); // Клонируем его

      var cloneProductPic = productPic.cloneNode(true); // Добавляем ему класс анимации

      cloneProductPic.classList.add("market-product__animate"); // Вставляем копию картинки после картинки

      productPic.after(cloneProductPic);
    }; // Добавление товара в корзину


    var onProductPageHandler = function onProductPageHandler(product) {
      var productWrap = marketContentWrap.querySelector(".market-product");

      if (productWrap !== null) {
        // Обёртка опций
        var optionWrap = productWrap.querySelector(".market-product__option-wrap");
        var productPrice = productWrap.querySelector(".market-product__price"); // Если нажата кнопка добавления в корзину

        if (event.target.classList.contains("market-btn--add-to-cart")) {
          // Записываем имя и значение опции
          if (optionWrap !== null) {
            // Название группы опций
            var optionName = optionWrap.querySelector(".market-product__option-title").textContent; // Название выбранной опции

            var optionValue = optionWrap.querySelector(".market-product__option-item--active").textContent; // Добавляем товар с опцией в виде {} в корзину

            addProductToCart(product, productPrice.textContent, optionName, optionValue);
          } else {
            addProductToCart(product, productPrice.textContent);
          }

          animatedAddToCart();
        } // Если нажата активная опция


        if (event.target.classList.contains("market-product__option-item") && !event.target.classList.contains("market-product__option-item--disabled")) {
          var _context;

          changeClassOfActiveOption(); // Находим имя опции

          var _optionName = event.target.textContent; // Находим в массиве опций объект по этому имени

          var optionPrice = _babel_runtime_corejs3_core_js_stable_instance_find__WEBPACK_IMPORTED_MODULE_12___default()(_context = product.options.optionList).call(_context, function (option) {
            return option[_optionName];
          }); // Меняем цену товара


          productPrice.textContent = optionPrice.price;
        } // Если нажата кнопка шага назад


        if (event.target.classList.contains("market-btn--prev-step")) {
          oneStepBack();
        }
      }
    }; // Создание кнопки назад


    var createPrevBtn = function createPrevBtn() {
      marketContentWrap.insertAdjacentHTML("beforeend", "<button class=\"market-btn--prev-step\">\u2190 \u041D\u0430\u0437\u0430\u0434</button>");
    };
    /**
     * Отрисовывка необходимой информации по шаблонам
     * * самая главная функция
     * @param {array} data - текущее состояние приложения
     */


    var createCurrentState = function createCurrentState(data, id, createMenuItem) {
      if (createMenuItem === void 0) {
        createMenuItem = true;
      }

      // Очищаем обёртку контента
      marketContentWrap.innerHTML = ""; // Удаляем тень

      deleteShadow(); // Если текущее состояние приложения существует, то...

      if (data !== undefined) {
        if (createMenuItem) {
          // Добавляем соответствующий пункт меню
          addMunuItem(data, id);
        } // Если найденный элемент содержит подкатегории...


        if (data.hasOwnProperty("subCategory")) {
          // Отрисовываем по шаблону список товаров с данными подкатегории
          Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createProductList */ "d"])(data.subCategory, globalSetting, id);
          createPrevBtn(); // Проверяем нужна ли карусель

          checkForNeedCarousel();
        } // Иначе, если найденный элемент содержит только товары категории
        else if (data.hasOwnProperty("productsInCategory")) {
            // Отрисовываем по шаблону список товаров категории/подкатегории
            Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createProductList */ "d"])(data.productsInCategory, globalSetting, id);
            createPrevBtn(); // Проверяем нужна ли карусель

            checkForNeedCarousel();
          } // Иначе, если это товар
          else {
              // Отрисовываем по шаблону страницу с товаром
              Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createProductPage */ "e"])(data, globalSetting, id);
              createPrevBtn();
            }
      } // Иначе создаём главную страницу
      else {
          // Отрисовываем по шаблону список товаров первого уровня
          Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createProductList */ "d"])(productList, globalSetting); // Проверяем нужна ли карусель

          checkForNeedCarousel(); // Обнуляем текущее состояние

          data = undefined;
        }
    }; // * Код для корзины
    // Отрисовка количества товаров в блоке корзины


    var quantityInCartBlock = function quantityInCartBlock() {
      // Общее количество товаров в [cart] с начальным значением 0
      var quantityAll = _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_10___default()(cart).call(cart, function (total, item) {
        return total + item.quantity;
      }, 0); // Отрисовка количества в индикаторе корзины (красный кружок)


      iconCart.setAttribute("data-before", quantityAll); // Отрисовываем новую инфу по шаблоне в блоке корзины

      Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createCartBlock */ "a"])(cart, globalSetting);
    };
    /**
     * Отрисовка изменения цены и количества
     *
     * @param {object} productData - объект товара в [cart]
     * @param {HTMLElement} element - обёртка текущего товара
     */


    var changePrice = function changePrice(productData, element) {
      // Накходим обёртку общей цены товара
      var productTotalPrice = element.querySelector(".market-cart__product-total-price"); // Изменяем общую цену внутри карточки товара

      productTotalPrice.textContent = (productData.price * productData.quantity).toLocaleString("ru-RU"); // Находим обёртку количества товара

      var priceQuantity = element.querySelector(".market-cart__price-quantity"); // Изменяем количество товара

      priceQuantity.textContent = productData.quantity; // Накходим обёртку общей цены всех товаров

      var priceTotal = document.querySelector(".market-cart__total-price"); // Изменяем общую цену всех товаров

      priceTotal.textContent = _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_10___default()(cart).call(cart, function (total, item) {
        return total + item.price * item.quantity;
      }, 0).toLocaleString("ru-RU");
    };
    /**
     * Изменение количества товара в массиве и их отрисовка
     *
     * @param {object} productData - объект товара в [cart]
     * @param {HTMLElement} element - обёртка текущего товара
     */


    var changeQuantityProduct = function changeQuantityProduct(productData, element) {
      // Находим кнопку увеличения количества товара
      var quantityUp = element.querySelector(".market-cart__quantity-up"); // Находим кнопку уменьшения количества товара

      var quantityDown = element.querySelector(".market-cart__quantity-down"); // Находим инпут с количеством товара

      var quantityInput = element.querySelector(".market-cart__quantity-input"); // Проверяем, есть ли у товара опции

      var checkProduct = function checkProduct(product) {
        if (product.option !== undefined) {
          // Передаём product.option, чтобы избежать un-ed в массиве
          addProductToCart(product, product.price, product.option.optionName, product.option.optionValue);
        } else {
          addProductToCart(product, product.price);
        }
      }; // Если нажата кнопка увеличения количества товаров


      if (event.target === quantityUp) {
        // Увеличиваем value у инпута
        quantityInput.value++; // Проверяем, есть ли у товара опции

        checkProduct(productData); // Отрисовываем изменения цены и количества

        changePrice(productData, element);
      } // Если нажата кнопка уменьшения количества товаров


      if (event.target === quantityDown && quantityInput.value > 1) {
        // Уменьшаем value у инпута
        quantityInput.value--; // ! -1 потому что внутри функции добавления в корзину будет увеличение на 1

        productData.quantity = quantityInput.value - 1; // Проверяем, есть ли у товара опции

        checkProduct(productData); // Отрисовываем изменения цены и количества

        changePrice(productData, element);
      } // Отлавливаем ручное изменение инпута


      quantityInput.oninput = Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* debounce */ "d"])(function () {
        // Если первый символ ноль
        if (quantityInput.value[0] === "0") {
          quantityInput.value = 1;
        } // Если ввод пустой


        if (quantityInput.value === "") {
          quantityInput.value = 1;
        } // Зачем-то ещё одна проверка (пока делал, забыл зачем. какой-то баг был)


        if (quantityInput.value < "0" || quantityInput.value > "9") {
          quantityInput.value = 1;
        } // Запрещаем ввод букв


        quantityInput.value = quantityInput.value.replace(/\D/g, "");
        productData.quantity = quantityInput.value - 1;
        checkProduct(productData);
        changePrice(productData, element);
      }, 200);
    };
    /**
     * Удаление продукта из корзины
     *
     * @param {object} productIndex - объект товара в [cart]
     * @param {HTMLElement} element - обёртка текущего товара
     */


    var deleteProductFromCart = function deleteProductFromCart(productIndex, element) {
      // Кнопка удаления товара
      var deleteProductBtn = element.querySelector(".market-cart__delete-wrap"); // Если нажата кнопка удаления товара

      if (event.target === deleteProductBtn) {
        _babel_runtime_corejs3_core_js_stable_instance_splice__WEBPACK_IMPORTED_MODULE_9___default()(cart).call(cart, productIndex, 1); // Отрисовываем страницу корзины с новыми данными


        Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createCartPage */ "b"])(cart, globalSetting); // Отрисовываем цену

        quantityInCartBlock();
      }
    };

    var changeProductDataInCart = function changeProductDataInCart() {
      var currentCartElement = event.target.closest(".market-cart__product-content"); // Если обёртка товара найдена

      if (currentCartElement !== null) {
        // Настройки для поиска
        var checkProduct = function checkProduct(item) {
          // Находим заголовок текущего товара
          var productTitle = currentCartElement.querySelector(".market-cart__title").textContent; // Находим опцию текущего товара

          var productOption = currentCartElement.querySelector(".market-cart__option"); // Если опции есть

          return productOption !== null ? // элемент должен совпадать по имени и названию опции
          item.name === productTitle && item.option.optionValue === productOption.textContent : // иначе только по имени
          item.name === productTitle;
        }; // Находим сам элемент в массиве корзины


        var currentCartItem = _babel_runtime_corejs3_core_js_stable_instance_find__WEBPACK_IMPORTED_MODULE_12___default()(cart).call(cart, function (product) {
          return checkProduct(product);
        }); // Находим индекс элемента


        var currentCartItemIndex = _babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_8___default()(cart).call(cart, function (product) {
          return checkProduct(product);
        });

        changeQuantityProduct(currentCartItem, currentCartElement);
        deleteProductFromCart(currentCartItemIndex, currentCartElement);
      }
    }; // Отправка заказа


    var sendOrder = function sendOrder(parentElement) {
      var btnOrder = parentElement.querySelector(".market-cart__btn--order");

      if (event.target === btnOrder) {
        var productTextarea = parentElement.querySelector(".market-cart__textarea");

        if (productTextarea !== null) {
          productTextarea.remove();
        }

        var productItem = parentElement.querySelectorAll(".market-cart__product-content");
        var orderArray = [];

        var _iterator3 = _createForOfIteratorHelper(productItem),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var product = _step3.value;
            var title = product.querySelector(".market-cart__title");
            var optionName = product.querySelector(".market-cart__option-title");
            var optionValue = product.querySelector(".market-cart__option");
            var quantityOfProduct = product.querySelector(".market-cart__price-quantity");
            var priceOfProduct = product.querySelector(".market-cart__product-total-price");
            orderArray.push({
              name: title.textContent,
              optionName: // ноль потому что дом-элементы
              optionName !== null ? optionName.textContent : undefined,
              optionValue: optionValue !== null ? optionValue.textContent : undefined,
              quantity: quantityOfProduct.textContent,
              price: priceOfProduct.textContent
            });
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        var totalPrice = parentElement.querySelector(".market-cart__total-price"); // Формируем массив с товарами

        var orderList = function orderList(arr) {
          var order = [];

          _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_7___default()(arr).call(arr, function (item, index) {
            var product = {
              id: ++index,
              name: item.name,
              count: Number(item.quantity),
              price: Number(item.price.replace(/\s/g, ""))
            };

            if (item.optionName !== undefined) {
              product.optionName = item.optionName.replace(/\:/, "");
              product.optionValue = item.optionValue;
            }

            return order.push(product);
          });

          return order;
        };

        callbacks.order(orderList(orderArray), Number(totalPrice.textContent.replace(/\s/g, "")));
      }
    }; // Возвращение на главную страницу


    var onBackToMainPageBtn = function onBackToMainPageBtn(parentElement) {
      // Кнопка возврата на главную
      var toMainFromCartBtn = parentElement.querySelector(".market-cart__link-to-main"); // Если нажата кнопка

      if (event.target === toMainFromCartBtn) {
        deleteNavItemToFirst(); // Обнуляем текущее состояние

        currentState = undefined; // Отрисовываем текущее состояние

        createCurrentState(currentState);
      }
    }; // Обработчик на странице корзины


    var onCartPageHandler = function onCartPageHandler() {
      var contentCartWrap = document.querySelector(".market-cart"); // Если контент корзины найден

      if (contentCartWrap !== null) {
        changeProductDataInCart();
        sendOrder(contentCartWrap);
        onBackToMainPageBtn(contentCartWrap);
      }
    }; // * Код программы
    // Шаг №0
    // Создаём текст в миниатюре корзины...


    Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createCartBlock */ "a"])(cart, globalSetting); // ...и список категорий

    createCurrentState(currentState); // Чтобы после поиска построить правильное меню

    var lastNavItemName; // Обработчик на поле поиска

    searchInput.oninput = Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* debounce */ "d"])(function () {
      // Ищем все элементы по введённому в поле значению
      var searchElements = Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* inputFindProduct */ "g"])(productList, searchInput.value);
      var lastNavItem = marketMenuWrap.querySelector(".market-header__nav li:last-child");

      if (lastNavItem.textContent !== "\u041F\u043E\u0438\u0441\u043A") {
        lastNavItemName = lastNavItem.textContent;
        deleteNavItemToFirst();
        Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createNavItem */ "c"])("\u041F\u043E\u0438\u0441\u043A", "search");
      }

      var lastNavItemId = Number(marketContentWrap.id.replace(/[^+\d]/g, "")); // Если элементы не найдены

      if (searchElements.length === 0) {
        // Выводим сообщение об отсутствии результатов
        marketContentWrap.innerHTML = "<div class=\"market-content--fade-in market-content__empty\">\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</div>";
      } else {
        // Если в поле введено больше одного символа
        if (searchInput.value.length > 0) {
          marketContentWrap.innerHTML = "";
          Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createProductList */ "d"])(searchElements, globalSetting);
          checkForNeedCarousel();
        } // Иначе, если символов в поле нет (пользователь удалил все символы)
        else {
            stateAfterSearch(lastNavItemId, lastNavItemName);
            createCurrentState(currentState);
          }
      }
    }, 150); // Обработчик клика события на всё меню

    marketMenuWrap.addEventListener("click", function () {
      // Если клик произошёл на теге li
      if (event.target.tagName === "LI") {
        var _context2;

        // Находим все пункты меню
        var navItems = document.querySelectorAll(".market-header__nav-item"); // Получаем текст пункта меню

        var textMenuItem = event.target.textContent; // Находим индекс элемента

        var indexNavItem = _babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_8___default()(_context2 = _babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_6___default()(navItems)).call(_context2, function (item) {
          return item.textContent === textMenuItem;
        });
        /*
          Если это первый элемент (Главная)
          и это не единственный пункт меню в [marketMenu]
          (чтобы лишний раз не отрисовывать контент,
          когда находишься на главной)
        */


        if (indexNavItem === 0 && navItems.length > 1) {
          // Удаляем все пункты меню, кроме "Главной"
          deleteNavItemToFirst(); // Очищаем текущее состояние листа

          currentState = undefined; // Отрисовываем текущее состояние

          createCurrentState(currentState);
        } // Иначе, если клик произошёл не на последнем элементе
        else if (indexNavItem !== navItems.length - 1) {
            // Удаляем все элементы до пункта, по которому был сделан клик
            _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_13___default()(navItems).call(navItems, function (item, index) {
              if (index > indexNavItem - 1) {
                item.remove();
              }
            });

            var menuId = Number(event.target.id.replace(/[^+\d]/g, "")); // Ищем соответсвующий заголовку элемент в [productList]

            currentState = Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* findByName */ "f"])(productList, menuId, textMenuItem); // Отрисовываем текущее состояние

            createCurrentState(currentState, menuId);
          }
      }
    }); // Обработчик клика на корзину (миниатюра блока наверху)

    cartWrap.addEventListener("click", function () {
      // Обёртка контента в корзине
      var cartContent = document.querySelector(".market-cart"); // Если контент корзины не отрисован, то...

      if (cartContent === null) {
        // Удаляем все пункты меню, кроме первого
        deleteNavItemToFirst(); // Добавляем в меню пункт с корзиной

        Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createNavItem */ "c"])("\u041A\u043E\u0440\u0437\u0438\u043D\u0430", "cart"); // Очищаем обёртку

        marketContentWrap.innerHTML = "";
        deleteShadow(); // Создаём страницу корзины на основе [cart]

        Object(_tamplates__WEBPACK_IMPORTED_MODULE_16__[/* createCartPage */ "b"])(cart, globalSetting);

        var _cartContent = document.querySelector(".market-cart");

        Object(_utils__WEBPACK_IMPORTED_MODULE_17__[/* addScrollBar */ "a"])(_cartContent);
      }
    }); // Обработчик клика на контент магазина

    marketContentWrap.addEventListener("click", function () {
      onProductHendler();
      onProductPageHandler(currentState);
      onCartPageHandler();
    });
  };

  return market;
});

market("{\"userId\": \"557933\",\"currency\": \"\u0440.\"}", "[{\"id\":1,\"name\":\"\u0424\u0443\u0442\u0431\u043E\u043B\u043A\u0438\",\"img\":\"1.png\",\"subCategory\":[{\"id\":2,\"name\":\"\u041A\u0440\u0443\u0442\u044B\u0435\",\"img\":\"1.png\",\"productsInCategory\":[{\"id\":3,\"name\":\"\u041A\u0440\u0443\u0442\u0430\u044F \u043F\u0435\u0440\u0432\u0430\u044F\",\"price\":\"1200\",\"img\":\"1.png\",\"active\":true,\"desc\":\"\u0421\u043E\u0441\u0442\u0430\u0432: \u0447\u0438\u0441\u0442\u0430\u044F \u043A\u0440\u0443\u0442\u043E\u0441\u0442\u044C<br />\u0412\u0430\u0449\u0435 \u043A\u0440\u0443\u0442\u044C\",\"options\":{\"nameOptionList\":\"\u0421\u0442\u0435\u043F\u0435\u043D\u044C \u043A\u0440\u0443\u0442\u043E\u0441\u0442\u0438\",\"optionList\":[{\"1\":true,\"price\":\"1200\"},{\"2\":true,\"price\":\"300\"},{\"100500\":true,\"price\":\"800\"}]}},{\"id\":4,\"name\":\"\u041A\u0440\u0443\u0442\u0430\u044F \u0432\u0442\u043E\u0440\u0430\u044F\",\"price\":\"1300\",\"img\":\"2.png\"}]},{\"id\":5,\"name\":\"\u041D\u0435 \u043E\u0447 \u043A\u0440\u0443\u0442\u044B\u0435\",\"img\":\"2.png\",\"productsInCategory\":[{\"id\":6,\"name\":\"\u041D\u0443 \u0442\u0430\u043A\u0430\u044F \u043F\u0435\u0440\u0432\u0430\u044F\",\"price\":\"800\",\"img\":\"1.png\",\"active\":true,\"desc\":\"\u0421\u043E\u0441\u0442\u0430\u0432: \u043F\u043E\u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C<br />\u041F\u043E\u0439\u0434\u0451\u0442\",\"options\":{\"nameOptionList\":\"\u0421\u0442\u0435\u043F\u0435\u043D\u044C \u043E\u0431\u044B\u0447\u043D\u043E\u0441\u0442\u0438\",\"optionList\":[{\"-1\":true,\"price\":\"800\"},{\"-2\":true,\"price\":\"300\"},{\"-100500\":true,\"price\":\"800\"}]}}]}]},{\"id\":7,\"name\":\"\u0422\u043E\u043B\u0441\u0442\u043A\u043E\u0432\u043A\u0438\",\"img\":\"1.png\",\"subCategory\":[{\"id\":8,\"name\":\"\u041A\u0440\u0443\u0442\u044B\u04352\",\"img\":\"1.png\",\"subCategory\":[{\"id\":9,\"name\":\"\u041A\u0440\u0443\u0442\u044B\u04353\",\"img\":\"1.png\",\"productsInCategory\":[{\"id\":10,\"name\":\"\u041A\u0440\u0443\u0442\u0430\u044F \u043F\u0435\u0440\u0432\u0430\u044F \u0442\u043E\u043B\u0441\u0442\",\"price\":\"1200\",\"img\":\"1.png\",\"desc\":\"\u0421\u043E\u0441\u0442\u0430\u0432: \u0447\u0438\u0441\u0442\u0430\u044F \u043A\u0440\u0443\u0442\u043E\u0441\u0442\u044C<br />\u0412\u0430\u0449\u0435 \u043A\u0440\u0443\u0442\u044C\",\"active\":true,\"options\":{\"nameOptionList\":\"\u0421\u0442\u0435\u043F\u0435\u043D\u044C \u043A\u0440\u0443\u0442\u043E\u0441\u0442\u0438\",\"optionList\":[{\"1\":true,\"price\":\"1200\"},{\"2\":true,\"price\":\"300\"},{\"100500\":true,\"price\":\"800\"}]}},{\"id\":11,\"name\":\"\u041A\u0440\u0443\u0442\u0430\u044F \u0432\u0442\u043E\u0440\u0430\u044F \u0442\u043E\u043B\u0441\u0442\",\"price\":\"1300\",\"img\":\"2.png\",\"active\":true}]}]},{\"id\":12,\"name\":\"\u041D\u0435 \u043E\u0447 \u043A\u0440\u0443\u0442\u044B\u0435\u0422\u043E\u043B\",\"img\":\"2.png\",\"productsInCategory\":[{\"id\":13,\"name\":\"\u041D\u0443 \u0442\u0430\u043A\u0430\u044F \u043F\u0435\u0440\u0432\u0430\u044F\",\"price\":\"800\",\"img\":\"1.png\",\"desc\":\"\u0421\u043E\u0441\u0442\u0430\u0432: \u043F\u043E\u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C<br />\u041F\u043E\u0439\u0434\u0451\u0442\",\"active\":true,\"options\":{\"nameOptionList\":\"\u0421\u0442\u0435\u043F\u0435\u043D\u044C \u043E\u0431\u044B\u0447\u043D\u043E\u0441\u0442\u0438\",\"optionList\":[{\"-1\":true,\"price\":\"800\"},{\"-2\":true,\"price\":\"300\"},{\"-100500\":true,\"price\":\"1800\"}]}}]}]},{\"id\":14,\"name\":\"\u0421\u0443\u043F\u0435\u0440\u0441\u043A\",\"price\":\"6000\",\"img\":\"1.png\",\"active\":true},{\"id\":15,\"name\":\"\u0415\u0435\u0435\u0435\",\"price\":\"200\",\"img\":\"2.png\",\"desc\":\"\u0421\u043E\u0441\u0442\u0430\u0432: \u0435\u0435\u0435\u0435.<br />\u0415\u0435\u0435\u0435 \u0435\u0435 \u0435 \u0435\u0435\u0435\u0435.\",\"active\":false,\"options\":{\"nameOptionList\":\"\u0415\",\"optionList\":[{\"\u0435\":true,\"price\":\"200\"},{\"\u0435\u0435\":false,\"price\":\"300\"},{\"\u0435\u0435\u0435\":true,\"price\":\"800\"}]}}]", {
  order: function order(orderList, orderTotalPrice) {
    console.log("orderList :", orderList);
    console.log("orderTotalPrice :", orderTotalPrice);
  }
}, {
  horizontalScroll: true
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(124)(module)))

/***/ })
/******/ ]);