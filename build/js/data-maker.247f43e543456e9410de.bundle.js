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
/******/ 	return __webpack_require__(__webpack_require__.s = 341);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(194);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(5);
var getOwnPropertyDescriptor = __webpack_require__(82).f;
var isForced = __webpack_require__(114);
var path = __webpack_require__(10);
var bind = __webpack_require__(47);
var createNonEnumerableProperty = __webpack_require__(17);
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
var shared = __webpack_require__(69);
var has = __webpack_require__(15);
var uid = __webpack_require__(65);
var NATIVE_SYMBOL = __webpack_require__(70);
var USE_SYMBOL_AS_UID = __webpack_require__(97);

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
var wrappedWellKnownSymbolModule = __webpack_require__(90);
var defineProperty = __webpack_require__(23).f;

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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(122)))

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

module.exports = __webpack_require__(201);

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(181);

/***/ }),
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(10);

module.exports = function (CONSTRUCTOR) {
  return path[CONSTRUCTOR + 'Prototype'];
};


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

var DESCRIPTORS = __webpack_require__(16);
var definePropertyModule = __webpack_require__(23);
var createPropertyDescriptor = __webpack_require__(44);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(59);

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
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

var DESCRIPTORS = __webpack_require__(16);
var IE8_DOM_DEFINE = __webpack_require__(95);
var anObject = __webpack_require__(18);
var toPrimitive = __webpack_require__(51);

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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(58);
var requireObjectCoercible = __webpack_require__(59);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(189);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(53);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 28 */,
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(47);
var IndexedObject = __webpack_require__(58);
var toObject = __webpack_require__(19);
var toLength = __webpack_require__(26);
var arraySpeciesCreate = __webpack_require__(75);

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

module.exports = __webpack_require__(220);

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(197);

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(74);
var defineProperty = __webpack_require__(23).f;
var createNonEnumerableProperty = __webpack_require__(17);
var has = __webpack_require__(15);
var toString = __webpack_require__(135);
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
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(166);

var iterableToArray = __webpack_require__(168);

var unsupportedIterableToArray = __webpack_require__(110);

var nonIterableSpread = __webpack_require__(180);

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),
/* 35 */,
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(130);
var DOMIterables = __webpack_require__(137);
var global = __webpack_require__(5);
var classof = __webpack_require__(45);
var createNonEnumerableProperty = __webpack_require__(17);
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
/* 37 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 38 */
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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(138).charAt;
var InternalStateModule = __webpack_require__(48);
var defineIterator = __webpack_require__(87);

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
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(140);

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(37);

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(206);

var iterableToArrayLimit = __webpack_require__(207);

var unsupportedIterableToArray = __webpack_require__(110);

var nonIterableRest = __webpack_require__(208);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),
/* 44 */
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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(74);
var classofRaw = __webpack_require__(37);
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
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);
var wellKnownSymbol = __webpack_require__(3);
var V8_VERSION = __webpack_require__(83);

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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(31);

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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(131);
var global = __webpack_require__(5);
var isObject = __webpack_require__(13);
var createNonEnumerableProperty = __webpack_require__(17);
var objectHas = __webpack_require__(15);
var sharedKey = __webpack_require__(52);
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
/* 49 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(98);
var enumBugKeys = __webpack_require__(73);

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),
/* 51 */
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(69);
var uid = __webpack_require__(65);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),
/* 53 */
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var createNonEnumerableProperty = __webpack_require__(17);

module.exports = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(51);
var definePropertyModule = __webpack_require__(23);
var createPropertyDescriptor = __webpack_require__(44);

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),
/* 56 */,
/* 57 */,
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);
var classof = __webpack_require__(37);

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
/* 59 */
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),
/* 60 */
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
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(45);
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
/* 63 */,
/* 64 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


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

module.exports = __webpack_require__(160);

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(163);

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var _Object$defineProperty = __webpack_require__(233);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    _Object$defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__(41);
var store = __webpack_require__(94);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.4',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(18);
var defineProperties = __webpack_require__(134);
var enumBugKeys = __webpack_require__(73);
var hiddenKeys = __webpack_require__(49);
var html = __webpack_require__(115);
var documentCreateElement = __webpack_require__(81);
var sharedKey = __webpack_require__(52);

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
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(53);

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
/* 73 */
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
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(3);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);
var isArray = __webpack_require__(42);
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
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(129);

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(185);

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(209);

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(224);

/***/ }),
/* 80 */,
/* 81 */
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
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var propertyIsEnumerableModule = __webpack_require__(60);
var createPropertyDescriptor = __webpack_require__(44);
var toIndexedObject = __webpack_require__(24);
var toPrimitive = __webpack_require__(51);
var has = __webpack_require__(15);
var IE8_DOM_DEFINE = __webpack_require__(95);

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
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var userAgent = __webpack_require__(84);

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
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(38);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),
/* 85 */,
/* 86 */,
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var createIteratorConstructor = __webpack_require__(133);
var getPrototypeOf = __webpack_require__(88);
var setPrototypeOf = __webpack_require__(124);
var setToStringTag = __webpack_require__(33);
var createNonEnumerableProperty = __webpack_require__(17);
var redefine = __webpack_require__(54);
var wellKnownSymbol = __webpack_require__(3);
var IS_PURE = __webpack_require__(41);
var Iterators = __webpack_require__(27);
var IteratorsCore = __webpack_require__(96);

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
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(15);
var toObject = __webpack_require__(19);
var sharedKey = __webpack_require__(52);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(123);

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
/* 89 */
/***/ (function(module, exports) {

// empty


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(3);

exports.f = wellKnownSymbol;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(172);

/***/ }),
/* 92 */,
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(300);
/**
 * Function appends props to a nested object in an object or object array.
 * If the `source` param is undefined, function returns undefined.
 * If the `source` param is not an array or object, function returns it as is.
 * If whether `predicate` or `newProps` param is not an object,
 * or the `predicate` object is empty, function returns the unmodified `source`.
 *
 * @param source
 * @param predicate
 * @param newProps
 */
function appendProps(source, predicate, newProps) {
    if (source === undefined) {
        return undefined;
    }
    var processObject = function (item) {
        if (!helpers_1.isObject(item)) {
            return item;
        }
        var itemClone = __assign({}, item);
        if (helpers_1.checkAgainstPredicate(itemClone, predicate)) {
            itemClone = __assign(__assign({}, itemClone), newProps);
        }
        Object.keys(itemClone).forEach(function (key) {
            var _a;
            if (helpers_1.isObject(itemClone[key]) || Array.isArray(itemClone[key])) {
                itemClone = __assign(__assign({}, itemClone), (_a = {}, _a[key] = appendProps(itemClone[key], predicate, newProps), _a));
            }
        });
        return itemClone;
    };
    if ((Array.isArray(source) || helpers_1.isObject(source)) && !helpers_1.isEmpty(predicate) && !helpers_1.isEmpty(newProps)) {
        return !Array.isArray(source) ? processObject(source) : source.map(function (item) { return processObject(item); });
    }
    return source;
}
exports.appendProps = appendProps;
/**
 * Function replaces __all__ props of a nested object in an object or object array.
 * If the `source` param is undefined, function returns undefined.
 * If the `source` param is not an object, function returns it as is.
 * If whether `predicate` or `replaceWith` param is not an object,
 * or the `predicate` object is empty, function returns the unmodified `source`.
 *
 * @param source
 * @param predicate
 * @param replaceWith
 */
function replaceObject(source, predicate, replaceWith) {
    if (source === undefined) {
        return undefined;
    }
    var processObject = function (item) {
        if (!helpers_1.isObject(item)) {
            return item;
        }
        var itemClone = __assign({}, item);
        if (helpers_1.checkAgainstPredicate(itemClone, predicate)) {
            itemClone = __assign({}, replaceWith);
        }
        Object.keys(itemClone).forEach(function (key) {
            var _a;
            if (helpers_1.isObject(itemClone[key]) || Array.isArray(itemClone[key])) {
                itemClone = __assign(__assign({}, itemClone), (_a = {}, _a[key] = replaceObject(itemClone[key], predicate, replaceWith), _a));
            }
        });
        return itemClone;
    };
    if ((Array.isArray(source) || helpers_1.isObject(source)) && !helpers_1.isEmpty(predicate) && !helpers_1.isEmpty(replaceWith)) {
        return !Array.isArray(source) ? processObject(source) : source.map(function (item) { return processObject(item); });
    }
    return source;
}
exports.replaceObject = replaceObject;
/**
 * Function replaces some __existing__ props of a nested object in an object or object array.
 * If the `source` param is undefined, function returns undefined.
 * If the `source` param is not an object, function returns it as is.
 * If whether `predicate` or `replaceProps` param is not an object,
 * or the `predicate` object is empty, function returns the unmodified `source`.
 *
 * @param source
 * @param predicate
 * @param replaceProps
 */
function changeProps(source, predicate, replaceProps) {
    if (source === undefined) {
        return undefined;
    }
    var processObject = function (item) {
        if (!helpers_1.isObject(item)) {
            return item;
        }
        var itemClone = __assign({}, item);
        if (helpers_1.checkAgainstPredicate(itemClone, predicate)) {
            Object.keys(replaceProps).forEach(function (key) {
                var _a;
                if (Object.prototype.hasOwnProperty.call(itemClone, key)) {
                    itemClone = __assign(__assign({}, itemClone), (_a = {}, _a[key] = replaceProps[key], _a));
                }
            });
        }
        Object.keys(itemClone).forEach(function (key) {
            var _a;
            if (helpers_1.isObject(itemClone[key]) || Array.isArray(itemClone[key])) {
                itemClone = __assign(__assign({}, itemClone), (_a = {}, _a[key] = changeProps(itemClone[key], predicate, replaceProps), _a));
            }
        });
        return itemClone;
    };
    if ((Array.isArray(source) || helpers_1.isObject(source)) && !helpers_1.isEmpty(predicate) && !helpers_1.isEmpty(replaceProps)) {
        return !Array.isArray(source) ? processObject(source) : source.map(function (item) { return processObject(item); });
    }
    return source;
}
exports.changeProps = changeProps;
/**
 * Function removes a nested object in an object or object array.
 * If the `source` param is undefined, function returns undefined.
 * If the `source` param is not an object, function returns it as is.
 * If the `predicate` param is not an object or it is empty, function returns the unmodified `source`.
 *
 * @param source
 * @param predicate
 */
function removeObject(source, predicate) {
    if (source === undefined) {
        return undefined;
    }
    var processObject = function (item) {
        if (!helpers_1.isObject(item)) {
            return item;
        }
        var itemClone = __assign({}, item);
        Object.keys(itemClone).forEach(function (key) {
            var _a;
            if (helpers_1.isObject(itemClone[key]) || Array.isArray(itemClone[key])) {
                itemClone = __assign(__assign({}, itemClone), (_a = {}, _a[key] = removeObject(itemClone[key], predicate), _a));
            }
        });
        return itemClone;
    };
    if ((Array.isArray(source) || helpers_1.isObject(source)) && !helpers_1.isEmpty(predicate)) {
        if (!Array.isArray(source)) {
            if (!helpers_1.checkAgainstPredicate(source, predicate)) {
                return processObject(source);
            }
        }
        else {
            return source.filter(function (item) {
                return !helpers_1.checkAgainstPredicate(item, predicate);
            }).map(function (item) { return processObject(item); });
        }
    }
    else {
        return source;
    }
}
exports.removeObject = removeObject;
/**
 * Function returns the found object, or an object array if there's more than one object found.
 * If the `source` param is undefined, function returns undefined.
 * If the `source` param is not an object, function returns it as is.
 * If the `predicate` param is not an object, or it's empty, function returns the unmodified `source`.
 *
 * @param source
 * @param predicate
 */
function returnFound(source, predicate) {
    if (source === undefined) {
        return undefined;
    }
    var result = undefined;
    var appendResult = function (item) {
        if (!item || helpers_1.isEmpty(item)) {
            return;
        }
        result = result ? (!Array.isArray(result) ? [result, __assign({}, item)] : __spreadArrays(result, [__assign({}, item)])) : item;
    };
    var processObject = function (item) {
        if (helpers_1.checkAgainstPredicate(item, predicate)) {
            appendResult(item);
        }
        Object.keys(item).forEach(function (key) {
            if (helpers_1.isObject(item[key]) || Array.isArray(item[key])) {
                appendResult(returnFound(item[key], predicate));
            }
        });
    };
    if ((Array.isArray(source) || helpers_1.isObject(source)) && !helpers_1.isEmpty(predicate)) {
        !Array.isArray(source) ? processObject(source) : source.map(function (item) { return processObject(item); });
    }
    else {
        return source;
    }
    return result;
}
exports.returnFound = returnFound;
/**
 * Base function for `insertObjectBefore` and `insertObjectAfter`.
 *
 * @param source
 * @param predicate
 * @param objectToInsert
 * @param isBefore
 */
function insertObject(source, predicate, objectToInsert, isBefore) {
    if (source === undefined) {
        return undefined;
    }
    var processObject = function (item) {
        if (!helpers_1.isObject(item)) {
            return item;
        }
        var itemClone = __assign({}, item);
        Object.keys(itemClone).forEach(function (key) {
            var _a;
            if (helpers_1.isObject(itemClone[key]) || Array.isArray(itemClone[key])) {
                itemClone = __assign(__assign({}, itemClone), (_a = {}, _a[key] = insertObject(itemClone[key], predicate, objectToInsert, isBefore), _a));
            }
        });
        return itemClone;
    };
    var processArray = function (sourceArray) {
        var indexes = [];
        var sourceClone = sourceArray.map(function (item, index) {
            var processedItem = processObject(item);
            if (helpers_1.checkAgainstPredicate(processedItem, predicate)) {
                indexes.push(index);
            }
            return processedItem;
        });
        if (indexes.length > 0) {
            for (var i = 0; i < indexes.length; i += 1) {
                sourceClone.splice(indexes[i] + i + (isBefore ? 0 : 1), 0, objectToInsert);
            }
        }
        return sourceClone;
    };
    if ((Array.isArray(source) || helpers_1.isObject(source)) && !helpers_1.isEmpty(predicate) && !helpers_1.isEmpty(objectToInsert)) {
        return !Array.isArray(source) ? processObject(source) : processArray(source);
    }
    return source;
}
/**
 * Function inserts the given `objectToInsert` before the found object if the found object's parent is array.
 * If the `source` param is undefined, function returns undefined.
 * If the `source` param is not an object, function returns it as is.
 * If whether `predicate` or `objectToInsert` param is not an object,
 * or the `predicate` object is empty, function returns the unmodified `source`.
 *
 * @param source
 * @param predicate
 * @param objectToInsert
 */
function insertObjectBefore(source, predicate, objectToInsert) {
    return insertObject(source, predicate, objectToInsert, true);
}
exports.insertObjectBefore = insertObjectBefore;
/**
 * Function inserts the given `objectToInsert` after the found object if the found object's parent is array.
 * If the `source` param is undefined, function returns undefined.
 * If the `source` param is not an object, function returns it as is.
 * If whether `predicate` or `objectToInsert` param is not an object,
 * or the `predicate` object is empty, function returns the unmodified `source`.
 *
 * @param source
 * @param predicate
 * @param objectToInsert
 */
function insertObjectAfter(source, predicate, objectToInsert) {
    return insertObject(source, predicate, objectToInsert, false);
}
exports.insertObjectAfter = insertObjectAfter;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var setGlobal = __webpack_require__(132);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var fails = __webpack_require__(6);
var createElement = __webpack_require__(81);

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getPrototypeOf = __webpack_require__(88);
var createNonEnumerableProperty = __webpack_require__(17);
var has = __webpack_require__(15);
var wellKnownSymbol = __webpack_require__(3);
var IS_PURE = __webpack_require__(41);

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
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__(70);

module.exports = NATIVE_SYMBOL
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(15);
var toIndexedObject = __webpack_require__(24);
var indexOf = __webpack_require__(99).indexOf;
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
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(24);
var toLength = __webpack_require__(26);
var toAbsoluteIndex = __webpack_require__(72);

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
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(141);
var path = __webpack_require__(10);

module.exports = path.Array.isArray;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(102);
__webpack_require__(89);
__webpack_require__(144);
__webpack_require__(145);
__webpack_require__(146);
__webpack_require__(147);
__webpack_require__(148);
__webpack_require__(126);
__webpack_require__(149);
__webpack_require__(150);
__webpack_require__(151);
__webpack_require__(152);
__webpack_require__(153);
__webpack_require__(154);
__webpack_require__(155);
__webpack_require__(156);
__webpack_require__(157);
__webpack_require__(158);
__webpack_require__(159);
var path = __webpack_require__(10);

module.exports = path.Symbol;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var fails = __webpack_require__(6);
var isArray = __webpack_require__(42);
var isObject = __webpack_require__(13);
var toObject = __webpack_require__(19);
var toLength = __webpack_require__(26);
var createProperty = __webpack_require__(55);
var arraySpeciesCreate = __webpack_require__(75);
var arrayMethodHasSpeciesSupport = __webpack_require__(46);
var wellKnownSymbol = __webpack_require__(3);
var V8_VERSION = __webpack_require__(83);

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
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(98);
var enumBugKeys = __webpack_require__(73);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(39);
__webpack_require__(161);
var path = __webpack_require__(10);

module.exports = path.Array.from;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var slice = __webpack_require__(164);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.slice;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.slice) ? slice : own;
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(167);

/***/ }),
/* 107 */
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
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(169);

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(170);

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var _Array$from = __webpack_require__(108);

var _sliceInstanceProperty = __webpack_require__(178);

var arrayLikeToArray = __webpack_require__(107);

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
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(142);

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(143);

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(94);

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),
/* 114 */
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
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(38);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),
/* 116 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(18);

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
/* 118 */
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
/* 119 */
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
/* 120 */,
/* 121 */,
/* 122 */
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
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(18);
var aPossiblePrototype = __webpack_require__(136);

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
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(24);
var nativeGetOwnPropertyNames = __webpack_require__(103).f;

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
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),
/* 127 */,
/* 128 */,
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(36);
__webpack_require__(39);
var getIterator = __webpack_require__(139);

module.exports = getIterator;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(24);
var addToUnscopables = __webpack_require__(64);
var Iterators = __webpack_require__(27);
var InternalStateModule = __webpack_require__(48);
var defineIterator = __webpack_require__(87);

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
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var inspectSource = __webpack_require__(113);

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var createNonEnumerableProperty = __webpack_require__(17);

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__(96).IteratorPrototype;
var create = __webpack_require__(71);
var createPropertyDescriptor = __webpack_require__(44);
var setToStringTag = __webpack_require__(33);
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
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var definePropertyModule = __webpack_require__(23);
var anObject = __webpack_require__(18);
var objectKeys = __webpack_require__(50);

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
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(74);
var classof = __webpack_require__(45);

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),
/* 137 */
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
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(53);
var requireObjectCoercible = __webpack_require__(59);

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
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(18);
var getIteratorMethod = __webpack_require__(61);

module.exports = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(100);

module.exports = parent;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var isArray = __webpack_require__(42);

// `Array.isArray` method
// https://tc39.github.io/ecma262/#sec-array.isarray
$({ target: 'Array', stat: true }, {
  isArray: isArray
});


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(36);
__webpack_require__(39);
var getIteratorMethod = __webpack_require__(61);

module.exports = getIteratorMethod;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(101);

module.exports = parent;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var global = __webpack_require__(5);
var getBuiltIn = __webpack_require__(38);
var IS_PURE = __webpack_require__(41);
var DESCRIPTORS = __webpack_require__(16);
var NATIVE_SYMBOL = __webpack_require__(70);
var USE_SYMBOL_AS_UID = __webpack_require__(97);
var fails = __webpack_require__(6);
var has = __webpack_require__(15);
var isArray = __webpack_require__(42);
var isObject = __webpack_require__(13);
var anObject = __webpack_require__(18);
var toObject = __webpack_require__(19);
var toIndexedObject = __webpack_require__(24);
var toPrimitive = __webpack_require__(51);
var createPropertyDescriptor = __webpack_require__(44);
var nativeObjectCreate = __webpack_require__(71);
var objectKeys = __webpack_require__(50);
var getOwnPropertyNamesModule = __webpack_require__(103);
var getOwnPropertyNamesExternal = __webpack_require__(125);
var getOwnPropertySymbolsModule = __webpack_require__(116);
var getOwnPropertyDescriptorModule = __webpack_require__(82);
var definePropertyModule = __webpack_require__(23);
var propertyIsEnumerableModule = __webpack_require__(60);
var createNonEnumerableProperty = __webpack_require__(17);
var redefine = __webpack_require__(54);
var shared = __webpack_require__(69);
var sharedKey = __webpack_require__(52);
var hiddenKeys = __webpack_require__(49);
var uid = __webpack_require__(65);
var wellKnownSymbol = __webpack_require__(3);
var wrappedWellKnownSymbolModule = __webpack_require__(90);
var defineWellKnownSymbol = __webpack_require__(4);
var setToStringTag = __webpack_require__(33);
var InternalStateModule = __webpack_require__(48);
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
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.asyncIterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');


/***/ }),
/* 146 */
/***/ (function(module, exports) {

// empty


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.hasInstance` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.match` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.matchAll` well-known symbol
defineWellKnownSymbol('matchAll');


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.replace` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.search` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.species` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.split` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.toPrimitive` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.toStringTag` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.unscopables` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var setToStringTag = __webpack_require__(33);

// Math[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var setToStringTag = __webpack_require__(33);

// JSON[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(104);

module.exports = parent;


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var from = __webpack_require__(162);
var checkCorrectnessOfIteration = __webpack_require__(119);

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(47);
var toObject = __webpack_require__(19);
var callWithSafeIterationClosing = __webpack_require__(117);
var isArrayIteratorMethod = __webpack_require__(118);
var toLength = __webpack_require__(26);
var createProperty = __webpack_require__(55);
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
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(105);

module.exports = parent;


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(165);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').slice;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var isObject = __webpack_require__(13);
var isArray = __webpack_require__(42);
var toAbsoluteIndex = __webpack_require__(72);
var toLength = __webpack_require__(26);
var toIndexedObject = __webpack_require__(24);
var createProperty = __webpack_require__(55);
var wellKnownSymbol = __webpack_require__(3);
var arrayMethodHasSpeciesSupport = __webpack_require__(46);
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
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var _Array$isArray = __webpack_require__(106);

var arrayLikeToArray = __webpack_require__(107);

function _arrayWithoutHoles(arr) {
  if (_Array$isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(100);

module.exports = parent;


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var _Array$from = __webpack_require__(108);

var _isIterable = __webpack_require__(109);

var _Symbol = __webpack_require__(91);

function _iterableToArray(iter) {
  if (typeof _Symbol !== "undefined" && _isIterable(Object(iter))) return _Array$from(iter);
}

module.exports = _iterableToArray;

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(104);

module.exports = parent;


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(36);
__webpack_require__(39);
var isIterable = __webpack_require__(171);

module.exports = isIterable;


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(45);
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
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(101);
__webpack_require__(173);
__webpack_require__(174);
__webpack_require__(175);
__webpack_require__(176);
// TODO: Remove from `core-js@4`
__webpack_require__(177);

module.exports = parent;


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.asyncDispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('asyncDispose');


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('dispose');


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol('observable');


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(4);

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('patternMatch');


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

// TODO: remove from `core-js@4`
var defineWellKnownSymbol = __webpack_require__(4);

defineWellKnownSymbol('replaceAll');


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(179);

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(105);

module.exports = parent;


/***/ }),
/* 180 */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(182);

module.exports = parent;


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

var map = __webpack_require__(183);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.map;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.map) ? map : own;
};


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(184);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').map;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $map = __webpack_require__(29).map;
var arrayMethodHasSpeciesSupport = __webpack_require__(46);
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
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(186);

module.exports = parent;


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

var splice = __webpack_require__(187);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.splice;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.splice) ? splice : own;
};


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(188);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').splice;


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var toAbsoluteIndex = __webpack_require__(72);
var toInteger = __webpack_require__(53);
var toLength = __webpack_require__(26);
var toObject = __webpack_require__(19);
var arraySpeciesCreate = __webpack_require__(75);
var createProperty = __webpack_require__(55);
var arrayMethodHasSpeciesSupport = __webpack_require__(46);
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
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(190);

module.exports = parent;


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

var reduce = __webpack_require__(191);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.reduce;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.reduce) ? reduce : own;
};


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(192);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').reduce;


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $reduce = __webpack_require__(193).left;
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
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(31);
var toObject = __webpack_require__(19);
var IndexedObject = __webpack_require__(58);
var toLength = __webpack_require__(26);

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
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(195);

module.exports = parent;


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

var concat = __webpack_require__(196);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.concat;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.concat) ? concat : own;
};


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(102);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').concat;


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(198);

module.exports = parent;


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

var find = __webpack_require__(199);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.find;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.find) ? find : own;
};


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(200);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').find;


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $find = __webpack_require__(29).find;
var addToUnscopables = __webpack_require__(64);
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
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(36);
var forEach = __webpack_require__(202);
var classof = __webpack_require__(45);
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
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(203);

module.exports = parent;


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(204);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').forEach;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var forEach = __webpack_require__(205);

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),
/* 205 */
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
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

var _Array$isArray = __webpack_require__(106);

function _arrayWithHoles(arr) {
  if (_Array$isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

var _getIterator = __webpack_require__(76);

var _isIterable = __webpack_require__(109);

var _Symbol = __webpack_require__(91);

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
/* 208 */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(210);

module.exports = parent;


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(211);
var path = __webpack_require__(10);

module.exports = path.Object.entries;


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var $entries = __webpack_require__(212).entries;

// `Object.entries` method
// https://tc39.github.io/ecma262/#sec-object.entries
$({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var objectKeys = __webpack_require__(50);
var toIndexedObject = __webpack_require__(24);
var propertyIsEnumerable = __webpack_require__(60).f;

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
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(221);

module.exports = parent;


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

var filter = __webpack_require__(222);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.filter;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.filter) ? filter : own;
};


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(223);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').filter;


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $filter = __webpack_require__(29).filter;
var arrayMethodHasSpeciesSupport = __webpack_require__(46);
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
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(225);
var path = __webpack_require__(10);

module.exports = path.setTimeout;


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var global = __webpack_require__(5);
var userAgent = __webpack_require__(84);

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
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(280);

/***/ }),
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(281);

module.exports = parent;


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(282);
var path = __webpack_require__(10);

var Object = path.Object;

var defineProperty = module.exports = function defineProperty(it, key, desc) {
  return Object.defineProperty(it, key, desc);
};

if (Object.defineProperty.sham) defineProperty.sham = true;


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var DESCRIPTORS = __webpack_require__(16);
var objectDefinePropertyModile = __webpack_require__(23);

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperty: objectDefinePropertyModile.f
});


/***/ }),
/* 283 */,
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(297);

/***/ }),
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * clipboard.js v2.0.6
 * https://clipboardjs.com/
 * 
 * Licensed MIT © Zeno Rocha
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;
module.exports.TinyEmitter = E;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var is = __webpack_require__(3);
var delegate = __webpack_require__(4);

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var closest = __webpack_require__(5);

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/select/src/select.js
var src_select = __webpack_require__(0);
var select_default = /*#__PURE__*/__webpack_require__.n(src_select);

// CONCATENATED MODULE: ./src/clipboard-action.js
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



/**
 * Inner class which performs selection from either `text` or `target`
 * properties and then executes copy or cut operations.
 */

var clipboard_action_ClipboardAction = function () {
    /**
     * @param {Object} options
     */
    function ClipboardAction(options) {
        _classCallCheck(this, ClipboardAction);

        this.resolveOptions(options);
        this.initSelection();
    }

    /**
     * Defines base properties passed from constructor.
     * @param {Object} options
     */


    _createClass(ClipboardAction, [{
        key: 'resolveOptions',
        value: function resolveOptions() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.action = options.action;
            this.container = options.container;
            this.emitter = options.emitter;
            this.target = options.target;
            this.text = options.text;
            this.trigger = options.trigger;

            this.selectedText = '';
        }

        /**
         * Decides which selection strategy is going to be applied based
         * on the existence of `text` and `target` properties.
         */

    }, {
        key: 'initSelection',
        value: function initSelection() {
            if (this.text) {
                this.selectFake();
            } else if (this.target) {
                this.selectTarget();
            }
        }

        /**
         * Creates a fake textarea element, sets its value from `text` property,
         * and makes a selection on it.
         */

    }, {
        key: 'selectFake',
        value: function selectFake() {
            var _this = this;

            var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

            this.removeFake();

            this.fakeHandlerCallback = function () {
                return _this.removeFake();
            };
            this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

            this.fakeElem = document.createElement('textarea');
            // Prevent zooming on iOS
            this.fakeElem.style.fontSize = '12pt';
            // Reset box model
            this.fakeElem.style.border = '0';
            this.fakeElem.style.padding = '0';
            this.fakeElem.style.margin = '0';
            // Move element out of screen horizontally
            this.fakeElem.style.position = 'absolute';
            this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
            // Move element to the same position vertically
            var yPosition = window.pageYOffset || document.documentElement.scrollTop;
            this.fakeElem.style.top = yPosition + 'px';

            this.fakeElem.setAttribute('readonly', '');
            this.fakeElem.value = this.text;

            this.container.appendChild(this.fakeElem);

            this.selectedText = select_default()(this.fakeElem);
            this.copyText();
        }

        /**
         * Only removes the fake element after another click event, that way
         * a user can hit `Ctrl+C` to copy because selection still exists.
         */

    }, {
        key: 'removeFake',
        value: function removeFake() {
            if (this.fakeHandler) {
                this.container.removeEventListener('click', this.fakeHandlerCallback);
                this.fakeHandler = null;
                this.fakeHandlerCallback = null;
            }

            if (this.fakeElem) {
                this.container.removeChild(this.fakeElem);
                this.fakeElem = null;
            }
        }

        /**
         * Selects the content from element passed on `target` property.
         */

    }, {
        key: 'selectTarget',
        value: function selectTarget() {
            this.selectedText = select_default()(this.target);
            this.copyText();
        }

        /**
         * Executes the copy operation based on the current selection.
         */

    }, {
        key: 'copyText',
        value: function copyText() {
            var succeeded = void 0;

            try {
                succeeded = document.execCommand(this.action);
            } catch (err) {
                succeeded = false;
            }

            this.handleResult(succeeded);
        }

        /**
         * Fires an event based on the copy operation result.
         * @param {Boolean} succeeded
         */

    }, {
        key: 'handleResult',
        value: function handleResult(succeeded) {
            this.emitter.emit(succeeded ? 'success' : 'error', {
                action: this.action,
                text: this.selectedText,
                trigger: this.trigger,
                clearSelection: this.clearSelection.bind(this)
            });
        }

        /**
         * Moves focus away from `target` and back to the trigger, removes current selection.
         */

    }, {
        key: 'clearSelection',
        value: function clearSelection() {
            if (this.trigger) {
                this.trigger.focus();
            }
            document.activeElement.blur();
            window.getSelection().removeAllRanges();
        }

        /**
         * Sets the `action` to be performed which can be either 'copy' or 'cut'.
         * @param {String} action
         */

    }, {
        key: 'destroy',


        /**
         * Destroy lifecycle.
         */
        value: function destroy() {
            this.removeFake();
        }
    }, {
        key: 'action',
        set: function set() {
            var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

            this._action = action;

            if (this._action !== 'copy' && this._action !== 'cut') {
                throw new Error('Invalid "action" value, use either "copy" or "cut"');
            }
        }

        /**
         * Gets the `action` property.
         * @return {String}
         */
        ,
        get: function get() {
            return this._action;
        }

        /**
         * Sets the `target` property using an element
         * that will be have its content copied.
         * @param {Element} target
         */

    }, {
        key: 'target',
        set: function set(target) {
            if (target !== undefined) {
                if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                    if (this.action === 'copy' && target.hasAttribute('disabled')) {
                        throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                    }

                    if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                        throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                    }

                    this._target = target;
                } else {
                    throw new Error('Invalid "target" value, use a valid Element');
                }
            }
        }

        /**
         * Gets the `target` property.
         * @return {String|HTMLElement}
         */
        ,
        get: function get() {
            return this._target;
        }
    }]);

    return ClipboardAction;
}();

/* harmony default export */ var clipboard_action = (clipboard_action_ClipboardAction);
// EXTERNAL MODULE: ./node_modules/tiny-emitter/index.js
var tiny_emitter = __webpack_require__(1);
var tiny_emitter_default = /*#__PURE__*/__webpack_require__.n(tiny_emitter);

// EXTERNAL MODULE: ./node_modules/good-listener/src/listen.js
var listen = __webpack_require__(2);
var listen_default = /*#__PURE__*/__webpack_require__.n(listen);

// CONCATENATED MODULE: ./src/clipboard.js
var clipboard_typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var clipboard_createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function clipboard_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





/**
 * Base class which takes one or more elements, adds event listeners to them,
 * and instantiates a new `ClipboardAction` on each click.
 */

var clipboard_Clipboard = function (_Emitter) {
    _inherits(Clipboard, _Emitter);

    /**
     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
     * @param {Object} options
     */
    function Clipboard(trigger, options) {
        clipboard_classCallCheck(this, Clipboard);

        var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

        _this.resolveOptions(options);
        _this.listenClick(trigger);
        return _this;
    }

    /**
     * Defines if attributes would be resolved using internal setter functions
     * or custom functions that were passed in the constructor.
     * @param {Object} options
     */


    clipboard_createClass(Clipboard, [{
        key: 'resolveOptions',
        value: function resolveOptions() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
            this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
            this.text = typeof options.text === 'function' ? options.text : this.defaultText;
            this.container = clipboard_typeof(options.container) === 'object' ? options.container : document.body;
        }

        /**
         * Adds a click event listener to the passed trigger.
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         */

    }, {
        key: 'listenClick',
        value: function listenClick(trigger) {
            var _this2 = this;

            this.listener = listen_default()(trigger, 'click', function (e) {
                return _this2.onClick(e);
            });
        }

        /**
         * Defines a new `ClipboardAction` on each click event.
         * @param {Event} e
         */

    }, {
        key: 'onClick',
        value: function onClick(e) {
            var trigger = e.delegateTarget || e.currentTarget;

            if (this.clipboardAction) {
                this.clipboardAction = null;
            }

            this.clipboardAction = new clipboard_action({
                action: this.action(trigger),
                target: this.target(trigger),
                text: this.text(trigger),
                container: this.container,
                trigger: trigger,
                emitter: this
            });
        }

        /**
         * Default `action` lookup function.
         * @param {Element} trigger
         */

    }, {
        key: 'defaultAction',
        value: function defaultAction(trigger) {
            return getAttributeValue('action', trigger);
        }

        /**
         * Default `target` lookup function.
         * @param {Element} trigger
         */

    }, {
        key: 'defaultTarget',
        value: function defaultTarget(trigger) {
            var selector = getAttributeValue('target', trigger);

            if (selector) {
                return document.querySelector(selector);
            }
        }

        /**
         * Returns the support of the given action, or all actions if no action is
         * given.
         * @param {String} [action]
         */

    }, {
        key: 'defaultText',


        /**
         * Default `text` lookup function.
         * @param {Element} trigger
         */
        value: function defaultText(trigger) {
            return getAttributeValue('text', trigger);
        }

        /**
         * Destroy lifecycle.
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.listener.destroy();

            if (this.clipboardAction) {
                this.clipboardAction.destroy();
                this.clipboardAction = null;
            }
        }
    }], [{
        key: 'isSupported',
        value: function isSupported() {
            var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

            var actions = typeof action === 'string' ? [action] : action;
            var support = !!document.queryCommandSupported;

            actions.forEach(function (action) {
                support = support && !!document.queryCommandSupported(action);
            });

            return support;
        }
    }]);

    return Clipboard;
}(tiny_emitter_default.a);

/**
 * Helper function to retrieve attribute value.
 * @param {String} suffix
 * @param {Element} element
 */


function getAttributeValue(suffix, element) {
    var attribute = 'data-clipboard-' + suffix;

    if (!element.hasAttribute(attribute)) {
        return;
    }

    return element.getAttribute(attribute);
}

/* harmony default export */ var clipboard = __webpack_exports__["default"] = (clipboard_Clipboard);

/***/ })
/******/ ])["default"];
});

/***/ }),
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(298);

module.exports = parent;


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(299);
var core = __webpack_require__(10);

if (!core.JSON) core.JSON = { stringify: JSON.stringify };

// eslint-disable-next-line no-unused-vars
module.exports = function stringify(it, replacer, space) {
  return core.JSON.stringify.apply(null, arguments);
};


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var getBuiltIn = __webpack_require__(38);
var fails = __webpack_require__(6);

var $stringify = getBuiltIn('JSON', 'stringify');
var re = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var fix = function (match, offset, string) {
  var prev = string.charAt(offset - 1);
  var next = string.charAt(offset + 1);
  if ((low.test(match) && !hi.test(next)) || (hi.test(match) && !low.test(prev))) {
    return '\\u' + match.charCodeAt(0).toString(16);
  } return match;
};

var FORCED = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

if ($stringify) {
  // https://github.com/tc39/proposal-well-formed-stringify
  $({ target: 'JSON', stat: true, forced: FORCED }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var result = $stringify.apply(null, arguments);
      return typeof result == 'string' ? result.replace(re, fix) : result;
    }
  });
}


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Local helper function.
 * Returns true if the prototype for the `item` param solely comes from `Object`.
 *
 * @param item
 */
exports.isObject = function (item) {
    return !!item && Object.prototype.toString.call(item) === '[object Object]';
};
/**
 * Local helper function.
 * Returns true if the prototype for the `item` param solely comes from `Object`, and it has no keys.
 *
 * @param item
 */
exports.isEmpty = function (item) {
    return exports.isObject(item) && Object.keys(item).length === 0;
};
/**
 * Local helper function.
 * Returns true if __all__ props of the given `predicate` exist and are equal to props of the given `source` item.
 *
 * @param sourceItem
 * @param predicate
 */
exports.checkAgainstPredicate = function (sourceItem, predicate) {
    return exports.isObject(sourceItem) && exports.isObject(predicate) && Object.keys(predicate).every(function (key) {
        return Object.prototype.hasOwnProperty.call(sourceItem, key) && predicate[key] === sourceItem[key];
    });
};


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js/get-iterator.js
var get_iterator = __webpack_require__(76);
var get_iterator_default = /*#__PURE__*/__webpack_require__.n(get_iterator);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/array/is-array.js
var is_array = __webpack_require__(40);
var is_array_default = /*#__PURE__*/__webpack_require__.n(is_array);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js/get-iterator-method.js
var get_iterator_method = __webpack_require__(111);
var get_iterator_method_default = /*#__PURE__*/__webpack_require__.n(get_iterator_method);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/symbol.js
var symbol = __webpack_require__(112);
var symbol_default = /*#__PURE__*/__webpack_require__.n(symbol);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/array/from.js
var from = __webpack_require__(66);
var from_default = /*#__PURE__*/__webpack_require__.n(from);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/slice.js
var slice = __webpack_require__(67);
var slice_default = /*#__PURE__*/__webpack_require__.n(slice);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/json/stringify.js
var stringify = __webpack_require__(284);
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/concat.js
var concat = __webpack_require__(0);
var concat_default = /*#__PURE__*/__webpack_require__.n(concat);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/find.js
var find = __webpack_require__(32);
var find_default = /*#__PURE__*/__webpack_require__.n(find);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/for-each.js
var for_each = __webpack_require__(9);
var for_each_default = /*#__PURE__*/__webpack_require__.n(for_each);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/splice.js
var splice = __webpack_require__(77);
var splice_default = /*#__PURE__*/__webpack_require__.n(splice);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/defineProperty.js
var defineProperty = __webpack_require__(68);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(34);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/filter.js
var filter = __webpack_require__(30);
var filter_default = /*#__PURE__*/__webpack_require__.n(filter);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/object/entries.js
var entries = __webpack_require__(78);
var entries_default = /*#__PURE__*/__webpack_require__.n(entries);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/slicedToArray.js
var slicedToArray = __webpack_require__(43);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/map.js
var map = __webpack_require__(11);
var map_default = /*#__PURE__*/__webpack_require__.n(map);

// CONCATENATED MODULE: ./src/js/data-maker/templates.js






var templates_createFieldsetCategory = function createFieldsetCategory(id, typeOfCategory, data) {
  var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8;

  return concat_default()(_context = concat_default()(_context2 = concat_default()(_context3 = concat_default()(_context4 = concat_default()(_context5 = concat_default()(_context6 = concat_default()(_context7 = concat_default()(_context8 = "\n    <fieldset id=\"".concat(id, "\" class=\"data-maker__fields data-maker__fields--category\">\n      <div class=\"data-maker__fields-top\">\n        <h2 class=\"data-maker__fields-title\">\n        ")).call(_context8, data !== undefined ? "".concat(data.name) : "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 <span class=\"data-maker__fields-title-type\">".concat(typeOfCategory, "</span>"), "\n        </h2>\n        <div class=\"data-maker__hide-btn\">\u0421\u043A\u0440\u044B\u0442\u044C</div>\n        <div class=\"data-maker__delete-btn data-maker__delete-btn--fields\"></div>\n      </div>\n      <div class=\"data-maker__fields-content\">\n        <label class=\"data-maker__field-wrap\">\n          <h3 class=\"data-maker__name-field\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 ")).call(_context7, typeOfCategory, " *</h3>\n          <input class=\"data-maker__input data-maker__input--name\" type=\"text\" name=\"category-id-")).call(_context6, id, "\" placeholder=\"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 ")).call(_context5, typeOfCategory, "\" \n          ")).call(_context4, data !== undefined ? "value=\"".concat(data.name, "\"") : "", " required>\n        </label>\n        <label class=\"data-maker__field-wrap\">\n          <h3 class=\"data-maker__name-field data-maker__name-field--new-line\">\n            \u041A\u0430\u0440\u0442\u0438\u043D\u043A\u0430 ")).call(_context3, typeOfCategory, " <span>(\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 \u0438\u0437 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0430)</span>\n          </h3>\n          <input class=\"data-maker__input data-maker__input--img\" type=\"text\" name=\"img-category-id-")).call(_context2, id, "\" placeholder=\"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438\" \n          ")).call(_context, data !== undefined ? "value=\"".concat(data.img, "\"") : "", ">\n        </label>\n      </div>\n      <div class=\"data-maker__add data-maker__add--product\" tabindex=\"0\">\n        + \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440\n      </div>\n      <div class=\"data-maker__add data-maker__add--subcategory\" tabindex=\"0\">\n        + \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E\n      </div>\n    </fieldset>\n  ");
};

var templates_createFieldsetProduct = function createFieldsetProduct(id, data) {
  var _context9, _context10, _context11, _context12, _context13, _context14, _context15, _context16;

  return concat_default()(_context9 = concat_default()(_context10 = concat_default()(_context11 = concat_default()(_context12 = concat_default()(_context13 = concat_default()(_context14 = concat_default()(_context15 = concat_default()(_context16 = "\n    <fieldset id=\"".concat(id, "\" class=\"data-maker__fields data-maker__fields--product\">\n      <div class=\"data-maker__fields-top\">\n        <h2 class=\"data-maker__fields-title\">\n          ")).call(_context16, data !== undefined ? "".concat(data.name) : "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u043E\u0432\u0430\u0440\u0430", "\n        </h2>\n        <div class=\"data-maker__hide-btn\">\u0421\u043A\u0440\u044B\u0442\u044C</div>\n        <div class=\"data-maker__delete-btn data-maker__delete-btn--fields\"></div>   \n      </div>\n      <div class=\"data-maker__fields-content\">\n        <div class=\"data-maker__field-wrap\">\n          <h3 class=\"data-maker__name-field\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0442\u043E\u0432\u0430\u0440\u0430 *</h3>\n          <input class=\"data-maker__input data-maker__input--name\" type=\"text\" name=\"name-product-id-")).call(_context15, id, "\" placeholder=\"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0442\u043E\u0432\u0430\u0440\u0430\" \n          ")).call(_context14, data !== undefined ? "value=\"".concat(data.name, "\"") : "", " required>\n          <span>\u0412 \u043D\u0430\u043B\u0438\u0447\u0438\u0438:</span>\n          <input class=\"data-maker__input data-maker__input--product-active\" type=\"checkbox\"\n          ")).call(_context13, data !== undefined ? data.active ? "checked" : "" : "checked", ">\n        </div>\n        <label class=\"data-maker__field-wrap\">\n          <h3 class=\"data-maker__name-field data-maker__name-field--new-line\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 <span>(\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0444\u0430\u0439\u043B\u0430 \u0438\u0437 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0430)</span></h3>\n          <input class=\"data-maker__input data-maker__input--img\" type=\"text\" name=\"img-product-id-")).call(_context12, id, "\" placeholder=\"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438\" \n          ")).call(_context11, data !== undefined ? "value=\"".concat(data.img, "\"") : "", ">\n        </label>\n        <label class=\"data-maker__field-wrap\">\n          <h3 class=\"data-maker__name-field\">\u0426\u0435\u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u0430 *</h3>\n          <input class=\"data-maker__input data-maker__input--price-product\" type=\"number\" name=\"price-product-id-")).call(_context10, id, "\" placeholder=\"\u0426\u0435\u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u0430\" \n          ")).call(_context9, data !== undefined ? "value=\"".concat(data.price, "\"") : "", " required>\n        </label>\n      </div>\n      <div class=\"data-maker__add data-maker__add--desc\" tabindex=\"0\">\n        + \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435\n      </div>\n      <div class=\"data-maker__add data-maker__add--option-wrap\" tabindex=\"0\">\n        + \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440\u0443 \u043E\u043F\u0446\u0438\u044E\n      </div>\n    </fieldset>\n  ");
};

var templates_createProductDesc = function createProductDesc(id, text) {
  var _context17;

  return concat_default()(_context17 = "\n    <label class=\"data-maker__field-wrap data-maker__field-wrap--desc\">\n      <div class=\"data-maker__fields-top\">\n        <h3 class=\"data-maker__name-field\">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0442\u043E\u0432\u0430\u0440\u0430:</h3>\n        <div class=\"data-maker__delete-btn data-maker__delete-btn--desc\"></div>\n      </div>  \n      <textarea class=\"data-maker__input data-maker__input--desc-product\" name=\"desc-product-id-".concat(id, "\" placeholder=\"\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u043F\u0435\u0440\u0435\u043D\u043E\u0441 \u0441\u0442\u0440\u043E\u043A\">")).call(_context17, text !== undefined ? text : "", "</textarea>\n    </label>\n  ");
};

var templates_createOption = function createOption(id, numberOption, state) {
  var _context18, _context19, _context20, _context21, _context22, _context23;

  return concat_default()(_context18 = concat_default()(_context19 = concat_default()(_context20 = concat_default()(_context21 = concat_default()(_context22 = concat_default()(_context23 = "\n    <div class=\"data-maker__option-item\">\n      <label class=\"data-maker__option-field-wrap\">\n        <h4 class=\"data-maker__name-field\">\u041E\u043F\u0446\u0438\u044F <span class=\"data-maker__option-num\">".concat(numberOption, "</span></h4>\n        <input class=\"data-maker__input data-maker__input--option-name data-maker__input--option-")).call(_context23, state !== undefined ? state : numberOption, "-product\" type=\"text\" name=\"option-")).call(_context22, numberOption, "-product-id-")).call(_context21, id, "\" placeholder=\"\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: M\"\n        ")).call(_context20, state !== undefined ? "value=\"".concat(map_default()(state).call(state, function (_ref) {
    var _ref2 = slicedToArray_default()(_ref, 1),
        key = _ref2[0];

    return key;
  })[0], "\"") : "", " required>\n      </label>\n      <label class=\"data-maker__option-field-wrap\">\n        <span class=\"data-maker__name-field\">\u0426\u0435\u043D\u0430</span>\n        <input class=\"data-maker__input data-maker__input--option-price\" type=\"number\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0446\u0435\u043D\u0443 \u0442\u043E\u0432\u0430\u0440\u0430\"\n        ")).call(_context19, state !== undefined ? "value=\"".concat(map_default()(state).call(state, function (_ref3) {
    var _ref4 = slicedToArray_default()(_ref3, 2),
        value = _ref4[1];

    return value;
  })[1], "\"") : "", " required>\n      </label>\n      <label class=\"data-maker__option-field-wrap\">\n        <input class=\"data-maker__input data-maker__input--option-active\" type=\"checkbox\"\n        ")).call(_context18, state !== undefined ? map_default()(state).call(state, function (_ref5) {
    var _ref6 = slicedToArray_default()(_ref5, 2),
        value = _ref6[1];

    return value;
  })[0] === true ? "checked" : "" : "checked", ">\n        <span>\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0439</span>\n      </label>\n    </div>\n  ");
};

var templates_createOptionWrap = function createOptionWrap(id, state) {
  var _context24, _context25, _context26;

  return concat_default()(_context24 = concat_default()(_context25 = "\n    <div class=\"data-maker__option-wrap\">\n      <label class=\"data-maker__field-wrap\">\n        <div class=\"data-maker__fields-top\">\n          <h3 class=\"data-maker__name-field\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B \u043E\u043F\u0446\u0438\u0439</h3>\n          <div class=\"data-maker__delete-btn data-maker__delete-btn--option\"></div>\n        </div>\n        <input class=\"data-maker__input data-maker__input--option-list-name\" type=\"text\" name=\"option-title-product-id-".concat(id, "\" placeholder=\"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u043F\u0446\u0438\u0438\" required\n        ")).call(_context25, state !== undefined ? "value=\"".concat(state.nameOptionList, "\"") : "", ">\n      </label>\n      <div class=\"data-maker__option\">\n      ")).call(_context24, state !== undefined ? map_default()(_context26 = state.optionList).call(_context26, function (item, index) {
    return templates_createOption(id, index + 1, entries_default()(item));
  }).join("") : templates_createOption(id, 1), "\n      </div>\n      <div class=\"data-maker__add data-maker__add--option-item\" tabindex=\"0\">+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u043F\u0446\u0438\u044E</div>\n    </div>\n  ");
}; // `subCategory`, `productsInCategory`


var templates_createTree = function createTree(arr, firstLevel, secondLevel) {
  var rootNode = document.querySelector(".data-maker");

  var newTree = function newTree(arr, firstLevel, secondLevel, indexItem) {
    map_default()(arr).call(arr, function (item) {
      // Если у элемента нет подкатегорий и товаров внутри
      if (firstLevel in item === false && secondLevel in item === false) {
        // Значит это товар
        var newProduct = templates_createFieldsetProduct(item.id, item);
        var desc = item.desc !== undefined ? templates_createProductDesc(item.id, item.desc.replace(/<br\s*[/]?>/gi, "\n")) : "",
            option = item.options !== undefined ? templates_createOptionWrap(item.id, item.options) : ""; // Ищем родительскую категорию

        var parentCategory = rootNode.querySelector("#".concat(CSS.escape(indexItem)));

        if (parentCategory !== null) {
          var btnAddProduct = parentCategory.querySelector(".data-maker__add--product");
          btnAddProduct.insertAdjacentHTML("beforebegin", newProduct);
        } else {
          // То отрисовываем товар на первом уровне
          entryProductBtn.insertAdjacentHTML("beforebegin", newProduct);
        }

        var productNode = document.getElementById(item.id);
        var productDescBtn = productNode.querySelector(".data-maker__add--desc");

        if (productDescBtn !== null) {
          productDescBtn.insertAdjacentHTML("beforebegin", desc);
          productDescBtn.remove();
        }

        var productOptionsBtn = productNode.querySelector(".data-maker__add--option-wrap");

        if (productOptionsBtn !== null) {
          productOptionsBtn.insertAdjacentHTML("beforebegin", option);
          productOptionsBtn.remove();
        }
      } // Иначе если есть продукты в категории
      else if (secondLevel in item) {
          var newCategory = templates_createFieldsetCategory(item.id, "\u043F\u043E\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438", item);

          var _parentCategory = rootNode.querySelector("#".concat(CSS.escape(indexItem)));

          var _btnAddProduct = _parentCategory.querySelectorAll(".data-maker__add--product");

          _btnAddProduct[_btnAddProduct.length - 1].insertAdjacentHTML("beforebegin", newCategory);

          return newTree(item[secondLevel], firstLevel, secondLevel, item.id);
        } // Иначе если есть категории
        else {
            // Создаём категорию
            var _newCategory;

            var _parentCategory2 = rootNode.querySelector("#".concat(CSS.escape(indexItem)));

            if (_parentCategory2 !== null) {
              var _btnAddProduct2 = _parentCategory2.querySelector(".data-maker__add--product");

              _newCategory = templates_createFieldsetCategory(item.id, "\u043F\u043E\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438", item);

              _btnAddProduct2.insertAdjacentHTML("beforebegin", _newCategory);
            } else {
              _newCategory = templates_createFieldsetCategory(item.id, "\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438", item); // Отрисовываем категорию на первом уровне

              entryProductBtn.insertAdjacentHTML("beforebegin", _newCategory);
            }

            return newTree(item[firstLevel], firstLevel, secondLevel, item.id);
          }
    });
  };

  newTree(arr, firstLevel, secondLevel);
};


// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/set-timeout.js
var set_timeout = __webpack_require__(79);
var set_timeout_default = /*#__PURE__*/__webpack_require__.n(set_timeout);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reduce.js
var reduce = __webpack_require__(25);
var reduce_default = /*#__PURE__*/__webpack_require__.n(reduce);

// CONCATENATED MODULE: ./src/js/data-maker/utils.js






// Импортируем информацию о товарах для поиска


var randomColor = function randomColor(el) {
  return el.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
};
/**
 * Получаем индекс последнего элемента на текущем уровне
 *
 * @param {collection} parentNode - родитель элемента
 * @param {string} className - имя класса
 * @returns
 */


var utils_indexOfLastElement = function indexOfLastElement(parentNode, className) {
  var _context;

  // Находим количество элементов
  var lastElement = filter_default()(_context = toConsumableArray_default()(parentNode.children)).call(_context, function (e) {
    return e.classList.contains(className);
  }); // Получаем индекс последнего элемента на первом уровне


  return lastElement.length + 1;
}; // Находим в массиве объект по его value


var utils_findElementInArr = function findElementInArr(value, arr, searchValue) {
  return reduce_default()(arr).call(arr, function (a, item) {
    if (a) return a;
    if (item[value] === searchValue) return item;
    if (item.subCategory) return findElementInArr(value, item.subCategory, searchValue);
    if (item.productsInCategory) return findElementInArr(value, item.productsInCategory, searchValue);
  }, null);
}; // Находим все элементы в массиве по его имени
// ! функция в функции, потому что привязка к внешней переменной


var utils_inputFindProduct = function inputFindProduct(nameFromInput, arr) {
  // [] с найденными через input элементами
  var foundItems = [];
  /* Рекурсивный поиск всех элементов по всему массиву
    Функция, принимающая на вход:
      arr - сам массив
      firstLevel - имя ключа первого уровня
      secondLevel - имя ключа второго уровня
      searchName - имя поиска
  */

  var findProduct = function findProduct(arr, firstLevel, secondLevel, searchName) {
    if (arr !== undefined) {
      // Проходим по каждому элементу массива
      map_default()(arr).call(arr, function (item) {
        if (item.name !== undefined) {
          if (item.name.toLowerCase() === searchName.toLowerCase()) {
            foundItems.push(item);
          } // Если элемент массива содержит ключ поиска, то..
          else if (secondLevel in item) {
              var _context2;

              /* Фильтруем переданный массив по имени поиска
                  В каждом элементе ищем имя
                    приводим его к нижнему регистру
                    и проверяем на содержание символов, переданных в атрибуте searchName
              */
              var newItem = filter_default()(_context2 = item[secondLevel]).call(_context2, function (item) {
                return item.name.toLowerCase() === searchName.toLowerCase();
              }); // Добавляем отфильтрованный массив во внешнюю переменную foundItems


              foundItems = concat_default()(foundItems).call(foundItems, newItem);
              return foundItems;
            } else {
              // Иначе снова вызываем функцию поиска в подкатегории
              return findProduct(item[firstLevel], firstLevel, secondLevel, searchName);
            }
        }
      });
    }
  }; // ! привязка к названиями потомков


  findProduct(arr, "subCategory", "productsInCategory", nameFromInput);
  return foundItems;
};

var utils_findElementsOfArrayByKey = function findElementsOfArrayByKey(nameFromInput, arr) {
  // [] с найденными через input элементами
  var foundItems = [];
  /* Рекурсивный поиск всех элементов по всему массиву
      Функция, принимающая на вход:
        arr - сам массив
        firstLevel - имя ключа первого уровня
        secondLevel - имя ключа второго уровня
        searchName - имя поиска
    */

  var findProduct = function findProduct(arr, firstLevel, secondLevel, searchName) {
    if (arr !== undefined) {
      // Проходим по каждому элементу массива
      map_default()(arr).call(arr, function (item) {
        foundItems.push(item.id); // Если элемент массива содержит ключ поиска, то..

        if (secondLevel in item) {
          // Иначе снова вызываем функцию поиска в подкатегории
          return findProduct(item[secondLevel], firstLevel, secondLevel, searchName);
        }

        if (firstLevel in item) {
          // Иначе снова вызываем функцию поиска в подкатегории
          return findProduct(item[firstLevel], firstLevel, secondLevel, searchName);
        }
      });
    }
  }; // ! привязка к названиями потомков


  findProduct(arr, "subCategory", "productsInCategory", nameFromInput);
  return foundItems;
}; // Функция задержки выполнения функции


var utils_debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = set_timeout_default()(function () {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);
    if (callNow) func.apply(context, args);
  };
}; // Проверка на нажатие enter


var utils_checkEnter = function checkEnter(e) {
  e = e || event;
  var txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
  return txtArea || (e.keyCode || e.which || e.charCode || 0) !== ENTER_KEYCODE;
};


// EXTERNAL MODULE: ./node_modules/find-and/lib/index.js
var lib = __webpack_require__(93);

// EXTERNAL MODULE: ./node_modules/clipboard/dist/clipboard.js
var clipboard = __webpack_require__(289);

// CONCATENATED MODULE: ./src/js/data-maker/data-maker.js















function _createForOfIteratorHelper(o) { if (typeof symbol_default.a === "undefined" || get_iterator_method_default()(o) == null) { if (is_array_default()(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = get_iterator_default()(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { var _context7; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = slice_default()(_context7 = Object.prototype.toString.call(o)).call(_context7, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return from_default()(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }




 // * Нельзя в категорию добавлять товар, если у неё есть подкатегория
// TODO: По-хорошему сделать бы проверку на общее количество конкретного товара в магазине
// TODO: реализовать возможность добавлять несколько опций к товару
// TODO: если удалить средний блок, то нарушится нумерация - может убрать вообще её?
// TODO: цену первой (активной?) опции нельзя менять - потому что в магазине выбирается первая активная опция
// TODO: добавить разные цвета для новых блоков (логичнее через css)
// TODO: добавить проверку активности категории
// // TODO: добавить проверку наличия товара
// // TODO: реализовать возможность удалять товар/категорию
// // TODO: реализовать возможность скрывать товар/категорию
// // ! если не задать имя предыдущей подкатегории с созданным товаром, то нельзя добавить следующую подкатегорию

var ENTER_KEYCODE = 13;
var formWrap = document.querySelector(".data-maker__wrap");
var userIdInput = formWrap.querySelector(".data-maker__input--user-id");
var currencyInput = formWrap.querySelector(".data-maker__input--currency");
var entry = formWrap.querySelector(".data-maker__entry-point");
var entryProductBtn = entry.querySelector(".data-maker__add--product");
var enrtyCategoryBtn = entry.querySelector(".data-maker__add--category");
var globalSetting = {
  userId: "",
  currency: ""
};
var productList = [];
var data_maker_id = 1;
var submitBtn = formWrap.querySelector(".data-maker__btn");
var infoBlock = document.querySelector(".data-maker__block-info");
var infoText = infoBlock.querySelector(".data-maker__block-info-text");
var copyInfoBtn = infoBlock.querySelector(".data-maker__block-info-btn-copy");
var copyInfo = new clipboard(copyInfoBtn);

var data_maker_addElementOnEntryLevel = function addElementOnEntryLevel(type, elementInsert) {
  var typeOfFields;

  if (type === "product") {
    typeOfFields = templates_createFieldsetProduct(data_maker_id);
  } else if (type === "category") {
    typeOfFields = templates_createFieldsetCategory(data_maker_id, "\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438");
  }

  elementInsert.insertAdjacentHTML("beforebegin", typeOfFields);
  var addData = {
    id: data_maker_id,
    name: ""
  };

  if (type === "product") {
    ;
    addData.price = 0, addData.active = true;
  }

  productList.push(addData);
  data_maker_id++;
};
/**
 * Добавление товара
 *
 * @param {HTMLElement} target - элемент из обработчика
 * @param {HTMLElement} parentNode - индекс товара
 * @param {object} data - объект товара
 */


var data_maker_addProduct = function addProduct(target, parentNode, data) {
  var _context;

  // Находим кнопку добавления товара
  var productToCatBtn = filter_default()(_context = toConsumableArray_default()(parentNode.children)).call(_context, function (el) {
    return el.classList.contains("data-maker__add--product");
  })[0]; // Находим кнопкe добавления подкатегории


  var subCategoryBtn = parentNode.querySelector(".data-maker__add--subcategory"); // Добавляем товар в текущую категорию

  if (productToCatBtn === target) {
    // Добавляем товар на страницу
    productToCatBtn.insertAdjacentHTML("beforebegin", templates_createFieldsetProduct(data_maker_id));

    if (subCategoryBtn !== null) {
      subCategoryBtn.remove();
    } // Если категория уже имеет товары, добавляем товар как объект


    if ("productsInCategory" in data) {
      data.productsInCategory.push({
        id: data_maker_id,
        name: "",
        price: 0,
        active: true
      });
    } // Иначе, добавляем массив с товарами
    else {
        productList = lib["appendProps"](productList, data, {
          productsInCategory: [{
            id: data_maker_id,
            name: "",
            price: 0,
            active: true
          }]
        });
      }

    data_maker_id++;
  }
};
/**
 * Добавление категории
 *
 * @param {HTMLElement} target - элемент из обработчика
 * @param {number} index - индекс товара
 * @param {object} data - объект товара
 */


var data_maker_addCategory = function addCategory(target, parentNode, data) {
  var _context2;

  // Находим кнопкe добавления подкатегории
  var subCategoryBtn = filter_default()(_context2 = toConsumableArray_default()(parentNode.children)).call(_context2, function (e) {
    return e.classList.contains("data-maker__add--subcategory");
  })[0];

  var productBtn = parentNode.querySelector(".data-maker__add--product");

  if (subCategoryBtn === target) {
    // Добавляем подкатегорию
    subCategoryBtn.insertAdjacentHTML("beforebegin", templates_createFieldsetCategory(data_maker_id, "\u043F\u043E\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438"));

    if (productBtn !== null) {
      productBtn.remove();
    } // Если категория уже имеет категории, добавляем категорию как объект


    if ("subCategory" in data) {
      data.subCategory.push({
        id: data_maker_id,
        name: ""
      });
    } // Иначе добавляем массив с категориями
    else {
        productList = lib["appendProps"](productList, data, {
          subCategory: [{
            id: data_maker_id,
            name: ""
          }]
        });
      }

    data_maker_id++;
  }
};
/**
 * Добавление опций товара
 *
 * @param {HTMLElement} target - элемент, пот которому сделан клик
 * @param {HTMLElement} element - обёртка товара
 * @param {number} elementId - индекс товара
 * @param {object} data - объект текущего товара
 */


var data_maker_productOption = function productOption(target, element, elementId, data) {
  // Кнопка открытия опций
  var openOptionWrapHandler = element.querySelector(".data-maker__add--option-wrap"); // Цена товара

  var priceProduct = element.querySelector(".data-maker__input--price-product"); // Открываем блок опций

  if (openOptionWrapHandler === target) {
    // Вставляем опции в элемент
    openOptionWrapHandler.insertAdjacentHTML("beforebegin", templates_createOptionWrap(elementId)); // Отображаем блок с опциями

    openOptionWrapHandler.style.display = "none"; // Добавляем цену в опцию

    var optionPrice = element.querySelector(".data-maker__input--option-price");
    optionPrice.value = Number(priceProduct.value); // Добавляем объект с опциями в итоговый массив

    productList = lib["appendProps"](productList, data, {
      options: {
        nameOptionList: "",
        optionList: [{
          optionName1: true,
          price: Number(priceProduct.value)
        }]
      }
    });
  } // Находим обёртку опций


  var wrapOption = element.querySelector(".data-maker__option-wrap"); // Если обёртка опций существует

  if (wrapOption !== null) {
    // Добавляем опцию
    var addOptionHandler = wrapOption.querySelector(".data-maker__add--option-item"); // Получаем номера всех опций

    var optionNum = wrapOption.querySelectorAll(".data-maker__option-num"); // Получаем номер последней опции
    // * для корректного атрибута name инпута и уникального объекта

    var lastOptionNum = optionNum[optionNum.length - 1].textContent; // Находим блок пунктов опций

    var optionList = wrapOption.querySelector(".data-maker__option"); // Если нажата кнопка добавления опции

    if (addOptionHandler === target) {
      var _data$options$optionL;

      // Увеличиваем номер последней опции
      lastOptionNum++; // Отрисовываем в конце блока с опциями

      optionList.insertAdjacentHTML("beforeend", templates_createOption(elementId, lastOptionNum)); // Добавляем цену в опцию

      var optionsPrice = optionList.querySelectorAll(".data-maker__input--option-price");
      var lastOptionPrice = optionsPrice[optionsPrice.length - 1];
      lastOptionPrice.value = priceProduct.value; // Добавляем инфу опции в массив опций итогового массива

      data.options.optionList.push((_data$options$optionL = {}, defineProperty_default()(_data$options$optionL, "optionName" + lastOptionNum, true), defineProperty_default()(_data$options$optionL, "price", Number(priceProduct.value)), _data$options$optionL));
    } // Ищем кнопку закрытия опций


    var closeOption = element.querySelector(".data-maker__delete-btn--option"); // Если нажата кнопка закрытия опций

    if (closeOption === target) {
      // Удаляем блок с опциями
      wrapOption.remove(); // Очищаем объект с опциями

      data.options = undefined; // Отображаем кнопку добавления

      openOptionWrapHandler.style.display = "";
    }
  }
};
/**
 * Добавление описания товара
 *
 * @param {HTMLElement} target - элемент, пот которому сделан клик
 * @param {HTMLElement} element - обёртка товара
 * @param {number} elementId - индекс товара
 * @param {object} data - объект текущего товара
 */


var data_maker_productDesc = function productDesc(target, element, elementId, data) {
  // Кнопка добавления описания
  var openProductDescHandler = element.querySelector(".data-maker__add--desc");

  if (openProductDescHandler === target) {
    // Вставляем блок описания перед кнопкой описания
    openProductDescHandler.insertAdjacentHTML("beforebegin", templates_createProductDesc(elementId)); // Скрываем кнопку добавления описания

    openProductDescHandler.style.display = "none"; // Добавляем поле описания в объект товара

    productList = lib["appendProps"](productList, data, {
      desc: undefined
    });
  } // Блок с описанием


  var wrapDesc = element.querySelector(".data-maker__field-wrap--desc"); // Если существует

  if (wrapDesc !== null) {
    // Закрываем поле описания
    var closeDesc = element.querySelector(".data-maker__delete-btn--desc");

    if (closeDesc === target) {
      // Удаляем описание
      wrapDesc.remove(); // Очищаем описание

      data.desc = undefined; // Отображаем кнопку добавления описания

      openProductDescHandler.style.display = "";
    }
  }
};

var inputAddName = function inputAddName(inputFieldParent, currentElementInput, currentInput) {
  // Название товара
  var inputName = inputFieldParent.querySelector(".data-maker__input--name");

  if (inputName === currentInput) {
    // Изменеяем имя текущего элемента в массиве
    currentElementInput.name = inputName.value; // Заменяем тайтл заголовка

    var titleProduct = inputFieldParent.querySelector(".data-maker__fields-title");
    titleProduct.textContent = inputName.value;
  }
};

var inputAddValue = function inputAddValue(inputFieldParent, currentInput, currentChangeObject, changeValue) {
  // Название картинки товара
  var input = inputFieldParent.querySelector(currentInput);
  currentChangeObject[changeValue] = input.value;
};

var data_maker_getFieldId = function getFieldId(fieldElement) {
  // Уникальный индекс нового элемента
  // * уникальный id для поиска элемента в массиве
  var fieldsId = Number(fieldElement.id); // Найденный объект элемента в массиве, соответсвующий индексу
  // * объект в [productList], соответствующий fieldsId

  return utils_findElementInArr("id", productList, fieldsId);
}; // * Основной код приложения
// Обработчик события на инпут
// ? эта функция вызывается каждый раз при клике по форме
// * большая вложенность


var data_maker_addInputEvent = function addInputEvent() {
  // Находим все инпуты в блоке
  var allInputsElement = formWrap.querySelectorAll(".data-maker__input"); // Отрезаем первые два, потому что они из другого блока

  var allInputs = toConsumableArray_default()(allInputsElement);

  splice_default()(allInputs).call(allInputs, 0, 2); // Проходимся по всем массивам


  for_each_default()(allInputs).call(allInputs, function (input) {
    input.oninput = utils_debounce(function (target) {
      var _context3;

      // Находим родительского блока текущего инпута
      var inputFieldParent = find_default()(_context3 = target.path).call(_context3, function (item) {
        return item.classList.contains("data-maker__fields");
      }); // Находим объект родителя инпута в массиве


      var dataOfInput = data_maker_getFieldId(inputFieldParent); // Название категории/товара

      inputAddName(inputFieldParent, dataOfInput, input);
      var activeProductInput = inputFieldParent.querySelector(".data-maker__input--product-active");

      if (input === activeProductInput) {
        dataOfInput.active = input.checked;
      } // Название картинки


      inputAddValue(inputFieldParent, ".data-maker__input--img", dataOfInput, "img"); // Выбираем блок с продуктом

      if (inputFieldParent.classList.contains("data-maker__fields--product")) {
        // Цена товара
        var inputPrice = inputFieldParent.querySelector(".data-maker__input--price-product");
        dataOfInput.price = Number(inputPrice.value); // inputAddValue(
        //   inputFieldParent,
        //   `.data-maker__input--price-product`,
        //   dataOfInput,
        //   `price`
        // )
        // Описание товара

        var inputProductDesc = inputFieldParent.querySelector(".data-maker__input--desc-product"); // ? если убрать вторую проверку, то косяк с именем

        if (inputProductDesc !== null && input === inputProductDesc) {
          // Заполняем описане товара и меняем перенос
          // на новую строку на hmtl-тег
          dataOfInput.desc = input.value.replace(/\n/g, "<br />");
        } // Блок с опциями товара


        var productOptionsWrap = inputFieldParent.querySelector(".data-maker__option-wrap"); // Если блок с опциями найден

        if (productOptionsWrap !== null) {
          // Ищем название опций
          var inputProductOptionsName = productOptionsWrap.querySelector(".data-maker__input--option-list-name"); // Если текущий импут, это имя блока опций

          if (input === inputProductOptionsName) {
            dataOfInput.options.nameOptionList = input.value;
          } // Ищём все опции


          var inputProductOptionName = productOptionsWrap.querySelectorAll(".data-maker__option-item"); // Проходим по коллекции опций

          var _iterator = _createForOfIteratorHelper(inputProductOptionName),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;
              // Находим номер опции
              var itemNum = item.querySelector(".data-maker__option-num").textContent; // Ищем название опции

              var inputOptionName = item.querySelector(".data-maker__input--option-name"); // Ищем статус опции

              var inputOptionStatus = item.querySelector(".data-maker__input--option-active");
              var inputOptionPrice = item.querySelector(".data-maker__input--option-price"); // Ищем опцию в элементе массива

              var option = dataOfInput.options.optionList[itemNum - 1]; // Если текущий инпут это имя опции

              if (input === inputOptionName) {
                var _findAnd$replaceObjec;

                productList = lib["replaceObject"](productList, option, (_findAnd$replaceObjec = {}, defineProperty_default()(_findAnd$replaceObjec, input.value, inputOptionStatus.checked), defineProperty_default()(_findAnd$replaceObjec, "price", Number(inputOptionPrice.value)), _findAnd$replaceObjec));
              } // Если текущий инпут это цена опции


              if (input === inputOptionPrice) {
                var _findAnd$replaceObjec2;

                productList = lib["replaceObject"](productList, option, (_findAnd$replaceObjec2 = {}, defineProperty_default()(_findAnd$replaceObjec2, inputOptionName.value, inputOptionStatus.checked), defineProperty_default()(_findAnd$replaceObjec2, "price", Number(inputOptionPrice.value)), _findAnd$replaceObjec2));
              } // Если текущий инпут это состояние опции


              if (input === inputOptionStatus) {
                var _findAnd$replaceObjec3;

                productList = lib["replaceObject"](productList, option, (_findAnd$replaceObjec3 = {}, defineProperty_default()(_findAnd$replaceObjec3, inputOptionName.value, input.checked), defineProperty_default()(_findAnd$replaceObjec3, "price", Number(inputOptionPrice.value)), _findAnd$replaceObjec3));
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }

      console.log("productList :", productList);
    }, 500);
  });
}; // Создание структуры массива и отрисовка полей
// *главная функция


var data_maker_createStructure = function createStructure() {
  var target = event.target; // Получаем обёртку полей первого уровня

  var entryFields = target.closest(".data-maker__entry-point"); // Находим сообщение, побуждающее создать товар

  var message = entry.querySelector(".message-to-create"); // Если найдено, удаляем его

  if (message !== null) {
    message.remove();
  } // Проверяем, первый ли это уровень


  if (entryFields !== null) {
    // Если это кнопка добавления товара первого уровня
    if (entryProductBtn === target) {
      data_maker_addElementOnEntryLevel("product", entryFields);
    } // Если это кнопка добавления категории первого уровня


    if (enrtyCategoryBtn === target) {
      data_maker_addElementOnEntryLevel("category", entryFields);
    }
  } // Находим элемент обёртки поля текущего уровня


  var fieldsWrap = target.closest(".data-maker__fields"); // Если это блок товара/категории

  if (fieldsWrap !== null) {
    var currentElementClick = data_maker_getFieldId(fieldsWrap); // Добавляем товар

    data_maker_addProduct(target, fieldsWrap, currentElementClick); // Добавляем категорию

    data_maker_addCategory(target, fieldsWrap, currentElementClick); // Если это продукт

    if (fieldsWrap.classList.contains("data-maker__fields--product")) {
      data_maker_productDesc(target, fieldsWrap, fieldsWrap.id, currentElementClick);
      data_maker_productOption(target, fieldsWrap, fieldsWrap.id, currentElementClick);
    } // Находим кнопку удаления


    var deleteFieldsBtn = fieldsWrap.querySelector(".data-maker__delete-btn--fields");

    if (deleteFieldsBtn === target) {
      var _context5;

      // Удаляем объект из массива
      productList = lib["removeObject"](productList, currentElementClick);

      var addSubcategoryBtn = function addSubcategoryBtn(type, name) {
        var _context4;

        return concat_default()(_context4 = "<div class=\"data-maker__add data-maker__add--".concat(type, "\" tabindex=\"0\">\n        + \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C ")).call(_context4, name, "\n      </div>");
      };

      if (fieldsWrap.parentNode.querySelector(".data-maker__add--subcategory") === null && fieldsWrap.parentNode !== formWrap) {
        fieldsWrap.parentNode.insertAdjacentHTML("beforeend", addSubcategoryBtn("subcategory", "\u043F\u043E\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E"));
      } // Проверка среди непосредственных потомков


      var parentProductBtn = filter_default()(_context5 = toConsumableArray_default()(fieldsWrap.parentNode.children)).call(_context5, function (el) {
        return el.classList.contains("data-maker__add--product");
      })[0]; // Если кнопка добавления продукта не найдена


      if (parentProductBtn === undefined && fieldsWrap.parentNode !== formWrap) {
        var _context6;

        var subcategoryBtn = filter_default()(_context6 = toConsumableArray_default()(fieldsWrap.parentNode.children)).call(_context6, function (el) {
          return el.classList.contains("data-maker__add--subcategory");
        })[0];

        subcategoryBtn.insertAdjacentHTML("beforebegin", addSubcategoryBtn("product", "\u0442\u043E\u0432\u0430\u0440"));
      } // Удаляем группу полей


      fieldsWrap.remove();
    } // Находим кнопку скрытия блока


    var hideFieldsBtn = fieldsWrap.querySelector(".data-maker__hide-btn");

    if (hideFieldsBtn === target) {
      fieldsWrap.classList.toggle("data-maker__fields--collapse");

      if (hideFieldsBtn.textContent === "\u0421\u043A\u0440\u044B\u0442\u044C") {
        hideFieldsBtn.textContent = "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C";
      } else {
        hideFieldsBtn.textContent = "\u0421\u043A\u0440\u044B\u0442\u044C";
      }
    }
  } // Обработка клика по кнопке отправки формы


  if (submitBtn === target) {
    // Если массив с информацией пустой, отменяем действие по-умолчанию
    if (formWrap.checkValidity() && productList.length === 0) {
      var _message = "<span class=\"message-to-create\">\u041C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043D\u0443\u0436\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440 \u0438\u043B\u0438 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E?</span>";
      submitBtn.insertAdjacentHTML("beforebegin", _message);
      event.preventDefault();
    } // Если форма проходит валидацию и массив с инфой не пустой


    if (formWrap.checkValidity() && productList.length > 0) {
      // Показываем блок с массивом
      infoBlock.style.display = ""; // Переводим инфу о товарах в json формат и отрисовываем её в блоке

      var globalSettingJson = stringify_default()(globalSetting); // Парсим массив в json и удаляем из него id


      var productListJson = stringify_default()(productList);

      infoText.textContent = globalSettingJson + productListJson;
      event.preventDefault();
    }
  }

  console.log("productList :", productList);
};
/**
 * Проверка инпута на изменение
 *
 * @param {HTMLElement} element
 * @param {Object} object
 * @param {String} changeValue
 */


var data_maker_checkInputValue = function checkInputValue(element, object, changeValue) {
  element.oninput = utils_debounce(function () {
    object[changeValue] = element.value;
  }, 500);
};

var data_maker_addWrapListener = function addWrapListener() {
  formWrap.onclick = function () {
    data_maker_createStructure();
    data_maker_addInputEvent();
  };

  formWrap.onkeydown = function () {
    // Запрещаем отправку формы по enter
    utils_checkEnter();

    if (event.keyCode === ENTER_KEYCODE) {
      data_maker_createStructure();
      data_maker_addInputEvent();
    }
  };
};

data_maker_checkInputValue(userIdInput, globalSetting, "userId");
data_maker_checkInputValue(currencyInput, globalSetting, "currency");
data_maker_addWrapListener();
copyInfo.on("success", function (e) {
  e.trigger.textContent = "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E! \u0412\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u044D\u0442\u043E\u0442 \u0442\u0435\u043A\u0441\u0442 \u043F\u043E\u0441\u043B\u0435 \u043A\u043E\u0434\u0430 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430";
  e.clearSelection();
  window.setTimeout(function () {
    e.trigger.textContent = "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E";
  }, 4000);
});

(function () {
  ;
  "use strict"; // eslint-disable-line no-unused-expressions

  /* globals window:true */


  var _window = typeof window !== "undefined" ? window : this;

  var market = _window.market = function (globalSettingIn, productListIn) {
    var setting = JSON.parse(globalSettingIn);
    var list = JSON.parse(productListIn);
    userIdInput.value = setting.userId;
    currencyInput.value = setting.currency;
    globalSetting = setting;
    productList = list;
    data_maker_id = utils_findElementsOfArrayByKey("id", productList).length;
    templates_createTree(productList, "subCategory", "productsInCategory");
    var fields = document.querySelectorAll(".data-maker__fields");

    var _iterator2 = _createForOfIteratorHelper(fields),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var field = _step2.value;
        field.classList.toggle("data-maker__fields--collapse");
        var hideFieldsBtn = field.querySelector(".data-maker__hide-btn");
        hideFieldsBtn.textContent = "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C";
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    data_maker_checkInputValue(userIdInput, globalSetting, "userId");
    data_maker_checkInputValue(currencyInput, globalSetting, "currency");
    data_maker_addWrapListener();
  };

  return market;
});


// EXTERNAL MODULE: ./src/styles/data-maker.scss
var data_maker = __webpack_require__(301);

// CONCATENATED MODULE: ./src/data-maker.js
 // import 'normalize.css'



/***/ })
/******/ ]);