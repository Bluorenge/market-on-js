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
/******/ 	return __webpack_require__(__webpack_require__.s = 340);
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(303);

/***/ }),
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
/* 7 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var _Object$defineProperty = __webpack_require__(233);

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;

    _Object$defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var _Object$getPrototypeOf = __webpack_require__(318);

var _Object$setPrototypeOf = __webpack_require__(285);

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = _Object$setPrototypeOf ? _Object$getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || _Object$getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var _Object$create = __webpack_require__(306);

var setPrototypeOf = __webpack_require__(310);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(283);

var assertThisInitialized = __webpack_require__(317);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(275);

/***/ }),
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(248);

/***/ }),
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
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(262);

/***/ }),
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
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(244);

/***/ }),
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
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(240);

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(255);

/***/ }),
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
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(252);

/***/ }),
/* 93 */,
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
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(18);
var isArrayIteratorMethod = __webpack_require__(118);
var toLength = __webpack_require__(26);
var bind = __webpack_require__(47);
var getIteratorMethod = __webpack_require__(61);
var callWithSafeIterationClosing = __webpack_require__(117);

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
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(31);

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
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(329);

/***/ }),
/* 128 */
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
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);

module.exports = global.Promise;


/***/ }),
/* 214 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(18);
var aFunction = __webpack_require__(31);
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
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var fails = __webpack_require__(6);
var classof = __webpack_require__(37);
var bind = __webpack_require__(47);
var html = __webpack_require__(115);
var createElement = __webpack_require__(81);
var IS_IOS = __webpack_require__(217);

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
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

var userAgent = __webpack_require__(84);

module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(18);
var isObject = __webpack_require__(13);
var newPromiseCapability = __webpack_require__(121);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 219 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),
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
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(271);

/***/ }),
/* 227 */
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
/* 228 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {/* harmony import */ var _ponyfill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(293);
/* global window */


var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {}

var result = Object(_ponyfill_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(root);
/* harmony default export */ __webpack_exports__["a"] = (result);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(122), __webpack_require__(128)(module)))

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(54);

module.exports = function (target, src, options) {
  for (var key in src) {
    if (options && options.unsafe && target[key]) target[key] = src[key];
    else redefine(target, key, src[key], options);
  } return target;
};


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(38);
var definePropertyModule = __webpack_require__(23);
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
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(31);
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
/* 232 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(280);

/***/ }),
/* 234 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return carousel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return carouselNav; });
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_sort__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(226);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_sort__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_sort__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_set_timeout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(79);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_set_timeout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_set_timeout__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(92);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(28);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(35);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var perfect_scrollbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(227);






// Импорт кастомного скроллбара


(function (factory) {
  typeof define === "function" && __webpack_require__(232) ? define(factory) : typeof exports === "object" ? module.exports = factory() : factory();
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

    _.opt = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_5___default()({}, {
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


    _.resize = _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_4___default()(_context = _.init).call(_context, _, true);

    _.event(_.ele, "add", {
      scroll: _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_4___default()(_context2 = _.updateControls).call(_context2, _)
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

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()([]).call(_.slides, function (_) {
      _.classList.add("glider-slide");
    });

    _.containerWidth = _.ele.clientWidth;

    var breakpointChanged = _.settingsBreakpoint();

    if (!paging) paging = breakpointChanged;

    if (_.opt.slidesToShow === "auto" || typeof _.opt._autoSlide !== "undefined") {
      var slideCount = _.containerWidth / _.opt.itemWidth;
      _.opt._autoSlide = _.opt.slidesToShow = _.opt.exactWidth ? slideCount : Math.floor(slideCount);
    }

    if (_.opt.slidesToScroll === "auto") {
      _.opt.slidesToScroll = Math.floor(_.opt.slidesToShow);
    }

    _.itemWidth = _.opt.exactWidth ? _.opt.itemWidth : _.containerWidth / _.opt.slidesToShow // set slide dimensions
    ;

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()([]).call(_.slides, function (__) {
      __.style.height = "auto";
      __.style.width = _.itemWidth + "px";
      width += _.itemWidth;
      height = Math.max(__.offsetHeight, height);
    });

    _.track.style.width = width + "px";
    _.trackWidth = width;
    _.isDrag = false;
    _.preventClick = false;
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

    _.mouse = _.mouse || _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_4___default()(_context3 = _.handleMouse).call(_context3, _);

    var mouseup = function mouseup() {
      _.mouseDown = undefined;

      _.ele.classList.remove("drag");

      if (_.isDrag) {
        _.preventClick = true;
      }

      _.isDrag = false;
    };

    var events = {
      mouseup: mouseup,
      mouseleave: mouseup,
      mousedown: function mousedown(e) {
        e.preventDefault();
        e.stopPropagation();
        _.mouseDown = e.clientX;

        _.ele.classList.add("drag");
      },
      mousemove: _.mouse,
      click: function click(e) {
        if (_.preventClick) {
          e.preventDefault();
          e.stopPropagation();
        }

        _.preventClick = false;
      }
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
        click: _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_4___default()(_context4 = _.scrollItem).call(_context4, _, i, true)
      });

      _.dots.appendChild(dot);
    }
  };

  gliderPrototype.bindArrows = function () {
    var _context6;

    var _ = this;

    if (!_.opt.arrows) {
      var _context5;

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()(_context5 = _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_2___default()(_.arrows)).call(_context5, function (direction) {
        var element = _.arrows[direction];

        _.event(element, "remove", {
          click: element._func
        });
      });

      return;
    }

    ;

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()(_context6 = ["prev", "next"]).call(_context6, function (direction) {
      var arrow = _.opt.arrows[direction];

      if (arrow) {
        var _context7;

        if (typeof arrow === "string") arrow = document.querySelector(arrow);
        arrow._func = arrow._func || _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_4___default()(_context7 = _.scrollItem).call(_context7, _, direction);

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

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()([]).call(_.slides, function (slide, index) {
      var slideClasses = slide.classList;
      var wasVisible = slideClasses.contains("visible");
      var start = _.ele.scrollLeft;
      var end = _.ele.scrollLeft + _.containerWidth;
      var itemStart = _.itemWidth * index;
      var itemEnd = itemStart + _.itemWidth;

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()([]).call(slideClasses, function (className) {
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

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()([]).call(_.dots.children, function (dot, index) {
        dot.classList.toggle("active", _.page === index);
      });
    }

    if (event && _.opt.scrollLock) {
      clearTimeout(_.scrollLock);
      _.scrollLock = _babel_runtime_corejs3_core_js_stable_set_timeout__WEBPACK_IMPORTED_MODULE_1___default()(function () {
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
      _babel_runtime_corejs3_core_js_stable_instance_sort__WEBPACK_IMPORTED_MODULE_0___default()(resp).call(resp, function (a, b) {
        return b.breakpoint - a.breakpoint;
      });

      for (var i = 0; i < resp.length; ++i) {
        var size = resp[i];

        if (_window.innerWidth >= size.breakpoint) {
          if (_.breakpoint !== size.breakpoint) {
            _.opt = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_5___default()({}, _._opt, size.settings);
            _.breakpoint = size.breakpoint;
            return true;
          }

          return false;
        }
      }
    } // set back to defaults in case they were overriden


    var breakpointChanged = _.breakpoint !== 0;
    _.opt = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_5___default()({}, _._opt);
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
      _.isDrag = true;
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

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()(_context8 = _._opt.responsive).call(_context8, function (v) {
        if (v.breakpoint === _.breakpoint) {
          v.settings = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_5___default()({}, v.settings, opt);
        }
      });
    } else {
      _._opt = _babel_runtime_corejs3_core_js_stable_object_assign__WEBPACK_IMPORTED_MODULE_5___default()({}, _._opt, opt);
    }

    _.breakpoint = 0;

    _.settingsBreakpoint();
  };

  gliderPrototype.destroy = function () {
    var _ = this;

    var replace = _.ele.cloneNode(true);

    var clear = function clear(ele) {
      ele.removeAttribute("style");

      _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()([]).call(ele.classList, function (className) {
        ;
        /^glider/.test(className) && ele.classList.remove(className);
      });
    }; // remove track


    replace.children[0].outerHTML = replace.children[0].innerHTML;
    clear(replace);

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()([]).call(replace.getElementsByTagName("*"), clear);

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

    var eventHandler = _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_4___default()(_context9 = ele[type + "EventListener"]).call(_context9, ele);

    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_3___default()(_context10 = _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_2___default()(args)).call(_context10, function (k) {
      eventHandler(k, args[k]);
    });
  };

  return Glider;
});

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

var addScrollBar = function addScrollBar(element) {
  // Добавляем скроллбар, если это не тач-устройство
  if (isTouchDevice() === false) {
    new perfect_scrollbar__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"](element);
  }
}; // Создание карусели и скролбара


var carousel = function carousel(options, wrap, list, width) {
  if (!options.horizontalScroll) {
    // Добавляем списку вертикальную раскладку
    wrap.querySelector(".market-products__list").classList.add("market-products__list--vertical");
  } // Проверяем, больше ли длина списка элементов блока, в котором они находятся


  if (list.offsetWidth < width) {
    wrap.classList.add("market-content--shadow");

    if (options.horizontalScroll) {
      // Создаём карусель
      new Glider(list, {
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

      var checkScrollY = function checkScrollY(list) {
        var maxScrollLeft = list.scrollWidth - list.clientWidth; // Расчёт максимального скролла с запасом

        if (list.scrollLeft >= maxScrollLeft - 15) {
          wrap.classList.remove("market-content--shadow");
        } else {
          wrap.classList.add("market-content--shadow");
        }
      }; // Прокрутка контекта внутри блока


      list.addEventListener("wheel", function (e) {
        if (e.deltaY > 0) this.scrollLeft += 50;else this.scrollLeft -= 50;
        checkScrollY(this);
      });
      list.addEventListener("scroll", function () {
        checkScrollY(this);
      });
    } else {
      // Проверка, долистан ли скролл до конца блока
      var checkScrollX = function checkScrollX(list) {
        var maxScrollBottom = list.scrollHeight - list.clientHeight; // Расчёт максимального скролла с запасом

        if (list.scrollTop >= maxScrollBottom - 15) {
          wrap.classList.remove("market-content--shadow");
        } else {
          wrap.classList.add("market-content--shadow");
        }
      }; // * сюда можно сделать какой-нибудь эффект при пролистывания до низа блока


      list.addEventListener("scroll", function () {// checkScrollX(this)
      });
    }

    addScrollBar(list);
  }
}; // Карусель навигации

var carouselNav = function carouselNav(menuWrap, width) {
  if (menuWrap.offsetWidth < width) {
    new Glider(menuWrap, {
      slidesToShow: "auto",
      dragVelocity: 1,
      draggable: true
    }).scrollTo(width);
  }
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(128)(module)))

/***/ }),
/* 235 */
/***/ (function(module, exports) {

!function(){function t(){var e=Array.prototype.slice.call(arguments),n=document.createDocumentFragment();e.forEach(function(e){var t=e instanceof Node;n.appendChild(t?e:document.createTextNode(String(e)))}),this.appendChild(n)}[Element.prototype,Document.prototype,DocumentFragment.prototype].forEach(function(e){e.hasOwnProperty("append")||Object.defineProperty(e,"append",{configurable:!0,enumerable:!0,writable:!0,value:t})})}();


/***/ }),
/* 236 */
/***/ (function(module, exports) {

!function(){function t(){null!==this.parentNode&&this.parentNode.removeChild(this)}[Element.prototype,CharacterData.prototype,DocumentType.prototype].forEach(function(e){e.hasOwnProperty("remove")||Object.defineProperty(e,"remove",{configurable:!0,enumerable:!0,writable:!0,value:t})})}();


/***/ }),
/* 237 */
/***/ (function(module, exports) {

!function(){function t(){var e=Array.prototype.slice.call(arguments),r=document.createDocumentFragment();e.forEach(function(e){var t=e instanceof Node;r.appendChild(t?e:document.createTextNode(String(e)))}),this.parentNode.insertBefore(r,this.nextSibling)}[Element.prototype,CharacterData.prototype,DocumentType.prototype].forEach(function(e){e.hasOwnProperty("after")||Object.defineProperty(e,"after",{configurable:!0,enumerable:!0,writable:!0,value:t})})}();


/***/ }),
/* 238 */
/***/ (function(module, exports) {

Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),window.Element&&!Element.prototype.closest&&(Element.prototype.closest=function(e){var t=this;do{if(t.matches(e))return t;t=t.parentElement||t.parentNode}while(null!==t&&1===t.nodeType);return null});


/***/ }),
/* 239 */
/***/ (function(module, exports) {

!function(){function t(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),n}"function"!=typeof window.CustomEvent&&(t.prototype=window.Event.prototype,window.CustomEvent=t)}();


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(241);

module.exports = parent;


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

var findIndex = __webpack_require__(242);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.findIndex;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.findIndex) ? findIndex : own;
};


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(243);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').findIndex;


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $findIndex = __webpack_require__(29).findIndex;
var addToUnscopables = __webpack_require__(64);
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
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(245);

module.exports = parent;


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

var some = __webpack_require__(246);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.some;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.some) ? some : own;
};


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(247);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').some;


/***/ }),
/* 247 */
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
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(249);

module.exports = parent;


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(250);
var path = __webpack_require__(10);

module.exports = path.Object.assign;


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var assign = __webpack_require__(251);

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
$({ target: 'Object', stat: true, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(16);
var fails = __webpack_require__(6);
var objectKeys = __webpack_require__(50);
var getOwnPropertySymbolsModule = __webpack_require__(116);
var propertyIsEnumerableModule = __webpack_require__(60);
var toObject = __webpack_require__(19);
var IndexedObject = __webpack_require__(58);

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
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(253);

module.exports = parent;


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(254);
var path = __webpack_require__(10);

module.exports = path.Object.keys;


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var toObject = __webpack_require__(19);
var nativeKeys = __webpack_require__(50);
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
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(256);

module.exports = parent;


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(89);
__webpack_require__(39);
__webpack_require__(36);
__webpack_require__(257);
__webpack_require__(260);
__webpack_require__(261);
var path = __webpack_require__(10);

module.exports = path.Promise;


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var IS_PURE = __webpack_require__(41);
var global = __webpack_require__(5);
var getBuiltIn = __webpack_require__(38);
var NativePromise = __webpack_require__(213);
var redefine = __webpack_require__(54);
var redefineAll = __webpack_require__(229);
var setToStringTag = __webpack_require__(33);
var setSpecies = __webpack_require__(230);
var isObject = __webpack_require__(13);
var aFunction = __webpack_require__(31);
var anInstance = __webpack_require__(214);
var classof = __webpack_require__(37);
var inspectSource = __webpack_require__(113);
var iterate = __webpack_require__(120);
var checkCorrectnessOfIteration = __webpack_require__(119);
var speciesConstructor = __webpack_require__(215);
var task = __webpack_require__(216).set;
var microtask = __webpack_require__(258);
var promiseResolve = __webpack_require__(218);
var hostReportErrors = __webpack_require__(259);
var newPromiseCapabilityModule = __webpack_require__(121);
var perform = __webpack_require__(219);
var InternalStateModule = __webpack_require__(48);
var isForced = __webpack_require__(114);
var wellKnownSymbol = __webpack_require__(3);
var V8_VERSION = __webpack_require__(83);

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
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var getOwnPropertyDescriptor = __webpack_require__(82).f;
var classof = __webpack_require__(37);
var macrotask = __webpack_require__(216).set;
var IS_IOS = __webpack_require__(217);

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
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var aFunction = __webpack_require__(31);
var newPromiseCapabilityModule = __webpack_require__(121);
var perform = __webpack_require__(219);
var iterate = __webpack_require__(120);

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
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var IS_PURE = __webpack_require__(41);
var NativePromise = __webpack_require__(213);
var fails = __webpack_require__(6);
var getBuiltIn = __webpack_require__(38);
var speciesConstructor = __webpack_require__(215);
var promiseResolve = __webpack_require__(218);
var redefine = __webpack_require__(54);

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
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(263);

module.exports = parent;


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

var arrayIncludes = __webpack_require__(264);
var stringIncludes = __webpack_require__(266);

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
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(265);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').includes;


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $includes = __webpack_require__(99).includes;
var addToUnscopables = __webpack_require__(64);
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
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(267);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('String').includes;


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var notARegExp = __webpack_require__(268);
var requireObjectCoercible = __webpack_require__(59);
var correctIsRegExpLogic = __webpack_require__(270);

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

var isRegExp = __webpack_require__(269);

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);
var classof = __webpack_require__(37);
var wellKnownSymbol = __webpack_require__(3);

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),
/* 270 */
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
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(272);

module.exports = parent;


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

var sort = __webpack_require__(273);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.sort;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.sort) ? sort : own;
};


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(274);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').sort;


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var aFunction = __webpack_require__(31);
var toObject = __webpack_require__(19);
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
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(276);

module.exports = parent;


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(277);

var FunctionPrototype = Function.prototype;

module.exports = function (it) {
  var own = it.bind;
  return it === FunctionPrototype || (it instanceof Function && own === FunctionPrototype.bind) ? bind : own;
};


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(278);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Function').bind;


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var bind = __webpack_require__(231);

// `Function.prototype.bind` method
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
$({ target: 'Function', proto: true }, {
  bind: bind
});


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
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
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

var _Symbol$iterator = __webpack_require__(314);

var _Symbol = __webpack_require__(91);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof _Symbol === "function" && typeof _Symbol$iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof _Symbol === "function" && obj.constructor === _Symbol && obj !== _Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),
/* 284 */,
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(311);

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var global = __webpack_require__(5);
var InternalMetadataModule = __webpack_require__(287);
var fails = __webpack_require__(6);
var createNonEnumerableProperty = __webpack_require__(17);
var iterate = __webpack_require__(120);
var anInstance = __webpack_require__(214);
var isObject = __webpack_require__(13);
var setToStringTag = __webpack_require__(33);
var defineProperty = __webpack_require__(23).f;
var forEach = __webpack_require__(29).forEach;
var DESCRIPTORS = __webpack_require__(16);
var InternalStateModule = __webpack_require__(48);

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var exported = {};
  var Constructor;

  if (!DESCRIPTORS || typeof NativeConstructor != 'function'
    || !(IS_WEAK || NativePrototype.forEach && !fails(function () { new NativeConstructor().entries().next(); }))
  ) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.REQUIRED = true;
  } else {
    Constructor = wrapper(function (target, iterable) {
      setInternalState(anInstance(target, Constructor, CONSTRUCTOR_NAME), {
        type: CONSTRUCTOR_NAME,
        collection: new NativeConstructor()
      });
      if (iterable != undefined) iterate(iterable, target[ADDER], target, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    forEach(['add', 'clear', 'delete', 'forEach', 'get', 'has', 'set', 'keys', 'values', 'entries'], function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in NativePrototype && !(IS_WEAK && KEY == 'clear')) {
        createNonEnumerableProperty(Constructor.prototype, KEY, function (a, b) {
          var collection = getInternalState(this).collection;
          if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
          var result = collection[KEY](a === 0 ? 0 : a, b);
          return IS_ADDER ? this : result;
        });
      }
    });

    IS_WEAK || defineProperty(Constructor.prototype, 'size', {
      configurable: true,
      get: function () {
        return getInternalState(this).collection.size;
      }
    });
  }

  setToStringTag(Constructor, CONSTRUCTOR_NAME, false, true);

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, forced: true }, exported);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

var hiddenKeys = __webpack_require__(49);
var isObject = __webpack_require__(13);
var has = __webpack_require__(15);
var defineProperty = __webpack_require__(23).f;
var uid = __webpack_require__(65);
var FREEZING = __webpack_require__(332);

var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineProperty = __webpack_require__(23).f;
var create = __webpack_require__(71);
var redefineAll = __webpack_require__(229);
var bind = __webpack_require__(47);
var anInstance = __webpack_require__(214);
var iterate = __webpack_require__(120);
var defineIterator = __webpack_require__(87);
var setSpecies = __webpack_require__(230);
var DESCRIPTORS = __webpack_require__(16);
var fastKey = __webpack_require__(287).fastKey;
var InternalStateModule = __webpack_require__(48);

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS) state.size = 0;
        else that.size = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS) state.size--;
          else that.size--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineProperty(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(CONSTRUCTOR_NAME);
  }
};


/***/ }),
/* 289 */,
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(322);

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(325);

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(333);

/***/ }),
/* 293 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return symbolObservablePonyfill; });
function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(336);

/***/ }),
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */
/***/ (function(module, exports) {

!function(){function t(){var e=Array.prototype.slice.call(arguments),n=document.createDocumentFragment();e.forEach(function(e){var t=e instanceof Node;n.appendChild(t?e:document.createTextNode(String(e)))}),this.insertBefore(n,this.firstChild)}[Element.prototype,Document.prototype,DocumentFragment.prototype].forEach(function(e){e.hasOwnProperty("prepend")||Object.defineProperty(e,"prepend",{configurable:!0,enumerable:!0,writable:!0,value:t})})}();


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(304);

module.exports = parent;


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(305);
var path = __webpack_require__(10);

module.exports = path.Reflect.construct;


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var getBuiltIn = __webpack_require__(38);
var aFunction = __webpack_require__(31);
var anObject = __webpack_require__(18);
var isObject = __webpack_require__(13);
var create = __webpack_require__(71);
var bind = __webpack_require__(231);
var fails = __webpack_require__(6);

var nativeConstruct = getBuiltIn('Reflect', 'construct');

// `Reflect.construct` method
// https://tc39.github.io/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});
var FORCED = NEW_TARGET_BUG || ARGS_BUG;

$({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(307);

/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(308);

module.exports = parent;


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(309);
var path = __webpack_require__(10);

var Object = path.Object;

module.exports = function create(P, D) {
  return Object.create(P, D);
};


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var DESCRIPTORS = __webpack_require__(16);
var create = __webpack_require__(71);

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  create: create
});


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

var _Object$setPrototypeOf = __webpack_require__(285);

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = _Object$setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(312);

module.exports = parent;


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(313);
var path = __webpack_require__(10);

module.exports = path.Object.setPrototypeOf;


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var setPrototypeOf = __webpack_require__(124);

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
$({ target: 'Object', stat: true }, {
  setPrototypeOf: setPrototypeOf
});


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(315);

/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(316);

module.exports = parent;


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(126);
__webpack_require__(39);
__webpack_require__(36);
var WrappedWellKnownSymbolModule = __webpack_require__(90);

module.exports = WrappedWellKnownSymbolModule.f('iterator');


/***/ }),
/* 317 */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(319);

/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(320);

module.exports = parent;


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(321);
var path = __webpack_require__(10);

module.exports = path.Object.getPrototypeOf;


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var fails = __webpack_require__(6);
var toObject = __webpack_require__(19);
var nativeGetPrototypeOf = __webpack_require__(88);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(123);

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});



/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(323);

module.exports = parent;


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(324);
var path = __webpack_require__(10);

var Object = path.Object;

module.exports = function getOwnPropertyNames(it) {
  return Object.getOwnPropertyNames(it);
};


/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(1);
var fails = __webpack_require__(6);
var nativeGetOwnPropertyNames = __webpack_require__(125).f;

var FAILS_ON_PRIMITIVES = fails(function () { return !Object.getOwnPropertyNames(1); });

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  getOwnPropertyNames: nativeGetOwnPropertyNames
});


/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(326);

module.exports = parent;


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

var indexOf = __webpack_require__(327);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.indexOf;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.indexOf) ? indexOf : own;
};


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(328);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').indexOf;


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var $indexOf = __webpack_require__(99).indexOf;
var arrayMethodIsStrict = __webpack_require__(62);
var arrayMethodUsesToLength = __webpack_require__(20);

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');
var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(330);

module.exports = parent;


/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(331);
__webpack_require__(89);
__webpack_require__(39);
__webpack_require__(36);
var path = __webpack_require__(10);

module.exports = path.Set;


/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var collection = __webpack_require__(286);
var collectionStrong = __webpack_require__(288);

// `Set` constructor
// https://tc39.github.io/ecma262/#sec-set-objects
module.exports = collection('Set', function (init) {
  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);


/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);

module.exports = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});


/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(334);

module.exports = parent;


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(335);
__webpack_require__(89);
__webpack_require__(39);
__webpack_require__(36);
var path = __webpack_require__(10);

module.exports = path.Map;


/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var collection = __webpack_require__(286);
var collectionStrong = __webpack_require__(288);

// `Map` constructor
// https://tc39.github.io/ecma262/#sec-map-objects
module.exports = collection('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);


/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(337);

module.exports = parent;


/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

var reverse = __webpack_require__(338);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.reverse;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.reverse) ? reverse : own;
};


/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(339);
var entryVirtual = __webpack_require__(14);

module.exports = entryVirtual('Array').reverse;


/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1);
var isArray = __webpack_require__(42);

var nativeReverse = [].reverse;
var test = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign
    if (isArray(this)) this.length = this.length;
    return nativeReverse.call(this);
  }
});


/***/ }),
/* 340 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/mdn-polyfills/Node.prototype.append.js
var Node_prototype_append = __webpack_require__(235);

// EXTERNAL MODULE: ./node_modules/mdn-polyfills/Node.prototype.remove.js
var Node_prototype_remove = __webpack_require__(236);

// EXTERNAL MODULE: ./node_modules/mdn-polyfills/Node.prototype.after.js
var Node_prototype_after = __webpack_require__(237);

// EXTERNAL MODULE: ./node_modules/mdn-polyfills/Node.prototype.prepend.js
var Node_prototype_prepend = __webpack_require__(302);

// EXTERNAL MODULE: ./node_modules/mdn-polyfills/Element.prototype.closest.js
var Element_prototype_closest = __webpack_require__(238);

// EXTERNAL MODULE: ./node_modules/mdn-polyfills/CustomEvent.js
var CustomEvent = __webpack_require__(239);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/object/assign.js
var object_assign = __webpack_require__(35);
var assign_default = /*#__PURE__*/__webpack_require__.n(object_assign);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/classCallCheck.js
var classCallCheck = __webpack_require__(7);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/createClass.js
var createClass = __webpack_require__(8);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass);

// CONCATENATED MODULE: ./src/js/market-mvp/utils/render.js
var RenderPosition = {
  AFTERBEGIN: "afterbegin",
  BEFOREEND: "beforeend"
};
var createElement = function createElement(template) {
  var newElement = document.createElement("div");
  newElement.innerHTML = template;
  return newElement.firstChild;
};
var render_render = function render(container, component, place) {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;

    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};
var replace = function replace(newComponent, oldComponent) {
  var parentElement = oldComponent.getElement().parentElement;
  var newElement = newComponent.getElement();
  var oldElement = oldComponent.getElement();
  var isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
var remove = function remove(component) {
  component.getElement().remove();
  component.removeElement();
};
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/reflect/construct.js
var construct = __webpack_require__(2);
var construct_default = /*#__PURE__*/__webpack_require__.n(construct);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/inherits.js
var inherits = __webpack_require__(21);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/possibleConstructorReturn.js
var possibleConstructorReturn = __webpack_require__(22);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/getPrototypeOf.js
var getPrototypeOf = __webpack_require__(12);
var getPrototypeOf_default = /*#__PURE__*/__webpack_require__.n(getPrototypeOf);

// CONCATENATED MODULE: ./src/js/market-mvp/utils/abstract-component.js



var HIDDEN_CLASS = "visually-hidden";

var abstract_component_AbstractComponent = /*#__PURE__*/function () {
  function AbstractComponent() {
    classCallCheck_default()(this, AbstractComponent);

    if ((this instanceof AbstractComponent ? this.constructor : void 0) === AbstractComponent) {
      throw new Error('Can`t instantiate AbstractComponent, only concrete one.');
    }

    this._element = null;
  }

  createClass_default()(AbstractComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      throw new Error("Abstract method not implemented: getTemplate");
    }
  }, {
    key: "getElement",
    value: function getElement() {
      if (!this._element) {
        this._element = createElement(this.getTemplate());
      }

      return this._element;
    }
  }, {
    key: "removeElement",
    value: function removeElement() {
      this._element = null;
    }
  }, {
    key: "show",
    value: function show() {
      if (this._element) {
        this._element.classList.remove(HIDDEN_CLASS);
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      if (this._element) {
        this._element.classList.add(HIDDEN_CLASS);
      }
    }
  }]);

  return AbstractComponent;
}();


// CONCATENATED MODULE: ./src/js/market-mvp/wrap-components/header.js







function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }


var headerTemplate = "<header class=\"market-header\"></header>";

var header_HeaderComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(HeaderComponent, _AbstractComponent);

  var _super = _createSuper(HeaderComponent);

  function HeaderComponent() {
    classCallCheck_default()(this, HeaderComponent);

    return _super.apply(this, arguments);
  }

  createClass_default()(HeaderComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return headerTemplate;
    }
  }]);

  return HeaderComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/wrap-components/main-content.js







function main_content_createSuper(Derived) { var hasNativeReflectConstruct = main_content_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function main_content_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }


var createMarketContentTemplate = "<section class=\"market-content\"></section>";

var main_content_MainContentComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(MainContentComponent, _AbstractComponent);

  var _super = main_content_createSuper(MainContentComponent);

  function MainContentComponent() {
    classCallCheck_default()(this, MainContentComponent);

    return _super.apply(this, arguments);
  }

  createClass_default()(MainContentComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return createMarketContentTemplate;
    }
  }]);

  return MainContentComponent;
}(abstract_component_AbstractComponent);


// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/for-each.js
var for_each = __webpack_require__(9);
var for_each_default = /*#__PURE__*/__webpack_require__.n(for_each);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reduce.js
var reduce = __webpack_require__(25);
var reduce_default = /*#__PURE__*/__webpack_require__.n(reduce);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/map.js
var instance_map = __webpack_require__(11);
var map_default = /*#__PURE__*/__webpack_require__.n(instance_map);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/bind.js
var bind = __webpack_require__(28);
var bind_default = /*#__PURE__*/__webpack_require__.n(bind);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/array/from.js
var from = __webpack_require__(66);
var from_default = /*#__PURE__*/__webpack_require__.n(from);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/promise.js
var promise = __webpack_require__(86);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/find-index.js
var find_index = __webpack_require__(85);
var find_index_default = /*#__PURE__*/__webpack_require__.n(find_index);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-names.js
var get_own_property_names = __webpack_require__(290);
var get_own_property_names_default = /*#__PURE__*/__webpack_require__.n(get_own_property_names);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/slicedToArray.js
var slicedToArray = __webpack_require__(43);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/object/entries.js
var entries = __webpack_require__(78);
var entries_default = /*#__PURE__*/__webpack_require__.n(entries);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/set-timeout.js
var set_timeout = __webpack_require__(79);
var set_timeout_default = /*#__PURE__*/__webpack_require__.n(set_timeout);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/some.js
var some = __webpack_require__(80);
var some_default = /*#__PURE__*/__webpack_require__.n(some);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/concat.js
var concat = __webpack_require__(0);
var concat_default = /*#__PURE__*/__webpack_require__.n(concat);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(34);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/find.js
var instance_find = __webpack_require__(32);
var find_default = /*#__PURE__*/__webpack_require__.n(instance_find);

// CONCATENATED MODULE: ./src/js/market-mvp/utils/utils.js













var newProductCart = function newProductCart(product, productPrice, optionName, optionValue) {
  // Объект c инфой о выбранном товаре
  var newProductCart = {
    name: product.name,
    img: product.img,
    price: productPrice,
    id: product.id,
    option: optionName ? {
      optionName: optionName,
      optionValue: optionValue
    } : undefined,
    quantity: 1
  };
  return newProductCart;
};
var utils_newProductCartArr = function newProductCartArr(productArr, newProduct, quantityUp) {
  if (quantityUp === void 0) {
    quantityUp = true;
  }

  // Проверяем существует ли товар {newProductCart} в корзине [cart]
  var existingProduct = find_default()(productArr).call(productArr, function (item) {
    return item.option ? item.name === newProduct.name && item.id === newProduct.id && item.option.optionValue === newProduct.option.optionValue : item.name === newProduct.name && item.id === newProduct.id;
  }); // Если товар {newProduct} существует, то увеличиваем количество quantity этого объекта


  if (existingProduct) {
    quantityUp ? existingProduct.quantity++ : existingProduct.quantity--; // Если не присвоить копию оригиналу, то не сработает слушатель изменения корзины

    productArr = toConsumableArray_default()(productArr);
  } // Иначе присоединяем этот объект к [productArr]
  else {
      productArr = concat_default()(productArr).call(productArr, newProduct);
    }

  return productArr;
}; // Проверка по имени есть ли товар в корзине

var utils_isItProductInCart = function isItProductInCart(cart, productName) {
  return some_default()(cart).call(cart, function (product) {
    return product.name === productName;
  });
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
}; // Имя первой активной опции

var utils_firstActiveOptionName = function firstActiveOptionName(options) {
  var findingActiveObject = find_default()(options).call(options, function (option) {
    var _context;

    return map_default()(_context = entries_default()(option)).call(_context, function (_ref) {
      var _ref2 = slicedToArray_default()(_ref, 2),
          value = _ref2[1];

      return value;
    })[0];
  });

  return get_own_property_names_default()(findingActiveObject)[0];
}; // Индекс первой активной опции товара

var utils_firstActiveOptionIndex = function firstActiveOptionIndex(product) {
  var _context2;

  return find_index_default()(_context2 = product.options.optionList).call(_context2, function (option) {
    var _context3;

    return map_default()(_context3 = entries_default()(option)).call(_context3, function (_ref3) {
      var _ref4 = slicedToArray_default()(_ref3, 2),
          value = _ref4[1];

      return value;
    })[0];
  });
}; // Выбираем цену первой активной опции

var utils_createPrice = function createPrice(product) {
  var _context4;

  return "options" in product && product.options ? map_default()(_context4 = product.options.optionList).call(_context4, function (item, index) {
    if (utils_firstActiveOptionIndex(product) === index) {
      return item.price.toLocaleString("ru-RU");
    }
  }).join("") : product.price.toLocaleString("ru-RU");
}; // Проверка, отобразился ли элемент на странице

var utils_elementReady = function elementReady(parent, selector) {
  return new promise_default.a(function (resolve) {
    var el = parent.querySelector(selector);

    if (el) {
      resolve(el);
    }

    new MutationObserver(function (mutationRecords, observer) {
      var _context5;

      // Query for elements matching the specified selector
      for_each_default()(_context5 = from_default()(parent.querySelectorAll(selector))).call(_context5, function (element) {
        resolve(element); //Once we have resolved we don`t need the observer anymore.

        observer.disconnect();
      });
    }).observe(parent.documentElement, {
      childList: true,
      subtree: true
    });
  });
};

var distanceBetweenElements = function distanceBetweenElements(elementOne, elementTwo) {
  var x1 = elementOne.getBoundingClientRect().top;
  var x2 = elementTwo.getBoundingClientRect().top;
  var y1 = elementOne.getBoundingClientRect().left;
  var y2 = elementTwo.getBoundingClientRect().left;
  var xToX = Math.floor(x2 - x1);
  var yToY = Math.floor(y1 - y2);
  return {
    xToX: xToX,
    yToY: yToY
  };
};

var animate = function animate(_ref5) {
  var timing = _ref5.timing,
      draw = _ref5.draw,
      duration = _ref5.duration;
  var start = performance.now();
  requestAnimationFrame(function animate(time) {
    // timeFraction изменяется от 0 до 1
    var timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1; // вычисление текущего состояния анимации

    var progress = timing(timeFraction);
    draw(progress); // отрисовать её

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
};

var animationForAddProductToCart = function animationForAddProductToCart(parentElement) {
  var cart = document.querySelector('.market-cart-link__icon-wrap');
  var productPic = parentElement.querySelector("img");
  var cloneProductPic = productPic.cloneNode(true);
  cloneProductPic.classList.add("market-product__animate");
  var spaceBetween = distanceBetweenElements(cart, productPic);
  var entryTop = spaceBetween.xToX;
  var entryLeft = productPic.getBoundingClientRect().left - productPic.offsetWidth;
  cloneProductPic.style.top = entryTop + 'px';
  cloneProductPic.style.left = entryLeft + 'px';
  var marketWrap = parentElement.closest('.market');
  marketWrap.append(cloneProductPic);
  animate({
    duration: 1000,
    timing: function timing(timeFraction) {
      return timeFraction * (2 - timeFraction);
    },
    draw: function draw(progress) {
      var roundedToHundredth = function roundedToHundredth(number) {
        return +number.toFixed(3);
      };

      cloneProductPic.style.top = entryTop + roundedToHundredth(progress) * -spaceBetween.xToX + cart.offsetHeight / 2 + 'px';
      cloneProductPic.style.left = entryLeft + roundedToHundredth(progress) * spaceBetween.yToY + cart.offsetWidth + 'px';
    }
  }); // setTimeout(() => cloneProductPic.remove(), 1000)
};
// EXTERNAL MODULE: ./src/js/market-mvp/utils/carousel&scrollbar.js
var carousel_scrollbar = __webpack_require__(234);

// CONCATENATED MODULE: ./src/js/market-mvp/menu/components/menu.js







function menu_createSuper(Derived) { var hasNativeReflectConstruct = menu_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function menu_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }


var menuTemplate = "<ul class=\"market-header__nav\"></ul>";

var menu_MenuComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(MenuComponent, _AbstractComponent);

  var _super = menu_createSuper(MenuComponent);

  function MenuComponent() {
    classCallCheck_default()(this, MenuComponent);

    return _super.apply(this, arguments);
  }

  createClass_default()(MenuComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return menuTemplate;
    }
  }]);

  return MenuComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/menu/components/menu-item.js








function menu_item_createSuper(Derived) { var hasNativeReflectConstruct = menu_item_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function menu_item_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }



var menu_item_createMenuItemTemplate = function createMenuItemTemplate(item) {
  var _context;

  return concat_default()(_context = "<li id=\"menu-".concat(item.id, "\" class=\"market-header__nav-item\">")).call(_context, item.name, "</li>");
};

var menu_item_MenuComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(MenuComponent, _AbstractComponent);

  var _super = menu_item_createSuper(MenuComponent);

  function MenuComponent(items) {
    var _this;

    classCallCheck_default()(this, MenuComponent);

    _this = _super.call(this);
    _this._items = items;
    return _this;
  }

  createClass_default()(MenuComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return menu_item_createMenuItemTemplate(this._items);
    }
  }, {
    key: "setOpenButtonClickHandler",
    value: function setOpenButtonClickHandler(handler) {
      this.getElement().addEventListener("click", handler);
    }
  }]);

  return MenuComponent;
}(abstract_component_AbstractComponent);


// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js/get-iterator.js
var get_iterator = __webpack_require__(76);
var get_iterator_default = /*#__PURE__*/__webpack_require__.n(get_iterator);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js/get-iterator-method.js
var get_iterator_method = __webpack_require__(111);
var get_iterator_method_default = /*#__PURE__*/__webpack_require__.n(get_iterator_method);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/symbol.js
var symbol = __webpack_require__(112);
var symbol_default = /*#__PURE__*/__webpack_require__.n(symbol);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/index-of.js
var index_of = __webpack_require__(291);
var index_of_default = /*#__PURE__*/__webpack_require__.n(index_of);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/typeof.js
var helpers_typeof = __webpack_require__(283);
var typeof_default = /*#__PURE__*/__webpack_require__.n(helpers_typeof);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/filter.js
var filter = __webpack_require__(30);
var filter_default = /*#__PURE__*/__webpack_require__.n(filter);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/set.js
var set = __webpack_require__(127);
var set_default = /*#__PURE__*/__webpack_require__.n(set);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/splice.js
var splice = __webpack_require__(77);
var splice_default = /*#__PURE__*/__webpack_require__.n(splice);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/slice.js
var slice = __webpack_require__(67);
var slice_default = /*#__PURE__*/__webpack_require__.n(slice);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/helpers/defineProperty.js
var defineProperty = __webpack_require__(68);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/includes.js
var includes = __webpack_require__(56);
var includes_default = /*#__PURE__*/__webpack_require__.n(includes);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/array/is-array.js
var is_array = __webpack_require__(40);
var is_array_default = /*#__PURE__*/__webpack_require__.n(is_array);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/map.js
var core_js_stable_map = __webpack_require__(292);
var core_js_stable_map_default = /*#__PURE__*/__webpack_require__.n(core_js_stable_map);

// EXTERNAL MODULE: ./node_modules/symbol-observable/es/index.js
var es = __webpack_require__(228);

// CONCATENATED MODULE: ./node_modules/effector/effector.es.js























function _createForOfIteratorHelper(o) { if (typeof symbol_default.a === "undefined" || get_iterator_method_default()(o) == null) { if (is_array_default()(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e17) { throw _e17; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = get_iterator_default()(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e18) { didErr = true; err = _e18; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { var _context10; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = slice_default()(_context10 = Object.prototype.toString.call(o)).call(_context10, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return from_default()(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function effector_es_e(e, t) {
  if (t === void 0) {
    t = "combine";
  }

  var r = t + '(',
      a = '',
      n = 0;

  for (var _t in e) {
    var _o = e[_t];
    if (null != _o && (r += a, r += w(_o) ? _o.compositeName.fullName : _o.toString()), n += 1, 25 === n) break;
    a = ', ';
  }

  return r += ')', r;
}

function effector_es_t(e, t) {
  var a = effector_es_r(t, H(e));
  if (e.shortName = t, !e.compositeName) return void (e.compositeName = a);
  var n = e.compositeName;
  n.path = a.path, n.shortName = a.shortName, n.fullName = a.fullName;
}

function effector_es_r(e, t) {
  var _context;

  var r,
      a,
      n,
      o = e;
  return t ? (n = t.compositeName, 0 === e.length ? (r = n.path, a = n.fullName) : (r = concat_default()(_context = n.path).call(_context, [e]), a = 0 === n.fullName.length ? e : n.fullName + '/' + e)) : (r = 0 === e.length ? [] : [e], a = e), {
    shortName: o,
    fullName: a,
    path: r
  };
}

function effector_es_a(_ref) {
  var _ref$node = _ref.node,
      e = _ref$node === void 0 ? [] : _ref$node,
      t = _ref.from,
      r = _ref.source,
      _ref$parent = _ref.parent,
      a = _ref$parent === void 0 ? t || r : _ref$parent,
      n = _ref.to,
      o = _ref.target,
      _ref$child = _ref.child,
      l = _ref$child === void 0 ? n || o : _ref$child,
      _ref$scope = _ref.scope,
      s = _ref$scope === void 0 ? {} : _ref$scope,
      _ref$meta = _ref.meta,
      i = _ref$meta === void 0 ? {} : _ref$meta,
      _ref$family = _ref.family,
      f = _ref$family === void 0 ? {
    type: 'regular'
  } : _ref$family;
  var c = effector_es_ce(a),
      p = effector_es_ce(f.links),
      u = effector_es_ce(f.owners),
      m = [],
      d = {};

  for (var _t2 = 0; _t2 < e.length; _t2++) {
    var _r = e[_t2];
    _r && (m.push(_r), pe(_r, d));
  }

  var h = {
    seq: m,
    next: effector_es_ce(l),
    meta: i,
    scope: s,
    family: {
      type: f.type || 'crosslink',
      links: p,
      owners: u
    },
    reg: d
  };

  for (var _e2 = 0; _e2 < p.length; _e2++) {
    T(p[_e2]).push(h);
  }

  for (var _e3 = 0; _e3 < u.length; _e3++) {
    P(u[_e3]).push(h);
  }

  for (var _e4 = 0; _e4 < c.length; _e4++) {
    c[_e4].next.push(h);
  }

  return h;
}

function effector_es_n(e, t) {
  Te = {
    parent: Te,
    value: e,
    template: z(e).meta.template || Te && Te.template
  };

  try {
    return t();
  } finally {
    Te = H(Te);
  }
}

function effector_es_o(e, t) {
  var r = function r(e) {
    for (var _len = arguments.length, t = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      t[_key - 1] = arguments[_key];
    }

    return r.create(e, t, t);
  };

  r.graphite = effector_es_a({
    meta: Ke('event', r, t, e)
  }), r.create = function (e) {
    return effector_es_Ne(r, e), e;
  }, r.watch = effector_es_Q(Re, r), r.map = function (e) {
    var t, a;
    effector_es_D(e) && (t = e, a = e.name, e = e.fn);
    var n = effector_es_o(B(r, a), t);
    return Ge(r, n, 'map', e), n;
  }, r.filter = function (e) {
    return E(e) ? (console.error('.filter(fn) is deprecated, use .filterMap instead'), effector_es_l(r, e)) : Je(r, 'filter', e.fn, [ee({
      fn: ie
    })]);
  }, r.filterMap = effector_es_Q(effector_es_l, r), r.prepend = function (e) {
    var t = effector_es_o('* → ' + r.shortName, {
      parent: H(r)
    }),
        a = Pe();
    return a && z(t).seq.push(a.upward), Ge(t, r, 'prepend', e), He(r, t), t;
  }, effector_es_Le(r, r);
  var n = Pe();
  return n && (z(r).meta.nativeTemplate = n), ze(r);
}

function effector_es_l(e, t) {
  return Je(e, 'filterMap', t, [$({
    fn: ie
  }), Z.defined()]);
}

function effector_es_s(e, t) {
  function r(e, t) {
    f.off(e), effector_es_F(f).set(e, je(effector_es_Qe(e, f, 'on', 1, t)));
  }

  var n = ne(e),
      o = ne(e),
      l = Be('updates'),
      i = Pe();
  n.after = [{
    type: 'copy',
    to: o
  }], i && i.plain.push(n);

  var f = defineProperty_default()({
    subscribers: new core_js_stable_map_default.a(),
    updates: l,
    defaultState: e,
    stateRef: n,
    getState: function getState() {
      var e = qe();
      return oe(e && e.reg[n.id] ? e.reg[n.id] : n);
    },
    setState: function setState(e) {
      effector_es_Ne({
        target: f,
        params: e,
        defer: 1
      });
    },
    reset: function reset() {
      for (var _len2 = arguments.length, e = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        e[_key2] = arguments[_key2];
      }

      for (var _i = 0, _e5 = e; _i < _e5.length; _i++) {
        var _t3 = _e5[_i];
        f.on(_t3, function () {
          return f.defaultState;
        });
      }

      return f;
    },
    on: function on(e, t) {
      if (is_array_default()(e)) {
        var _iterator = _createForOfIteratorHelper(e),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _a = _step.value;
            r(_a, t);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else r(e, t);

      return f;
    },
    off: function off(e) {
      var t = effector_es_F(f).get(e);
      return t && (t(), effector_es_F(f).delete(e)), f;
    },
    map: function map(e, t) {
      var _context2, _context3;

      var r, a, o;
      effector_es_D(e) && (r = e, a = e.name, t = e.firstState, e = e.fn);
      var l = f.getState(),
          i = Pe();
      i ? o = null : void 0 !== l && (o = e(l, t));
      var c = effector_es_s(o, {
        name: B(f, a),
        config: r,
        strict: 0
      }),
          p = effector_es_Qe(f, c, 'map', 0, e);
      return M(c).before = [{
        type: 'map',
        fn: e,
        from: n
      }], i && (includes_default()(_context2 = i.plain).call(_context2, n) || includes_default()(_context3 = p.seq).call(_context3, i.loader) || p.seq.unshift(i.loader)), c;
    }
  }, es["a" /* default */], function () {
    return effector_es_Le(f, {});
  });

  return f.graphite = effector_es_a({
    scope: {
      state: n
    },
    node: [Z.defined(), re({
      store: n
    }), Z.changed({
      store: o
    }), re({
      store: o
    })],
    child: l,
    meta: Ke('store', f, t)
  }), Fe && void 0 === e && A("current state can't be undefined, use null instead"), i && (z(f).meta.nativeTemplate = i), f.watch = f.subscribe = function (e, t) {
    if (!t || !w(e)) {
      E(e) || A('watch requires function handler');

      var _t4 = Pe();

      return _t4 ? _t4.watch.push({
        of: n,
        fn: e
      }) : e(f.getState()), Re(f, e);
    }

    return E(t) || A('second argument should be a function'), e.watch(function (e) {
      return t(f.getState(), e);
    });
  }, fe(f, [l]), ze(f);
}

function effector_es_i() {
  for (var _len3 = arguments.length, e = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    e[_key3] = arguments[_key3];
  }

  var t, r, a;
  0 === e.length && A('at least one argument required'), R(e[0]) && (a = O(e[0]), e = R(e[0]));
  var n,
      o,
      l = e[e.length - 1];

  if (E(l) ? (r = slice_default()(e).call(e, 0, -1), t = l) : r = e, 1 === r.length) {
    var _e6 = r[0];
    q(_e6) || (n = _e6, o = 1);
  }

  return o || (n = r, t && (t = effector_es_Ve(t))), effector_es_We(is_array_default()(n), n, a, t);
}

function effector_es_f(e, t) {
  var r = effector_es_o(e, t),
      n = r.defaultConfig.handler || function () {
    return console.error("no handler used in " + r.getType()), promise_default.a.resolve();
  };

  z(r).meta.onCopy = ['runner'], z(r).meta.unit = r.kind = 'effect', r.use = function (e) {
    return n = e, r;
  };

  var i = r.finally = Be('finally'),
      f = r.done = effector_es_l(i, {
    named: 'done',
    fn: function fn(_ref2) {
      var e = _ref2.status,
          t = _ref2.params,
          r = _ref2.result;
      if ('done' === e) return {
        params: t,
        result: r
      };
    }
  }),
      c = r.fail = effector_es_l(i, {
    named: 'fail',
    fn: function fn(_ref3) {
      var e = _ref3.status,
          t = _ref3.params,
          r = _ref3.error;
      if ('fail' === e) return {
        params: t,
        error: r
      };
    }
  }),
      p = r.doneData = map_default()(f).call(f, {
    named: 'doneData',
    fn: function fn(_ref4) {
      var e = _ref4.result;
      return e;
    }
  }),
      u = r.failData = map_default()(c).call(c, {
    named: 'failData',
    fn: function fn(_ref5) {
      var e = _ref5.error;
      return e;
    }
  }),
      m = effector_es_a({
    scope: {
      getHandler: r.use.getCurrent = function () {
        return n;
      },
      finally: i
    },
    node: [te({
      fn: function fn(_ref6, _ref7, _ref8) {
        var e = _ref6.params,
            t = _ref6.req;
        var r = _ref7.finally,
            a = _ref7.getHandler;
        var n = _ref8.page;
        var o,
            l = Xe({
          params: e,
          req: t,
          ok: 1,
          anyway: r,
          page: n
        }),
            s = Xe({
          params: e,
          req: t,
          ok: 0,
          anyway: r,
          page: n
        });

        try {
          o = a()(e);
        } catch (e) {
          return void s(e);
        }

        effector_es_D(o) && E(o.then) ? o.then(l, s) : l(o);
      }
    })],
    meta: {
      op: 'fx',
      fx: 'runner',
      onCopy: ['finally']
    }
  });

  z(r).scope.runner = m, z(r).seq.push($({
    fn: function fn(e, t, r) {
      return H(r) ? {
        params: e,
        req: {
          rs: function rs(e) {},
          rj: function rj(e) {}
        }
      } : e;
    }
  }), te({
    fn: function fn(e, _ref9) {
      var t = _ref9.runner;
      return effector_es_Ne({
        target: t,
        params: e,
        defer: 1
      }), e.params;
    }
  })), r.create = function (e) {
    var t = function () {
      var e = {};
      return e.req = new promise_default.a(function (t, r) {
        e.rs = t, e.rj = r;
      }), e.req.catch(function () {}), e;
    }();

    return effector_es_Ne(r, {
      params: e,
      req: t
    }), t.req;
  };

  var d = r.inFlight = effector_es_s(0, {
    named: 'inFlight'
  }).on(r, function (e) {
    return e + 1;
  }).on(i, function (e) {
    return e - 1;
  }),
      h = r.pending = map_default()(d).call(d, {
    fn: function fn(e) {
      return e > 0;
    },
    named: 'pending'
  });

  return fe(r, [i, f, c, p, u, h, d, m]), r;
}

function effector_es_c(_ref10) {
  var _context4, _spliceInstanceProper, _context5;

  var e = _ref10.source,
      t = _ref10.effect,
      r = _ref10.mapParams;

  var a,
      n = effector_es_f(),
      o = z(n).scope.runner,
      l = function l(_ref11, _ref12, _ref13) {
    var e = _ref11.params,
        t = _ref11.req;
    var a = _ref12.finally,
        n = _ref12.effect;
    var o = _ref13.a,
        l = _ref13.page;
    return effector_es_Ne({
      target: n,
      params: {
        params: r(e, o),
        req: {
          rs: Xe({
            params: e,
            req: t,
            ok: 1,
            anyway: a,
            page: l
          }),
          rj: Xe({
            params: e,
            req: t,
            ok: 0,
            anyway: a,
            page: l
          })
        }
      },
      page: l,
      defer: 1
    });
  };

  if (e) {
    var _t5;

    q(e) ? _t5 = e : (_t5 = effector_es_i(e), fe(n, [_t5]));

    var _r2 = Y({
      from: 'store',
      store: M(_t5),
      to: 'a'
    });

    a = [te({
      fn: function fn(e) {
        return e;
      }
    }), _r2, $({
      fn: l
    })], pe(_r2, o.reg);
  } else a = [te({
    fn: l
  })];

  return o.scope.effect = t, o.meta.onCopy.push('effect'), (_spliceInstanceProper = splice_default()(_context4 = o.seq)).call.apply(_spliceInstanceProper, concat_default()(_context5 = [_context4, 0, 1]).call(_context5, toConsumableArray_default()(a))), He(t, n), n;
}

function effector_es_p(e, t) {
  var r = {};
  return Ue(t, function (t, a) {
    var n = r[a] = effector_es_o(a, {
      parent: H(e)
    });
    e.on(n, t), He(e, n);
  }), r;
}

function effector_es_u(e, t) {
  var _context6;

  var r = new set_default.a(),
      n = new set_default.a(),
      l = new set_default.a(),
      i = new set_default.a(),
      c = effector_es_a({
    family: {
      type: 'domain'
    }
  }),
      p = {
    history: {
      domains: r,
      stores: n,
      effects: l,
      events: i
    },
    graphite: c
  };
  c.meta = Ke('domain', p, t, e);

  var _map = map_default()(_context6 = ['onEvent', 'onEffect', 'onStore', 'onDomain']).call(_context6, Be),
      _map2 = slicedToArray_default()(_map, 4),
      m = _map2[0],
      d = _map2[1],
      h = _map2[2],
      g = _map2[3];

  p.hooks = {
    event: m,
    effect: d,
    store: h,
    domain: g
  }, p.onCreateEvent = effector_es_Ze(m, i, p), p.onCreateEffect = effector_es_Ze(d, l, p), p.onCreateStore = effector_es_Ze(h, n, p), p.onCreateDomain = effector_es_Ze(g, r, p), p.createEvent = p.event = function (e, t) {
    return m(effector_es_o(e, {
      parent: p,
      config: t
    }));
  }, p.createEffect = p.effect = function (e, t) {
    return d(effector_es_f(e, {
      parent: p,
      config: t
    }));
  }, p.createDomain = p.domain = function (e, t) {
    return effector_es_u({
      name: e,
      parent: p,
      config: t
    });
  }, p.createStore = p.store = function (e, t) {
    return h(effector_es_s(e, {
      parent: p,
      config: t
    }));
  }, ze(p);
  var y = H(p);
  return y && (Ue(p.hooks, function (e, t) {
    Oe({
      from: e,
      to: y.hooks[t]
    });
  }), y.hooks.domain(p)), p;
}

function effector_es_m(e) {
  j(e);
  var t = es["a" /* default */] in e ? e[es["a" /* default */]]() : e;
  t.subscribe || A('expect observable to have .subscribe');
  var r = effector_es_o(),
      a = effector_es_U(Ee, r, void 0);
  return t.subscribe({
    next: r,
    error: a,
    complete: a
  }), r;
}

function effector_es_d() {
  for (var _len4 = arguments.length, e = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    e[_key4] = arguments[_key4];
  }

  var t, r, n;
  R(e[0]) && (n = O(e[0]), e = R(e[0]));

  var _e7 = e,
      _e8 = slicedToArray_default()(_e7, 4),
      l = _e8[0],
      i = _e8[1],
      f = _e8[2],
      _e8$ = _e8[3],
      c = _e8$ === void 0 ? 0 : _e8$;

  void 0 === i && 'source' in l && ('clock' in l && null == l.clock && A('config.clock should be defined'), i = l.clock, f = l.fn, c = l.greedy, t = l.target, r = l.name, l = l.source), void 0 === i && (i = l), r = n || r || l.shortName, l = $e(l), i = $e(i), 'boolean' == typeof f && (c = f, f = null);
  var p = Pe(),
      u = !!t;
  t || (q(l) && q(i) ? t = effector_es_s(f ? f(oe(M(l)), oe(M(i))) : oe(M(l)), {
    name: r
  }) : (t = effector_es_o(r), p && z(t).seq.push(p.loader)));
  var m = u && w(t) && z(t).meta.nativeTemplate;
  if (q(l)) fe(l, [Me(i, t, {
    scope: {
      fn: f,
      targetTemplate: m
    },
    node: [p && p.loader, !c && X({
      priority: 'sampler'
    }), Y({
      store: M(l),
      to: f ? 'a' : 'stack'
    }), f && $({
      fn: se
    }), p && u && p.upward],
    meta: {
      op: 'sample',
      sample: 'store'
    }
  })]);else {
    var _e9 = ne(0),
        _r3 = ne(),
        _n = ne();

    p && p.plain.push(_e9, _r3, _n), ze(effector_es_a({
      parent: l,
      node: [re({
        store: _r3
      }), Y({
        from: 'value',
        store: 1,
        target: _e9
      })],
      family: {
        owners: [l, t, i],
        links: t
      },
      meta: {
        op: 'sample',
        sample: 'source'
      }
    })), fe(l, [Me(i, t, {
      scope: {
        fn: f,
        targetTemplate: m
      },
      node: [p && p.loader, re({
        store: _n
      }), Y({
        store: _e9
      }), ee({
        fn: function fn(e) {
          return e;
        }
      }), !c && X({
        priority: 'sampler'
      }), Y({
        store: _r3
      }), Y({
        store: _n,
        to: 'a'
      }), f && $({
        fn: le
      }), p && u && p.upward],
      meta: {
        op: 'sample',
        sample: 'clock'
      }
    })]);
  }
  return t;
}

function effector_es_h(e, t) {
  var _R, _R2;

  var r = {
    op: 'guard'
  };
  R(e) && (r.config = O(e), (_R = R(e), _R2 = slicedToArray_default()(_R, 2), e = _R2[0], t = _R2[1], _R)), t || (e = (t = e).source);

  var _t6 = t,
      n = filter_default()(_t6),
      l = _t6.greedy,
      _t6$name = _t6.name,
      s = _t6$name === void 0 ? "guard" : _t6$name,
      f = t.target || effector_es_o(s);

  return w(e) || (e = effector_es_i(e)), w(n) ? effector_es_d({
    source: n,
    clock: e,
    target: ze(effector_es_a({
      node: [ee({
        fn: function fn(_ref14) {
          var e = _ref14.guard;
          return e;
        }
      }), $({
        fn: function fn(_ref15) {
          var e = _ref15.data;
          return e;
        }
      })],
      child: f,
      meta: r,
      family: {
        owners: [e, n, f],
        links: f
      }
    })),
    fn: function fn(e, t) {
      return {
        guard: e,
        data: t
      };
    },
    greedy: l,
    name: s
  }) : (E(n) || A('`filter` should be function or unit'), Me(e, f, {
    scope: {
      fn: n
    },
    node: [ee({
      fn: ie
    })],
    meta: r
  })), f;
}

function effector_es_g(t) {
  var r = effector_es_o(effector_es_e(t, 'merge'));
  return Oe({
    from: t,
    to: r,
    meta: {
      op: 'merge'
    }
  }), r;
}

function effector_es_y(e, t, r) {
  if (q(e)) return e;

  if (w(e)) {
    var _a2,
        _n2 = H(e);

    return N(e) && (_a2 = effector_es_s(t, {
      parent: _n2,
      name: e.shortName,
      "ɔ": r
    }).on(e, function (e, t) {
      return t;
    })), x(e) && (_a2 = effector_es_s(t, {
      parent: _n2,
      name: e.shortName,
      "ɔ": r
    }).on(e.done, function (e, _ref16) {
      var t = _ref16.result;
      return t;
    })), _n2 && _n2.hooks.store(_a2), _a2;
  }

  var a = {};
  return Ue(e, function (e, t) {
    a[t] = q(e) ? e : effector_es_s(e, {
      name: t
    });
  }), a;
}

function b(e, t) {
  var r = {},
      a = q(e) ? e.updates : e;
  return Ue(t, function (e, t) {
    r[t] = filter_default()(a).call(a, {
      fn: e
    }), a = filter_default()(a).call(a, {
      fn: function fn(t) {
        return !e(t);
      }
    });
  }), r.__ = a, r;
}


var v = {
  __proto__: null,
  store: "store",
  event: "event",
  effect: "effect",
  domain: "domain"
};

var w = function w(e) {
  return (E(e) || effector_es_D(e)) && 'kind' in e;
};

var S = function S(e) {
  return function (t) {
    return w(t) && t.kind === e;
  };
};

var q = S("store"),
    N = S("event"),
    x = S("effect"),
    effector_es_ = S("domain");

var C = {
  __proto__: null,
  unit: w,
  store: q,
  event: N,
  effect: x,
  domain: effector_es_
};

var A = function A(e) {
  throw Error(e);
},
    effector_es_D = function D(e) {
  return 'object' == typeof_default()(e) && null !== e;
},
    E = function E(e) {
  return 'function' == typeof e;
},
    j = function j(e) {
  effector_es_D(e) || E(e) || A('expect value to be an object');
},
    z = function z(e) {
  return e.graphite || e;
},
    T = function T(e) {
  return e.family.owners;
},
    P = function P(e) {
  return e.family.links;
},
    M = function M(e) {
  return e.stateRef;
},
    O = function O(e) {
  return e.config;
},
    R = function R(e) {
  return e.ɔ;
},
    I = function I(e) {
  return e.value;
},
    effector_es_F = function F(e) {
  return e.subscribers;
},
    H = function H(e) {
  return e.parent;
},
    K = function K(e, t) {
  return '' + e.shortName + t;
},
    B = function B(e, t) {
  return null == t ? K(e, ' → *') : t;
};

var G = function G() {
  var e = 0;
  return function () {
    return (++e).toString(36);
  };
};

var J = G(),
    L = G(),
    effector_es_Q = function Q(e, t) {
  return bind_default()(e).call(e, null, t);
},
    effector_es_U = function U(e, t, r) {
  return bind_default()(e).call(e, null, t, r);
};

var V = function V(e, t, r) {
  return {
    id: L(),
    type: e,
    data: r,
    hasRef: t
  };
};

var W = 0,
    X = function X(_ref17) {
  var _ref17$priority = _ref17.priority,
      e = _ref17$priority === void 0 ? "barrier" : _ref17$priority;
  return V('barrier', 0, {
    barrierID: ++W,
    priority: e
  });
},
    Y = function Y(_ref18) {
  var _ref18$from = _ref18.from,
      e = _ref18$from === void 0 ? "store" : _ref18$from,
      t = _ref18.store,
      r = _ref18.target,
      _ref18$to = _ref18.to,
      a = _ref18$to === void 0 ? r ? 'store' : 'stack' : _ref18$to;
  return V('mov', 'store' === e, {
    from: e,
    store: t,
    to: a,
    target: r
  });
},
    Z = {
  defined: function defined() {
    return V('check', 0, {
      type: 'defined'
    });
  },
  changed: function changed(_ref19) {
    var e = _ref19.store;
    return V('check', 1, {
      type: 'changed',
      store: e
    });
  }
},
    $ = effector_es_U(V, 'compute', 0),
    ee = effector_es_U(V, 'filter', 0),
    te = effector_es_U(V, 'run', 0),
    re = function re(_ref20) {
  var e = _ref20.store;
  return Y({
    from: 'stack',
    target: e
  });
};

var ae = {
  __proto__: null,
  barrier: X,
  mov: Y,
  check: Z,
  compute: $,
  filter: ee,
  run: te,
  update: re
};

var ne = function ne(e) {
  return {
    id: L(),
    current: e
  };
},
    oe = function oe(_ref21) {
  var e = _ref21.current;
  return e;
},
    le = function le(e, _ref22, _ref23) {
  var t = _ref22.fn;
  var r = _ref23.a;
  return t(e, r);
},
    se = function se(e, _ref24, _ref25) {
  var t = _ref24.fn;
  var r = _ref25.a;
  return t(r, e);
},
    ie = function ie(e, _ref26) {
  var t = _ref26.fn;
  return t(e);
},
    fe = function fe(e, t) {
  var r = z(e);

  for (var _e10 = 0; _e10 < t.length; _e10++) {
    var _a3 = z(t[_e10]);

    'domain' !== r.family.type && (_a3.family.type = 'crosslink'), T(_a3).push(r), P(r).push(_a3);
  }
};

var effector_es_ce = function ce(e) {
  if (e === void 0) {
    e = [];
  }

  var t = [];
  if (is_array_default()(e)) for (var _r4 = 0; _r4 < e.length; _r4++) {
    is_array_default()(e[_r4]) ? t.push.apply(t, toConsumableArray_default()(e[_r4])) : t.push(e[_r4]);
  } else t.push(e);
  return map_default()(t).call(t, z);
};

var pe = function pe(_ref27, a) {
  var e = _ref27.hasRef,
      t = _ref27.type,
      r = _ref27.data;
  var n;
  e && (n = r.store, a[n.id] = n), 'mov' === t && 'store' === r.to && (n = r.target, a[n.id] = n);
},
    ue = null;

var me = function me(e, t) {
  if (!e) return t;
  if (!t) return e;
  var r,
      a = e.v.type === t.v.type;
  return (a && e.v.id > t.v.id || !a && 'sampler' === e.v.type) && (r = e, e = t, t = r), r = me(e.r, t), e.r = e.l, e.l = r, e;
},
    de = [];

var he = 0;

for (; he < 5;) {
  de.push({
    first: null,
    last: null,
    size: 0
  }), he += 1;
}

var ge = function ge() {
  for (var _e11 = 0; _e11 < 5; _e11++) {
    var _t7 = de[_e11];

    if (_t7.size > 0) {
      if (2 === _e11 || 3 === _e11) {
        _t7.size -= 1;
        var _e12 = ue.v;
        return ue = me(ue.l, ue.r), _e12;
      }

      1 === _t7.size && (_t7.last = null);
      var _r5 = _t7.first;
      return _t7.first = _r5.r, _t7.size -= 1, _r5.v;
    }
  }
},
    ye = function ye(e, t, r, a, n) {
  return be(0, {
    a: null,
    b: null,
    node: r,
    parent: a,
    value: n,
    page: t
  }, e);
},
    be = function be(e, t, r, a) {
  if (a === void 0) {
    a = 0;
  }

  var n = ke(r),
      o = de[n],
      l = {
    v: {
      idx: e,
      stack: t,
      type: r,
      id: a
    },
    l: 0,
    r: 0
  };
  2 === n || 3 === n ? ue = me(ue, l) : (0 === o.size ? o.first = l : o.last.r = l, o.last = l), o.size += 1;
},
    ke = function ke(e) {
  switch (e) {
    case 'child':
      return 0;

    case 'pure':
      return 1;

    case 'barrier':
      return 2;

    case 'sampler':
      return 3;

    case 'effect':
      return 4;

    default:
      return -1;
  }
},
    ve = new set_default.a();

var we = 0,
    Se = null,
    qe = function qe() {
  return Se;
},
    effector_es_Ne = function Ne(e, t, r) {
  var a = Se,
      n = null;
  if (e.target && (t = e.params, r = e.defer, a = 'page' in e ? e.page : a, e.stack && (n = e.stack), e = e.target), is_array_default()(e)) for (var _r6 = 0; _r6 < e.length; _r6++) {
    ye('pure', a, z(e[_r6]), n, t[_r6]);
  } else ye('pure', a, z(e), n, t);
  r && we || function () {
    var e,
        t,
        r,
        a,
        n,
        o,
        l = {
      alreadyStarted: we,
      currentPage: Se
    };
    we = 1;

    e: for (; a = ge();) {
      var _a4 = a,
          _l = _a4.idx,
          _s = _a4.stack,
          _i2 = _a4.type;
      r = _s.node, Se = n = _s.page, o = (n || r).reg;
      var _f2 = {
        fail: 0,
        scope: r.scope
      };
      e = t = 0;

      for (var _a5 = _l; _a5 < r.seq.length && !e; _a5++) {
        var _c = r.seq[_a5],
            _p = _c.data;

        switch (_c.type) {
          case 'barrier':
            {
              var _e13 = _p.barrierID;
              n && (_e13 = n.fullID + "_" + _e13);
              var _t8 = _p.priority;

              if (_a5 !== _l || _i2 !== _t8) {
                ve.has(_e13) || (ve.add(_e13), be(_a5, _s, _t8, _e13));
                continue e;
              }

              ve.delete(_e13);
              break;
            }

          case 'mov':
            {
              var _e14 = void 0;

              switch (_p.from) {
                case 'stack':
                  _e14 = I(_s);
                  break;

                case 'a':
                  _e14 = _s.a;
                  break;

                case 'b':
                  _e14 = _s.b;
                  break;

                case 'value':
                  _e14 = _p.store;
                  break;

                case 'store':
                  o[_p.store.id] || (_s.page = n = null, o = r.reg), _e14 = oe(o[_p.store.id]);
              }

              switch (_p.to) {
                case 'stack':
                  _s.value = _e14;
                  break;

                case 'a':
                  _s.a = _e14;
                  break;

                case 'b':
                  _s.b = _e14;
                  break;

                case 'store':
                  o[_p.target.id].current = _e14;
              }

              break;
            }

          case 'check':
            switch (_p.type) {
              case 'defined':
                t = void 0 === I(_s);
                break;

              case 'changed':
                t = I(_s) === oe(o[_p.store.id]);
            }

            break;

          case 'filter':
            t = !xe(_f2, _p, _s);
            break;

          case 'run':
            if (_a5 !== _l || 'effect' !== _i2) {
              be(_a5, _s, 'effect');
              continue e;
            }

          case 'compute':
            _s.value = xe(_f2, _p, _s);
        }

        e = _f2.fail || t;
      }

      if (!e) for (var _e15 = 0; _e15 < r.next.length; _e15++) {
        ye('child', n, r.next[_e15], _s, I(_s));
      }
    }

    we = l.alreadyStarted, Se = l.currentPage;
  }();
};

var xe = function xe(e, _ref28, r) {
  var t = _ref28.fn;

  try {
    return t(I(r), e.scope, r);
  } catch (t) {
    console.error(t), e.fail = 1;
  }
},
    effector_effector_es_e = function _e(e, t) {
  var r = index_of_default()(e).call(e, t);

  -1 !== r && splice_default()(e).call(e, r, 1);
},
    Ce = function Ce(e, t) {
  effector_effector_es_e(e.next, t), effector_effector_es_e(T(e), t), effector_effector_es_e(P(e), t);
},
    Ae = function Ae(e, t, r) {
  var a;
  e.next.length = 0, e.seq.length = 0, e.scope = null;
  var n = P(e);

  for (; a = n.pop();) {
    Ce(a, e), (t || r && !e.meta.sample || 'crosslink' === a.family.type) && Ae(a, t, r);
  }

  for (n = T(e); a = n.pop();) {
    Ce(a, e), r && 'crosslink' === a.family.type && Ae(a, t, r);
  }
},
    De = function De(e) {
  return e.clear();
};

var Ee = function Ee(e, _temp) {
  var _ref29 = _temp === void 0 ? {} : _temp,
      t = _ref29.deep;

  var r = 0;
  if (e.ownerSet && e.ownerSet.delete(e), q(e)) De(effector_es_F(e));else if (effector_es_(e)) {
    r = 1;
    var _t9 = e.history;
    De(_t9.events), De(_t9.effects), De(_t9.stores), De(_t9.domains);
  }
  Ae(z(e), !!t, r);
},
    je = function je(e) {
  var t = effector_es_U(Ee, e, void 0);
  return t.unsubscribe = t, t;
},
    ze = function ze(e) {
  return Te && fe(I(Te), [e]), e;
},
    Te = null,
    Pe = function Pe() {
  return Te && Te.template;
},
    Me = function Me(e, t, _ref30) {
  var r = _ref30.node,
      n = _ref30.scope,
      o = _ref30.meta;
  return ze(effector_es_a({
    node: r,
    parent: e,
    child: t,
    scope: n,
    meta: o,
    family: {
      owners: [e, t],
      links: t
    }
  }));
},
    Oe = function Oe(e) {
  var t;
  R(e) && (t = O(e), e = R(e));
  var _e16 = e,
      r = _e16.from,
      n = _e16.to,
      _e16$meta = _e16.meta,
      o = _e16$meta === void 0 ? {
    op: 'forward'
  } : _e16$meta;
  return r && n || A('from and to fields should be defined'), t && (o.config = t), je(ze(effector_es_a({
    parent: r,
    child: n,
    meta: o,
    family: {}
  })));
},
    Re = function Re(e, t) {
  return je(ze(effector_es_a({
    scope: {
      fn: t
    },
    node: [te({
      fn: ie
    })],
    parent: e,
    meta: {
      op: 'watch'
    },
    family: {
      owners: e
    }
  })));
};

var Ie = function Ie(e, t) {
  return effector_es_D(e) && (Ie(O(e), t), null != e.name && (effector_es_D(e.name) ? Ie(e.name, t) : t.name = e.name), e.loc && (t.loc = e.loc), e.sid && (t.sid = e.sid), e.handler && (t.handler = e.handler), H(e) && (t.parent = H(e)), 'strict' in e && (t.strict = e.strict), e.named && (t.named = e.named), Ie(R(e), t)), t;
};

var Fe,
    He = function He(e, t) {
  H(e) && H(e).hooks.event(t);
},
    Ke = function Ke(e, t, a, n) {
  var o = Ie({
    name: n,
    config: a
  }, {}),
      l = J(),
      _o$parent = o.parent,
      s = _o$parent === void 0 ? null : _o$parent,
      _o$sid = o.sid,
      i = _o$sid === void 0 ? null : _o$sid,
      _o$strict = o.strict,
      f = _o$strict === void 0 ? 1 : _o$strict,
      _o$named = o.named,
      c = _o$named === void 0 ? null : _o$named,
      p = c || o.name || ('domain' === e ? '' : l),
      u = effector_es_r(p, s);
  return t.kind = e, t.id = l, t.sid = i, t.shortName = p, t.parent = s, t.compositeName = u, t.defaultConfig = o, t.thru = function (e) {
    return e(t);
  }, t.getType = function () {
    return u.fullName;
  }, Fe = f, {
    unit: e,
    name: p,
    sid: i,
    named: c
  };
},
    Be = function Be(e) {
  return effector_es_o({
    named: e
  });
};

var Ge = function Ge(e, t, r, a) {
  return Me(e, t, {
    scope: {
      fn: a
    },
    node: [$({
      fn: ie
    })],
    meta: {
      op: r
    }
  });
},
    Je = function Je(e, t, r, a) {
  var n;
  effector_es_D(r) && (n = r, r = r.fn);
  var l = effector_es_o(K(e, ' →? *'), n);
  return Me(e, l, {
    scope: {
      fn: r
    },
    node: a,
    meta: {
      op: t
    }
  }), l;
},
    effector_es_Le = function Le(e, t) {
  return t.subscribe = function (t) {
    return j(t), e.watch(function (e) {
      t.next && t.next(e);
    });
  }, t[es["a" /* default */]] = function () {
    return t;
  }, t;
},
    effector_es_Qe = function Qe(e, t, r, a, n) {
  var o = M(t),
      l = [Y({
    store: o,
    to: 'a'
  }), $({
    fn: a ? se : le
  }), Z.defined(), Z.changed({
    store: o
  }), re({
    store: o
  })],
      s = Pe();

  if (s && (l.unshift(s.loader), q(e))) {
    var _context7, _context8;

    var _t10 = M(e);

    includes_default()(_context7 = s.plain).call(_context7, _t10) || (includes_default()(_context8 = s.closure).call(_context8, _t10) || s.closure.push(_t10), o.before || (o.before = []), o.before.push({
      type: 'closure',
      of: _t10
    }));
  }

  return Me(e, t, {
    scope: {
      fn: n
    },
    node: l,
    meta: {
      op: r
    }
  });
};

var Ue = function Ue(e, t) {
  for (var _r7 in e) {
    t(e[_r7], _r7);
  }
};

var effector_es_Ve = function Ve(e) {
  return function (t) {
    return e.apply(void 0, toConsumableArray_default()(t));
  };
},
    effector_es_We = function We(t, r, a, n) {
  var o = t ? function (e) {
    return slice_default()(e).call(e);
  } : function (e) {
    return assign_default()({}, e);
  },
      l = t ? [] : {},
      i = Pe(),
      f = o(l),
      c = ne(f),
      p = ne(1);
  c.type = t ? 'list' : 'shape', i && i.plain.push(c, p);
  var u = effector_es_s(f, {
    name: a || effector_es_e(r)
  }),
      m = [Z.defined(), Y({
    store: c,
    to: 'a'
  }), ee({
    fn: function fn(e, _ref31, _ref32) {
      var t = _ref31.key;
      var r = _ref32.a;
      return e !== r[t];
    }
  }), Y({
    store: p,
    to: 'b'
  }), $({
    fn: function fn(e, _ref33, a) {
      var t = _ref33.clone,
          r = _ref33.key;
      a.b && (a.a = t(a.a)), a.a[r] = e;
    }
  }), Y({
    from: 'a',
    target: c
  }), Y({
    from: 'value',
    store: 0,
    target: p
  }), X({
    priority: 'barrier'
  }), Y({
    from: 'value',
    store: 1,
    target: p
  }), Y({
    store: c
  }), n && $({
    fn: n
  }), Z.changed({
    store: M(u)
  })],
      d = c.before = [];
  return Ue(r, function (e, t) {
    var _context9;

    if (!q(e)) return void (f[t] = l[t] = e);
    l[t] = e.defaultState, f[t] = e.getState();
    var r = Me(e, u, {
      scope: {
        key: t,
        clone: o
      },
      node: m,
      meta: {
        op: 'combine'
      }
    }),
        a = M(e);
    d.push({
      type: 'field',
      field: t,
      from: a
    }), i && (includes_default()(_context9 = i.plain).call(_context9, a) || r.seq.unshift(i.loader));
  }), u.defaultShape = r, c.after = [n ? {
    type: 'map',
    to: M(u),
    fn: n
  } : {
    type: 'copy',
    to: M(u)
  }], i || (u.defaultState = n ? M(u).current = n(f) : l), u;
};

var Xe = function Xe(_ref34) {
  var e = _ref34.params,
      t = _ref34.req,
      r = _ref34.ok,
      a = _ref34.anyway,
      n = _ref34.page;
  return function (o) {
    return effector_es_Ne({
      target: [a, Ye],
      params: [r ? {
        status: 'done',
        params: e,
        result: o
      } : {
        status: 'fail',
        params: e,
        error: o
      }, {
        fn: r ? t.rs : t.rj,
        value: o
      }],
      defer: 1,
      page: n
    });
  };
};

var Ye = effector_es_a({
  node: [te({
    fn: function fn(_ref35) {
      var e = _ref35.fn,
          t = _ref35.value;
      e(t);
    }
  })],
  meta: {
    op: 'fx',
    fx: 'sidechain'
  }
}),
    effector_es_Ze = function Ze(e, t, r) {
  return e.watch(function (e) {
    fe(r, [e]), t.add(e), e.ownerSet || (e.ownerSet = t), H(e) || (e.parent = r);
  }), fe(r, [e]), function (r) {
    return for_each_default()(t).call(t, r), e.watch(r);
  };
};

var $e = function $e(e) {
  return w(e) ? e : effector_es_i(e);
};

var et = "20.15.0";
var tt = {
  __proto__: null,
  filterChanged: ee({
    fn: function fn(e, _ref36) {
      var t = _ref36.state;
      return void 0 !== e && e !== oe(t);
    }
  }),
  noop: $({
    fn: function fn(e) {
      return e;
    }
  })
};

// CONCATENATED MODULE: ./src/js/market-mvp/utils/eventsForStore.js

var eventsForStore = {
  changeProductListState: effector_es_o('Open product-list-item'),
  findProductsInDefaultProductList: effector_es_o('For open product into cart and open list from menu'),
  closeCartPage: effector_es_o(),
  toMainPage: effector_es_o(),
  openProductPage: effector_es_o(),
  search: effector_es_o(),
  productListToCurrentView: effector_es_o('When input clear'),
  clearSearchInput: effector_es_o(),
  disabledSearch: effector_es_o(),
  enabledSearch: effector_es_o(),
  addMenuItem: effector_es_o(),
  removeMenuItemsTo: effector_es_o(),
  createMenuPath: effector_es_o(),
  createCartMenu: effector_es_o(),
  createSearchMenu: effector_es_o(),
  deleteLastMenuItem: effector_es_o(),
  openCartPage: effector_es_o(),
  addToCart: effector_es_o(),
  updateQuantityOfProductInCart: effector_es_o(),
  deleteProductInCart: effector_es_o(),
  sendOrder: effector_es_o(),
  toMainPageFromCart: effector_es_o(),
  oneClickOrder: effector_es_o()
};
eventsForStore.toMainPageFromCart.watch(function () {
  eventsForStore.removeMenuItemsTo({
    id: 0
  });
  eventsForStore.toMainPage();
  eventsForStore.closeCartPage();
});
// CONCATENATED MODULE: ./src/js/market-mvp/products/model-products.js







 // Рекурсивный поиск одного элемента по всему массиву

var model_products_findByName = function findByName(arr, id, name) {
  return reduce_default()(arr).call(arr, function (a, item) {
    // При первой итерации этот if пропускается, потому что передаётся null
    if (a) return a; // Если текущий элемент массива содержит нужное имя, возращаем его. Если нет, то..

    if (item.id === id && item.name === name) return item; // ..берём элемент с ключом nestingKey и снова ищём в нём нужное имя, либо..

    if ("subCategory" in item) return findByName(item.subCategory, id, name); // ..если нужно найти элемент в списке товаров в категории

    if ("productsInCategory" in item) return findByName(item.productsInCategory, id, name);
  }, null);
};

var awaitProducts = effector_es_f("get products", {
  handler: function handler(value) {
    return promise_default.a.resolve(value);
  }
});
var $productList;
var searchList;
var productPage;
awaitProducts.done.watch(function (_ref) {
  var result = _ref.result;
  $productList = effector_es_s(result);
  $productList.on(eventsForStore.changeProductListState, function (state, data) {
    var _context, _context2;

    switch (true) {
      case "subCategory" in state:
        return find_default()(_context = state.subCategory).call(_context, function (item) {
          return item.id == data.id && item.name == data.name;
        });

      case "productsInCategory" in state:
        return find_default()(_context2 = state.productsInCategory).call(_context2, function (item) {
          return item.id == data.id && item.name == data.name;
        });

      case is_array_default()(state):
        return find_default()(state).call(state, function (item) {
          return item.id == data.id && item.name == data.name;
        });

      default:
        return state.defaultState;
    }
  }).on(eventsForStore.findProductsInDefaultProductList, function (state, data) {
    state = model_products_findByName($productList.defaultState, data.id, data.name);
    return state ? state : $productList.defaultState;
  }).reset(eventsForStore.toMainPage); // * нарушено правило чистой функции, чтобы вычесления производить здесь, а не в презентере

  searchList = effector_es_d($productList, eventsForStore.search, function (state, data) {
    var _context3, _context5;

    if (data.searchValue == "") {
      eventsForStore.deleteLastMenuItem();
      eventsForStore.productListToCurrentView(state);
    } else {
      switch (true) {
        case "subCategory" in state:
          return filter_default()(_context3 = state.subCategory).call(_context3, function (item) {
            var _context4;

            return includes_default()(_context4 = item.name.toLowerCase()).call(_context4, data.searchValue.toLowerCase());
          });

        case "productsInCategory" in state:
          return filter_default()(_context5 = state.productsInCategory).call(_context5, function (item) {
            var _context6;

            return includes_default()(_context6 = item.name.toLowerCase()).call(_context6, data.searchValue.toLowerCase());
          });
        // Если это главная страница

        case is_array_default()(state):
          return filter_default()(state).call(state, function (item) {
            var _context7;

            return includes_default()(_context7 = item.name.toLowerCase()).call(_context7, data.searchValue.toLowerCase());
          });

        default:
          return false;
      }
    }
  });
  productPage = effector_es_d($productList, eventsForStore.openProductPage, function (state) {
    return state;
  });
});
// CONCATENATED MODULE: ./src/js/market-mvp/menu/model-menu.js









 // Путь к элементу (для меню из поиска)

var model_menu_menuPath = function menuPath(arr, id, name) {
  var items = [];
  var continueFind = true;

  var pushData = function pushData(arr, id, name) {
    arr.push({
      id: id,
      name: name
    });
  };

  var find = function find(arr, findId, findName) {
    find_default()(arr).call(arr, function (item) {
      if (item.id === findId && item.name === findName) {
        // Добавлять или нет айди и имя найденного элемента
        pushData(items, item.id, item.name);
        continueFind = false;
      } else if (continueFind) {
        if ("subCategory" in item) {
          // Если в этой ветке содержится нужный элемент
          var there = function there(newItem) {
            return some_default()(newItem).call(newItem, function (product) {
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
          var _context;

          // Если в этой категории содержится нужный элемент
          var _there = some_default()(_context = item.productsInCategory).call(_context, function (product) {
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
};

var entryMenu = [{
  id: 0,
  name: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F"
}];
var $menu = effector_es_s(entryMenu);
var whatMenuIsIt = function whatMenuIsIt(menu, lastItem) {
  return menu[menu.length - 1].name === lastItem;
};
$menu.on(eventsForStore.addMenuItem, function (state, menuItem) {
  var _context2;

  return concat_default()(_context2 = []).call(_context2, toConsumableArray_default()(state), [menuItem]);
}).on(eventsForStore.removeMenuItemsTo, function (state, data) {
  var indexMenuItem = find_index_default()(state).call(state, function (item) {
    return item.id === data.id;
  });

  return slice_default()(state).call(state, 0, indexMenuItem + 1);
}).on(eventsForStore.createMenuPath, function (_, data) {
  var _context3, _context4;

  return concat_default()(_context3 = concat_default()(_context4 = []).call(_context4, entryMenu)).call(_context3, model_menu_menuPath($productList.defaultState, data.id, data.name));
}).on(eventsForStore.createSearchMenu, function (state) {
  return !whatMenuIsIt(state, "\u041F\u043E\u0438\u0441\u043A") ? concat_default()(state).call(state, {
    name: "\u041F\u043E\u0438\u0441\u043A"
  }) : state;
}).on(eventsForStore.createCartMenu, function () {
  var _context5, _context6;

  return concat_default()(_context5 = concat_default()(_context6 = []).call(_context6, entryMenu)).call(_context5, {
    name: "\u041A\u043E\u0440\u0437\u0438\u043D\u0430"
  });
}).on(eventsForStore.deleteLastMenuItem, function (state) {
  return splice_default()(state).call(state, 0, state.length - 1);
});
// CONCATENATED MODULE: ./src/js/market-mvp/menu/controller-menu.js














var controller_menu_MenuController = /*#__PURE__*/function () {
  function MenuController(container) {
    var _context;

    classCallCheck_default()(this, MenuController);

    this._container = container;
    this._menuComponent = new menu_MenuComponent();
    this._menuItemComponents = [];
    this._onViewChange = bind_default()(_context = this._onViewChange).call(_context, this);
  }

  createClass_default()(MenuController, [{
    key: "render",
    value: function render() {
      var _this = this;

      $menu.watch(function (menu) {
        return _this._onViewChange(menu);
      }); // Подписываемся на очищение поля поиска

      eventsForStore.clearSearchInput.watch(function () {
        if (whatMenuIsIt($menu.getState(), "\u041F\u043E\u0438\u0441\u043A")) {
          eventsForStore.deleteLastMenuItem();
        }
      });
    }
  }, {
    key: "_renderItem",
    value: function _renderItem(menu) {
      var _this2 = this,
          _context3;

      var header = this._container.getElement();

      render_render(header, this._menuComponent, RenderPosition.BEFOREEND);

      var menuWrap = this._menuComponent.getElement();

      var renderMenuItems = function renderMenuItems(arr) {
        return map_default()(arr).call(arr, function (element) {
          var menuItemComponent = new menu_item_MenuComponent(element);
          render_render(menuWrap, menuItemComponent, RenderPosition.BEFOREEND);
          return menuItemComponent;
        });
      };

      this._menuItemComponents = renderMenuItems(menu);
      var isCartMenu = this._menuItemComponents[this._menuItemComponents.length - 1].getElement().textContent === "\u041A\u043E\u0440\u0437\u0438\u043D\u0430";
      utils_elementReady(header, ".".concat(menuWrap.classList[0])).then(function () {
        var _context2;

        var width = reduce_default()(_context2 = _this2._menuItemComponents).call(_context2, function (acc, item) {
          return acc + item.getElement().offsetWidth;
        }, 0);

        Object(carousel_scrollbar["b" /* carouselNav */])(menuWrap, width);
      });

      map_default()(_context3 = this._menuItemComponents).call(_context3, function (element, index) {
        // Если это единственный элемент
        if (_this2._menuItemComponents.length == 1) {
          return;
        } // Если это меню корзины и не последний элемент
        else if (isCartMenu && index !== _this2._menuItemComponents.length - 1) {
            element.setOpenButtonClickHandler(function () {
              eventsForStore.clearSearchInput();
              eventsForStore.toMainPageFromCart();
            });
          } // Если это не последний элемент
          else if (index !== _this2._menuItemComponents.length - 1) {
              element.setOpenButtonClickHandler(function () {
                var id = Number(element.getElement().id.replace(/[^+\d]/g, ""));
                var name = element.getElement().textContent;
                eventsForStore.clearSearchInput();
                eventsForStore.removeMenuItemsTo({
                  id: id,
                  name: name
                });
                eventsForStore.findProductsInDefaultProductList({
                  id: id,
                  name: name
                });
              });
            }
      });
    }
  }, {
    key: "_onViewChange",
    value: function _onViewChange(menu) {
      if (this._menuItemComponents.length) {
        var _context4;

        for_each_default()(_context4 = this._menuItemComponents).call(_context4, function (element) {
          return remove(element);
        });

        this._menuItemComponents = [];
      }

      remove(this._menuComponent);

      this._renderItem(menu);
    }
  }]);

  return MenuController;
}();


// CONCATENATED MODULE: ./src/js/market-mvp/search-input/component-search-input.js







function component_search_input_createSuper(Derived) { var hasNativeReflectConstruct = component_search_input_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function component_search_input_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }


var inputSearchTemplate = "<div class=\"market-header__search-panel\"><input type=\"text\" class=\"market-header__search-input\" placeholder=\"\u041F\u043E\u0438\u0441\u043A\"></div>";

var component_search_input_SearchInputComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(SearchInputComponent, _AbstractComponent);

  var _super = component_search_input_createSuper(SearchInputComponent);

  function SearchInputComponent() {
    classCallCheck_default()(this, SearchInputComponent);

    return _super.apply(this, arguments);
  }

  createClass_default()(SearchInputComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return inputSearchTemplate;
    }
  }, {
    key: "getInput",
    value: function getInput() {
      return this.getElement().querySelector(".market-header__search-input");
    }
  }, {
    key: "setInputHandler",
    value: function setInputHandler(handler) {
      this.getInput().oninput = handler;
    }
  }]);

  return SearchInputComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/search-input/controller-search-input.js







var controller_search_input_SearchInputController = /*#__PURE__*/function () {
  function SearchInputController(container) {
    classCallCheck_default()(this, SearchInputController);

    this._container = container;
  }

  createClass_default()(SearchInputController, [{
    key: "render",
    value: function render() {
      var searchInputComponent = new component_search_input_SearchInputComponent();

      render_render(this._container.getElement(), searchInputComponent, RenderPosition.BEFOREEND);

      var input = searchInputComponent.getInput(); // Следим за вызовом события очищения поля поиска

      eventsForStore.clearSearchInput.watch(function () {
        return input.value = "";
      });
      eventsForStore.disabledSearch.watch(function () {
        return input.disabled = true;
      });
      eventsForStore.enabledSearch.watch(function () {
        return input.disabled = false;
      });
      searchInputComponent.setInputHandler(utils_debounce(function () {
        eventsForStore.createSearchMenu();
        eventsForStore.search({
          searchValue: input.value
        });
      }, 150));
    }
  }]);

  return SearchInputController;
}();


// CONCATENATED MODULE: ./src/js/market-mvp/products/components/product-page.js












function product_page_createSuper(Derived) { var hasNativeReflectConstruct = product_page_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function product_page_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }




var product_page_createProductPageTemplate = function createProductPageTemplate(globalSetting, productObject) {
  var _context5, _context6, _context7, _context8, _context9, _context10;

  var optionItem = function optionItem(name, state, arr, index) {
    var _context;

    return concat_default()(_context = "<li class=\"market-product__option-item\n    ".concat(state ? utils_firstActiveOptionIndex(arr) === index ? " market-product__option-item--active" : "" : " market-product__option-item--disabled", "\n    \">")).call(_context, name, "</li>");
  }; // Проходимся по массиву опций с установкой активного класса первой активной опции


  var optionsList = function optionsList(product) {
    var _context2;

    return map_default()(_context2 = product.options.optionList).call(_context2, function (item, indexItem) {
      var _context3;

      // Превращаем каждый объект опции в массив и выбираем первую строчку
      return map_default()(_context3 = entries_default()(item)).call(_context3, function (_ref) {
        var _ref2 = slicedToArray_default()(_ref, 2),
            optionName = _ref2[0],
            optionStatus = _ref2[1];

        return optionItem(optionName, optionStatus, product, indexItem);
      })[0];
    }).join("");
  };

  var optionWrap = function optionWrap(product) {
    var _context4;

    return "options" in product && product.options ? concat_default()(_context4 = "<div class=\"market-product__option-wrap\">\n           <div class=\"market-product__option-title\">".concat(product.options.nameOptionList, ":</div>\n           <ul class=\"market-product__option-list\"> \n             ")).call(_context4, optionsList(product), "\n           </ul>\n         </div>") : "";
  };

  var desc = function desc(product) {
    return product.desc ? "<div class=\"market-product__desc\">\n          <span class=\"market-product__desc-title\">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:</span>\n          <p class=\"market-product__desc-text\">".concat(product.desc, "</p>\n        </div>") : "";
  }; // Внутри превращаем productObject.option в массив и отрисовываем каждый элемент опций


  return concat_default()(_context5 = concat_default()(_context6 = concat_default()(_context7 = concat_default()(_context8 = concat_default()(_context9 = concat_default()(_context10 = "<section class=\"market-product market-content--fade-in\">\n    <h2 class=\"market-product__title\">".concat(productObject.name, "</h2>\n    <div class=\"market-product__img-wrap\">\n      <img src=\"https://media.lpgenerator.ru/images/")).call(_context10, globalSetting.userId, "/")).call(_context9, productObject.img, "\" alt=\"product-img\">\n    </div>\n    <div class=\"market-product__content-wrap\">\n      ")).call(_context8, optionWrap(productObject), "\n      <div class=\"market-product__price-wrap\">\n        <span>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C: </span>\n        <span class=\"market-product__price\">")).call(_context7, utils_createPrice(productObject), "</span>\n        <span>")).call(_context6, globalSetting.currency, "</span>\n      </div>\n      <button class=\"market-product__btn market-btn market-btn--add-to-cart\">\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</button>\n    </div>\n    ")).call(_context5, desc(productObject), "\n  </section>");
};

var product_page_ProductPageComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(ProductPageComponent, _AbstractComponent);

  var _super = product_page_createSuper(ProductPageComponent);

  function ProductPageComponent(setting, product) {
    var _this;

    classCallCheck_default()(this, ProductPageComponent);

    _this = _super.call(this);
    _this._setting = setting;
    _this._product = product;
    return _this;
  }

  createClass_default()(ProductPageComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return product_page_createProductPageTemplate(this._setting, this._product);
    }
  }, {
    key: "getOptionWrapElement",
    value: function getOptionWrapElement() {
      return this.getElement().querySelector(".market-product__option-list");
    }
  }, {
    key: "getOptionTitleElement",
    value: function getOptionTitleElement() {
      return this.getElement().querySelector(".market-product__option-title");
    }
  }, {
    key: "getAllActiveOptionElements",
    value: function getAllActiveOptionElements() {
      return this.getElement().querySelectorAll(".market-product__option-item:not(.market-product__option-item--disabled)");
    }
  }, {
    key: "getActiveOptionElement",
    value: function getActiveOptionElement() {
      return this.getElement().querySelector(".market-product__option-item--active");
    }
  }, {
    key: "getPriceElement",
    value: function getPriceElement() {
      return this.getElement().querySelector(".market-product__price");
    }
  }, {
    key: "setOrderButtonClickHandler",
    value: function setOrderButtonClickHandler(handler) {
      this.getElement().querySelector(".market-btn--add-to-cart").addEventListener("click", handler);
    }
  }, {
    key: "setOptionItemClickHandler",
    value: function setOptionItemClickHandler(handler) {
      var _context11;

      for_each_default()(_context11 = this.getOptionWrapElement().querySelectorAll(".market-product__option-item:not(.market-product__option-item--disabled)")).call(_context11, function (item) {
        return item.addEventListener("click", handler);
      });
    }
  }, {
    key: "deleteActiveClassOption",
    value: function deleteActiveClassOption(el) {
      var _context12;

      for_each_default()(_context12 = this.getAllActiveOptionElements()).call(_context12, function (item) {
        return item.classList.remove("market-product__option-item--active");
      });

      el.classList.toggle("market-product__option-item--active");
    }
  }]);

  return ProductPageComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/products/components/btn-prev.js







function btn_prev_createSuper(Derived) { var hasNativeReflectConstruct = btn_prev_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function btn_prev_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }


var btnPrevTemplate = "<button class=\"market-btn--prev-step\">\u2190 \u041D\u0430\u0437\u0430\u0434</button>";

var btn_prev_BtnPrevComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(BtnPrevComponent, _AbstractComponent);

  var _super = btn_prev_createSuper(BtnPrevComponent);

  function BtnPrevComponent() {
    classCallCheck_default()(this, BtnPrevComponent);

    return _super.apply(this, arguments);
  }

  createClass_default()(BtnPrevComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return btnPrevTemplate;
    }
  }, {
    key: "setPrevBtnHandler",
    value: function setPrevBtnHandler(handler) {
      this.getElement().addEventListener("click", handler);
    }
  }]);

  return BtnPrevComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/products/controllers/product-page.js











var product_page_ProductPageController = /*#__PURE__*/function () {
  function ProductPageController(container, setting) {
    var _this = this;

    classCallCheck_default()(this, ProductPageController);

    this._container = container;
    this._setting = setting;
    this._productPageComponent = null;
    this._btnPrevComponent = null; // Наблюдаем за появлением стора с продуктом

    productPage.watch(function (state) {
      console.log('state :', state);
      eventsForStore.clearSearchInput();
      eventsForStore.disabledSearch();

      _this._renderCartPage(state);
    });
    $productList.watch(function () {
      return _this._removeCartPage();
    });
    eventsForStore.openCartPage.watch(function () {
      return _this._removeCartPage();
    });
  }

  createClass_default()(ProductPageController, [{
    key: "_renderCartPage",
    value: function _renderCartPage(product) {
      var _this2 = this;

      console.log('product :', product);
      this._productPageComponent = new product_page_ProductPageComponent(this._setting, product);
      render_render(this._container.getElement(), this._productPageComponent, RenderPosition.BEFOREEND);

      var productPrice = this._productPageComponent.getPriceElement();

      this._productPageComponent.setOrderButtonClickHandler(function () {
        var optionName = _this2._productPageComponent.getOptionTitleElement();

        var optionValue = _this2._productPageComponent.getActiveOptionElement();

        eventsForStore.addToCart({
          product: product,
          productPrice: productPrice.textContent,
          optionName: optionName ? optionName.textContent : undefined,
          optionValue: optionValue ? optionValue.textContent : undefined
        });
        animationForAddProductToCart(_this2._productPageComponent.getElement());
      });

      var optionWrap = this._productPageComponent.getOptionWrapElement();

      if (optionWrap) {
        this._productPageComponent.setOptionItemClickHandler(function () {
          var _context;

          var target = event.target;

          _this2._productPageComponent.deleteActiveClassOption(target);

          var optionName = target.textContent; // Находим цену опции

          var optionPrice = find_default()(_context = product.options.optionList).call(_context, function (option) {
            return option[optionName];
          });

          productPrice.textContent = optionPrice.price;
        });
      }

      this._renderPrevBtn();
    }
  }, {
    key: "_renderPrevBtn",
    value: function _renderPrevBtn() {
      this._btnPrevComponent = new btn_prev_BtnPrevComponent();
      render_render(this._container.getElement(), this._btnPrevComponent, RenderPosition.BEFOREEND);

      this._btnPrevComponent.setPrevBtnHandler(function () {
        eventsForStore.deleteLastMenuItem();
        var menu = $menu.getState();
        var id = menu[menu.length - 1].id;
        var name = menu[menu.length - 1].name;
        eventsForStore.findProductsInDefaultProductList({
          id: id,
          name: name
        });
      });
    }
  }, {
    key: "_removeCartPage",
    value: function _removeCartPage() {
      if (this._productPageComponent) {
        remove(this._productPageComponent);
        remove(this._btnPrevComponent);
      }

      eventsForStore.enabledSearch();
    }
  }]);

  return ProductPageController;
}();


// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reverse.js
var reverse = __webpack_require__(294);
var reverse_default = /*#__PURE__*/__webpack_require__.n(reverse);

// CONCATENATED MODULE: ./src/js/market-mvp/cart/model-cart.js





var $cart = effector_es_s([]);
$cart.on(eventsForStore.addToCart, function (state, data) {
  var _context;

  var product = newProductCart(data.product, data.productPrice, data.optionName, data.optionValue);
  return reverse_default()(_context = utils_newProductCartArr(state, product)).call(_context);
}).on(eventsForStore.updateQuantityOfProductInCart, function (state, data) {
  return utils_newProductCartArr(state, data.product, data.quantityUp);
}).on(eventsForStore.deleteProductInCart, function (state, data) {
  return filter_default()(state).call(state, function (product) {
    // Если есть опции
    return product.option ? // Если уже есть такой же товар
    product.id === data.id && product.name === data.name ? // То удаляем товар с переданной опцией
    product.option.optionValue !== data.option.optionValue : true : product.id !== data.id && product.name !== data.name;
  });
});
// CONCATENATED MODULE: ./src/js/market-mvp/products/components/list-item.js








function list_item_createSuper(Derived) { var hasNativeReflectConstruct = list_item_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function list_item_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }





var list_item_listItemTemplate = function listItemTemplate(globalSetting, option, listItem) {
  var _context5, _context6, _context7, _context8, _context9;

  var isProduct = ("price" in listItem);
  var isOneClick = isProduct && option.oneClickOrder;
  var productExist = !utils_isItProductInCart($cart.getState(), listItem.name) ? "+" : "\u2713";
  var oneClickBtn = isOneClick ? "<button class=\"market-products__product-btn market-btn market-products__product-btn--one-click-order\">\u043A\u0443\u043F\u0438\u0442\u044C \u0432 1 \u043A\u043B\u0438\u043A</button>" : "";
  var oneClickClass = isOneClick ? " market-products__product-bottom--one-click" : '';

  var bottomContentTemplate = function bottomContentTemplate() {
    var _context, _context2, _context3, _context4;

    return concat_default()(_context = concat_default()(_context2 = concat_default()(_context3 = concat_default()(_context4 = "<div class=\"market-products__product-bottom".concat(oneClickClass, "\">\n    <span class=\"market-products__product-price\">")).call(_context4, utils_createPrice(listItem), " ")).call(_context3, globalSetting.currency, "</span>\n    <div class=\"market-products__product-btn-wrap\">\n      ")).call(_context2, oneClickBtn, "\n      <button class=\"market-products__product-btn market-btn market-products__product-btn--add-to-cart\">\n        <span>")).call(_context, productExist, "</span>\n        <span class=\"gg-shopping-cart\"></span>\n      </button>\n    </div>\n  </div>");
  };

  var isActive = isProduct && !listItem.active ? " style=\"display: none;\"" : "";
  var checkNeedBottomContent = isProduct ? bottomContentTemplate() : "";
  return concat_default()(_context5 = concat_default()(_context6 = concat_default()(_context7 = concat_default()(_context8 = concat_default()(_context9 = "<div id=\"product-".concat(listItem.id, "\" class=\"market-products__product\"")).call(_context9, isActive, ">\n    <div class=\"market-products__product-wrap\">\n      <h2 class=\"market-products__product-title\">")).call(_context8, listItem.name, "</h2>\n      <div class=\"market-products__product-img-wrap\"><img src=\"https://media.lpgenerator.ru/images/")).call(_context7, globalSetting.userId, "/")).call(_context6, listItem.img, "\"></div>\n      ")).call(_context5, checkNeedBottomContent, "\n    </div>\n  </div>");
};

var list_item_ListItemComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(ListItemComponent, _AbstractComponent);

  var _super = list_item_createSuper(ListItemComponent);

  function ListItemComponent(setting, option, product) {
    var _this;

    classCallCheck_default()(this, ListItemComponent);

    _this = _super.call(this);
    _this._setting = setting;
    _this._option = option;
    _this._product = product;
    return _this;
  }

  createClass_default()(ListItemComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return list_item_listItemTemplate(this._setting, this._option, this._product);
    }
  }, {
    key: "getItemNameElement",
    value: function getItemNameElement() {
      return this.getElement().querySelector(".market-products__product-title");
    }
  }, {
    key: "getProductPriceElement",
    value: function getProductPriceElement() {
      return this.getElement().querySelector(".market-products__product-price");
    }
  }, {
    key: "setOpenButtonClickHandler",
    value: function setOpenButtonClickHandler(handler) {
      this.getElement().querySelector(".market-products__product-img-wrap").addEventListener("click", handler);
      this.getElement().querySelector(".market-products__product-title").addEventListener("click", handler);
    }
  }, {
    key: "setAddToCartBtnClickHandler",
    value: function setAddToCartBtnClickHandler(handler) {
      this.getElement().querySelector(".market-products__product-btn--add-to-cart").addEventListener("click", handler);
    }
  }, {
    key: "setOneClickOrderBtnClickHandler",
    value: function setOneClickOrderBtnClickHandler(handler) {
      this.getElement().querySelector(".market-products__product-btn--one-click-order").addEventListener("click", handler);
    }
  }]);

  return ListItemComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/products/controllers/list-item.js








var list_item_ListItemController = /*#__PURE__*/function () {
  function ListItemController(container, setting, option) {
    classCallCheck_default()(this, ListItemController);

    this._container = container;
    this._setting = setting;
    this._option = option;
    this._productComponent = null;
  }

  createClass_default()(ListItemController, [{
    key: "render",
    value: function render(product) {
      this._productComponent = new list_item_ListItemComponent(this._setting, this._option, product);

      render_render(this._container, this._productComponent, RenderPosition.BEFOREEND);

      this._initHandler(product);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      remove(this._productComponent);
    }
  }, {
    key: "getComponent",
    value: function getComponent() {
      return this._productComponent.getElement();
    }
  }, {
    key: "_initHandler",
    value: function _initHandler(product) {
      var _this = this;

      var id = Number(this._productComponent.getElement().id.replace(/[^+\d]/g, ""));

      var name = this._productComponent.getItemNameElement().textContent; // При открытии элемента списка:


      this._productComponent.setOpenButtonClickHandler(function () {
        eventsForStore.clearSearchInput();
        eventsForStore.addMenuItem({
          id: id,
          name: name
        });
        eventsForStore.changeProductListState({
          id: id,
          name: name
        });
      });

      var isProduct = ("price" in product);

      if (isProduct) {
        var _product$options;

        var productPrice = Number(this._productComponent.getProductPriceElement().textContent.replace(/[^+\d]/g, ""));
        var productData = {
          product: product,
          productPrice: productPrice,
          optionName: (_product$options = product.options) === null || _product$options === void 0 ? void 0 : _product$options.nameOptionList,
          optionValue: product.options ? utils_firstActiveOptionName(product.options.optionList) : undefined
        }; // Добавляем товар в корзину

        this._productComponent.setAddToCartBtnClickHandler(function () {
          if (!utils_isItProductInCart($cart.getState(), product.name)) {
            eventsForStore.addToCart(productData);

            _this._replace(product);

            animationForAddProductToCart(_this._productComponent.getElement());
          } else {
            eventsForStore.addToCart(productData);
            animationForAddProductToCart(_this._productComponent.getElement());
          }
        });

        if (this._option.oneClickOrder && "options" in product == false) {
          this._productComponent.setOneClickOrderBtnClickHandler(function () {
            eventsForStore.addToCart(productData);

            if (!_this._option.oneClickOrderCustom) {
              eventsForStore.openCartPage();
            } else {
              eventsForStore.oneClickOrder({
                productData: productData
              });
            }
          });
        }
      }
    }
  }, {
    key: "_replace",
    value: function _replace(product) {
      var newViewOfListItem = new list_item_ListItemComponent(this._setting, this._option, product);
      replace(newViewOfListItem, this._productComponent);
      this._productComponent = newViewOfListItem;

      this._initHandler(product);
    }
  }]);

  return ListItemController;
}();


// CONCATENATED MODULE: ./src/js/market-mvp/products/components/market-list.js







function market_list_createSuper(Derived) { var hasNativeReflectConstruct = market_list_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function market_list_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }


var marketListTemplate = "<div class=\"market-products__list market-content--fade-in\"></div>";

var market_list_MarketListComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(MarketListComponent, _AbstractComponent);

  var _super = market_list_createSuper(MarketListComponent);

  function MarketListComponent() {
    classCallCheck_default()(this, MarketListComponent);

    return _super.apply(this, arguments);
  }

  createClass_default()(MarketListComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return marketListTemplate;
    }
  }]);

  return MarketListComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/products/components/empty-message.js







function empty_message_createSuper(Derived) { var hasNativeReflectConstruct = empty_message_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function empty_message_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }


var empty_message_btnPrevTemplate = "<div class=\"market-content--fade-in market-content__empty\">\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</div>";

var empty_message_EmptyMessageComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(EmptyMessageComponent, _AbstractComponent);

  var _super = empty_message_createSuper(EmptyMessageComponent);

  function EmptyMessageComponent() {
    classCallCheck_default()(this, EmptyMessageComponent);

    return _super.apply(this, arguments);
  }

  createClass_default()(EmptyMessageComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return empty_message_btnPrevTemplate;
    }
  }, {
    key: "setPrevBtnHandler",
    value: function setPrevBtnHandler(handler) {
      this.getElement().addEventListener("click", handler);
    }
  }]);

  return EmptyMessageComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/products/components/carousel-dots.js







function carousel_dots_createSuper(Derived) { var hasNativeReflectConstruct = carousel_dots_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function carousel_dots_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }


var carouselDotsTemplate = "<div role=\"tablist\" class=\"dots\"></div>";

var carousel_dots_CarouselDotsComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(CarouselDotsComponent, _AbstractComponent);

  var _super = carousel_dots_createSuper(CarouselDotsComponent);

  function CarouselDotsComponent() {
    classCallCheck_default()(this, CarouselDotsComponent);

    return _super.apply(this, arguments);
  }

  createClass_default()(CarouselDotsComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return carouselDotsTemplate;
    }
  }, {
    key: "setPrevBtnHandler",
    value: function setPrevBtnHandler(handler) {
      this.getElement().addEventListener("click", handler);
    }
  }]);

  return CarouselDotsComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/products/controllers/market-list.js















 // Чтобы сделать шаг назад




var market_list_renderListItems = function renderListItems(productListElement, setting, option, products) {
  var createArrayOfProductControllers = function createArrayOfProductControllers(arr) {
    return map_default()(arr).call(arr, function (item) {
      var productController = new list_item_ListItemController(productListElement, setting, option);
      productController.render(item);
      return productController;
    });
  };

  switch (true) {
    case "subCategory" in products:
      return createArrayOfProductControllers(products.subCategory);

    case "productsInCategory" in products:
      return createArrayOfProductControllers(products.productsInCategory);

    default:
      return createArrayOfProductControllers(products);
  }
};

var market_list_getContentViewType = function getContentViewType(currentState, defaultState) {
  var typeView;

  switch (true) {
    case is_array_default()(currentState) && currentState.length == 0:
      typeView = "EMPTY_PAGE";
      break;

    case currentState === defaultState:
      typeView = "MAIN_PAGE";
      break;

    case "subCategory" in currentState:
      typeView = "CATEGORIES_LIST";
      break;

    case "productsInCategory" in currentState:
      typeView = "PRODUCT_LIST";
      break;

    case is_array_default()(currentState):
      typeView = "SEARCH_LIST";
      break;

    default:
      typeView = "PRODUCT_PAGE";
      break;
  }

  return typeView;
};

var market_list_MarketListController = /*#__PURE__*/function () {
  function MarketListController() {
    classCallCheck_default()(this, MarketListController);

    this._container = arguments.length <= 0 ? undefined : arguments[0];
    this._options = arguments.length <= 1 ? undefined : arguments[1];
    this._setting = arguments.length <= 2 ? undefined : arguments[2];
    this._productsControllers = [];
    this._wrap = null;
    this._btnPrevComponent = null;
    this._emptyTextComponent = null;
    this._dotsForCarouselComponent = null;
  }

  createClass_default()(MarketListController, [{
    key: "render",
    value: function render() {
      var _this = this;

      $productList.watch(function (currentState) {
        return _this._onDataChange(currentState);
      });
      $productList.watch(eventsForStore.toMainPage, function (currentState) {
        return _this._onDataChange(currentState);
      });
      eventsForStore.openCartPage.watch(function () {
        if (_this._emptyTextComponent) {
          _this._removeEmptyPage();
        }

        _this._removeProducts();
      }); // Следим за созданием списка поиска

      searchList.watch(function (currentState) {
        return currentState ? _this._onDataChange(currentState) : false;
      }); // Возврат к списку до начала поиска

      eventsForStore.productListToCurrentView.watch(function (currentState) {
        return _this._onDataChange(currentState);
      });
    }
  }, {
    key: "_renderProductList",
    value: function _renderProductList(products) {
      var _context;

      this._wrap = new market_list_MarketListComponent();
      render_render(this._container.getElement(), this._wrap, RenderPosition.BEFOREEND);
      var newProducts = market_list_renderListItems(this._wrap.getElement(), this._setting, this._options, products);
      this._productsControllers = concat_default()(_context = this._productsControllers).call(_context, newProducts);

      this._createCarousel();
    }
  }, {
    key: "_renderEmptyPage",
    value: function _renderEmptyPage() {
      this._emptyTextComponent = new empty_message_EmptyMessageComponent();

      if (this._emptyTextComponent) {
        render_render(this._container.getElement(), this._emptyTextComponent, RenderPosition.BEFOREEND);
      }
    }
  }, {
    key: "_renderPrevBtn",
    value: function _renderPrevBtn() {
      this._btnPrevComponent = new btn_prev_BtnPrevComponent();
      render_render(this._container.getElement(), this._btnPrevComponent, RenderPosition.BEFOREEND);

      this._btnPrevComponent.setPrevBtnHandler(function () {
        var menu = $menu.getState();

        if (whatMenuIsIt(menu, 'Поиск')) {
          eventsForStore.deleteLastMenuItem();
          eventsForStore.clearSearchInput();
          eventsForStore.productListToCurrentView($productList.getState());
        } else {
          var id = menu[menu.length - 2].id;
          var name = menu[menu.length - 2].name;
          eventsForStore.deleteLastMenuItem();
          eventsForStore.findProductsInDefaultProductList({
            id: id,
            name: name
          });
        }
      });
    }
  }, {
    key: "_createCarousel",
    value: function _createCarousel() {
      var _this2 = this;

      // elementReady работает только по классу
      utils_elementReady(this._container.getElement(), ".".concat(this._wrap.getElement().classList[0])).then(function () {
        var _context2;

        var width = reduce_default()(_context2 = _this2._productsControllers).call(_context2, function (acc, item) {
          return acc + item.getComponent().offsetWidth;
        }, 0);

        if (!_this2._dotsForCarouselComponent) {
          _this2._dotsForCarouselComponent = new carousel_dots_CarouselDotsComponent();
          render_render(_this2._container.getElement(), _this2._dotsForCarouselComponent, RenderPosition.AFTERBEGIN);
        }

        Object(carousel_scrollbar["a" /* carousel */])(_this2._options, _this2._container.getElement(), _this2._wrap.getElement(), width);
      });
    }
  }, {
    key: "_onDataChange",
    value: function _onDataChange(currentState) {
      console.log('currentState :', currentState);

      if (this._productsControllers.length > 0) {
        this._removeProducts();
      }

      if (this._emptyTextComponent) {
        this._removeEmptyPage();
      }

      var contentViewType = market_list_getContentViewType(currentState, $productList.defaultState);

      switch (contentViewType) {
        case 'MAIN_PAGE':
          this._renderProductList(currentState);

          break;

        case 'CATEGORIES_LIST':
        case 'PRODUCT_LIST':
        case 'SEARCH_LIST':
          this._renderProductList(currentState);

          this._renderPrevBtn();

          break;

        case 'EMPTY_PAGE':
          this._renderEmptyPage();

          break;

        case 'PRODUCT_PAGE':
          eventsForStore.openProductPage();
      }
    }
  }, {
    key: "_removeProducts",
    value: function _removeProducts() {
      var _context3;

      remove(this._wrap);

      if (this._btnPrevComponent) {
        remove(this._btnPrevComponent);
      }

      if (this._dotsForCarouselComponent) {
        remove(this._dotsForCarouselComponent);
        this._dotsForCarouselComponent = null; // * привязка к классу

        this._container.getElement().classList.remove("market-content--shadow");
      }

      for_each_default()(_context3 = this._productsControllers).call(_context3, function (productController) {
        return productController.destroy();
      });

      this._productsControllers = [];
    }
  }, {
    key: "_removeEmptyPage",
    value: function _removeEmptyPage() {
      remove(this._emptyTextComponent);
    }
  }]);

  return MarketListController;
}();


// CONCATENATED MODULE: ./src/js/market-mvp/cart/components/cart-icon.js









function cart_icon_createSuper(Derived) { var hasNativeReflectConstruct = cart_icon_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function cart_icon_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }



var cart_icon_cartIconTemplate = function cartIconTemplate(data, setting) {
  var _context;

  var dataExist = data.length > 0;
  var iconClass = dataExist ? " market-cart-link__icon-wrap--filled" : "";
  var text = dataExist ? "<div class=\"market-cart-link__text-row\">\n        <span class=\"market-cart-link__price\">".concat(reduce_default()(data).call(data, function (total, item) {
    return total + item.price * item.quantity;
  }, 0).toLocaleString("ru-RU") + " " + setting.currency, "</span>\n      </div>") : "<div class=\"market-cart-link__empty\">\u041A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430</div>";
  return concat_default()(_context = "<div class=\"market-header__cart market-cart-link\">\n    <div class=\"market-cart-link__icon-wrap".concat(iconClass, "\">\n      <div class=\"cart-line-1\"></div>\n      <div class=\"cart-line-2\"></div>\n      <div class=\"cart-line-3\"></div>\n      <div class=\"cart-wheel\"></div>\n    </div>\n    <div class=\"market-cart-link__text\">")).call(_context, text, "</div>\n  </div>");
};

var cart_icon_CartIconComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(CartIconComponent, _AbstractComponent);

  var _super = cart_icon_createSuper(CartIconComponent);

  function CartIconComponent(cart, setting) {
    var _this;

    classCallCheck_default()(this, CartIconComponent);

    _this = _super.call(this);
    _this._cart = cart;
    _this._setting = setting;
    return _this;
  }

  createClass_default()(CartIconComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return cart_icon_cartIconTemplate(this._cart, this._setting);
    }
  }, {
    key: "setProductCount",
    value: function setProductCount() {
      var _context2;

      var quantityAll = reduce_default()(_context2 = this._cart).call(_context2, function (total, item) {
        return total + item.quantity;
      }, 0);

      this.getElement().querySelector(".market-cart-link__icon-wrap").setAttribute("data-before", quantityAll);
    }
  }, {
    key: "setOpenCartClickHandler",
    value: function setOpenCartClickHandler(handler) {
      this.getElement().addEventListener("click", handler);
    }
  }]);

  return CartIconComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/cart/components/cart-page.js









function cart_page_createSuper(Derived) { var hasNativeReflectConstruct = cart_page_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function cart_page_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }



var cart_page_createCartPageTemplate = function createCartPageTemplate(productObject, globalSetting) {
  var dataExist = productObject.length > 0; // Если переданный аргумент содержит элементы, то отрисовываем корзину с этими элементами, ...

  if (dataExist) {
    var _context;

    var totalPrice = reduce_default()(productObject).call(productObject, function (total, item) {
      return total + item.price * item.quantity;
    }, 0).toLocaleString("ru-RU");

    return concat_default()(_context = "<div class=\"market-cart market-content--fade-in\">\n        <div class=\"market-cart__bottom-content\">\n          <div class=\"market-cart__total-price-wrap\">\n            <span>\u041E\u0431\u0449\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C: </span>\n            <span class=\"market-cart__total-price\">".concat(totalPrice, " </span>\n            <span>")).call(_context, globalSetting.currency, "</span>\n          </div>\n          <a class=\"market-cart__link-to-main\">\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0435\u0449\u0451 \u0442\u043E\u0432\u0430\u0440\u044B</a>\n          <button class=\"market-btn market-cart__btn market-cart__btn--order\">\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</button>\n        </div>\n      </div>\n    </div>");
  } // ...иначе отрисовываем пустую корзины
  else {
      return "<div class=\"market-cart market-cart--empty market-content--fade-in\">\n      <div>\u0412\u0430\u0448\u0430 \u043A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430</div>\n      <a class=\"market-cart__link-to-main market-btn\">\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E</a>\n    </div>";
    }
};

var cart_page_CartPageComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(CartPageComponent, _AbstractComponent);

  var _super = cart_page_createSuper(CartPageComponent);

  function CartPageComponent(cart, setting) {
    var _this;

    classCallCheck_default()(this, CartPageComponent);

    _this = _super.call(this);
    _this._cart = cart;
    _this._setting = setting;
    return _this;
  }

  createClass_default()(CartPageComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return cart_page_createCartPageTemplate(this._cart, this._setting);
    }
  }, {
    key: "getTotalPriceElement",
    value: function getTotalPriceElement() {
      return this.getElement().querySelector(".market-cart__total-price");
    }
  }, {
    key: "setToMainBtnOnClickHandler",
    value: function setToMainBtnOnClickHandler(handler) {
      this.getElement().querySelector(".market-cart__link-to-main").addEventListener("click", handler);
    }
  }, {
    key: "setMakeOrderBtnOnClickHandler",
    value: function setMakeOrderBtnOnClickHandler(handler) {
      this.getElement().querySelector(".market-cart__btn--order").addEventListener("click", handler);
    }
  }]);

  return CartPageComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/cart/components/cart-item.js








function cart_item_createSuper(Derived) { var hasNativeReflectConstruct = cart_item_isNativeReflectConstruct(); return function () { var Super = getPrototypeOf_default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf_default()(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn_default()(this, result); }; }

function cart_item_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct_default.a) return false; if (construct_default.a.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct_default()(Date, [], function () {})); return true; } catch (e) { return false; } }



var cart_item_cartProductTemplate = function cartProductTemplate(globalSetting, item) {
  var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9;

  return concat_default()(_context = concat_default()(_context2 = concat_default()(_context3 = concat_default()(_context4 = concat_default()(_context5 = concat_default()(_context6 = concat_default()(_context7 = concat_default()(_context8 = "<div class=\"market-cart__product-content\">  \n    <div class=\"market-cart__img-wrap\">\n      <img src=\"https://media.lpgenerator.ru/images/".concat(globalSetting.userId, "/")).call(_context8, item.img, "\" alt=\"\">\n    </div>\n    <div class=\"market-cart__info-wrap\">\n      <h2 class=\"market-cart__title\">")).call(_context7, item.name, "</h2>\n      ")).call(_context6, item.option ? concat_default()(_context9 = "            \n        <div class=\"market-cart__option-wrap\">\n          <span class=\"market-cart__option-title\">".concat(item.option.optionName, "</span>\n          <span class=\"market-cart__option\">")).call(_context9, item.option.optionValue, "</span>\n        </div>") : "", "\n    </div>\n    <div class=\"market-cart__desc-wrap\">\n      <div class=\"market-cart__product-price-wrap\">\n        <span class=\"market-cart__product-price-title\">\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C:</span>\n        <span class=\"market-cart__product-total-price-wrap\">\n          <span class=\"market-cart__product-total-price\">")).call(_context5, item.price * item.quantity, "</span>\n          <span> ")).call(_context4, globalSetting.currency, "</span>\n        </span>\n        <span class=\"market-cart__total-product-price\">\n          <span class=\"market-cart__price-quantity\">")).call(_context3, item.quantity, "</span>\n          <span> x ")).call(_context2, item.price + " " + globalSetting.currency, "</span>\n        </span>\n      </div>\n      <div class=\"market-cart__quantity-wrap\">\n        <span>\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E:</span>\n        <div class=\"market-cart__quantity-field\">\n          <a class=\"market-cart__quantity-down\"></a>\n          <input type=\"text\" pattern=\"[0-9]\" value=\"")).call(_context, item.quantity, "\" class=\"market-cart__quantity-input\">\n          <a class=\"market-cart__quantity-up\"></a>\n        </div>\n      </div>\n      <div class=\"market-cart__delete-wrap\">\n        <a class=\"market-cart__delete\"></a>\n      </div>\n    </div>\n  </div>");
};

var cart_item_CartItemComponent = /*#__PURE__*/function (_AbstractComponent) {
  inherits_default()(CartItemComponent, _AbstractComponent);

  var _super = cart_item_createSuper(CartItemComponent);

  function CartItemComponent(setting, product) {
    var _this;

    classCallCheck_default()(this, CartItemComponent);

    _this = _super.call(this);
    _this._setting = setting;
    _this._product = product;
    return _this;
  }

  createClass_default()(CartItemComponent, [{
    key: "getTemplate",
    value: function getTemplate() {
      return cart_item_cartProductTemplate(this._setting, this._product);
    }
  }, {
    key: "getQuantityInputElement",
    value: function getQuantityInputElement() {
      return this.getElement().querySelector(".market-cart__quantity-input");
    }
  }, {
    key: "getTotalPriceElement",
    value: function getTotalPriceElement() {
      return this.getElement().querySelector(".market-cart__product-total-price");
    }
  }, {
    key: "getPriceQuantity",
    value: function getPriceQuantity() {
      return this.getElement().querySelector(".market-cart__price-quantity");
    }
  }, {
    key: "setOpenProductHandler",
    value: function setOpenProductHandler(handler) {
      this.getElement().querySelector(".market-cart__title").addEventListener("click", handler);
      this.getElement().querySelector(".market-cart__img-wrap").addEventListener("click", handler);
    }
  }, {
    key: "setQuantityDownHandler",
    value: function setQuantityDownHandler(handler) {
      this.getElement().querySelector(".market-cart__quantity-down").addEventListener("click", handler);
    }
  }, {
    key: "setQuantityInputHandler",
    value: function setQuantityInputHandler(handler) {
      this.getElement().querySelector(".market-cart__quantity-input").oninput = handler;
    }
  }, {
    key: "setQuantityUpHandler",
    value: function setQuantityUpHandler(handler) {
      this.getElement().querySelector(".market-cart__quantity-up").addEventListener("click", handler);
    }
  }, {
    key: "setDeleteProductHandler",
    value: function setDeleteProductHandler(handler) {
      this.getElement().querySelector(".market-cart__delete-wrap").addEventListener("click", handler);
    }
  }]);

  return CartItemComponent;
}(abstract_component_AbstractComponent);


// CONCATENATED MODULE: ./src/js/market-mvp/cart/controllers/cart-item.js






var cart_item_CartItemController = /*#__PURE__*/function () {
  function CartItemController(container) {
    classCallCheck_default()(this, CartItemController);

    this._container = container;
    this._CartItemComponent = null;
  }

  createClass_default()(CartItemController, [{
    key: "render",
    value: function render(setting, product) {
      var _this = this;

      this._CartItemComponent = new cart_item_CartItemComponent(setting, product);

      render_render(this._container, this._CartItemComponent, RenderPosition.AFTERBEGIN);

      var id = product.id;
      var name = product.name;

      var quantityInput = this._CartItemComponent.getQuantityInputElement();

      var price = this._CartItemComponent.getTotalPriceElement();

      var quantityText = this._CartItemComponent.getPriceQuantity(); // Открытие страницы с продуктом


      this._CartItemComponent.setOpenProductHandler(function () {
        eventsForStore.closeCartPage();
        eventsForStore.createMenuPath({
          id: id,
          name: name
        });
        eventsForStore.findProductsInDefaultProductList({
          id: id,
          name: name
        });
        eventsForStore.openProductPage();
      });

      this._CartItemComponent.setQuantityDownHandler(function () {
        // Изначальное значение инпута
        var initialValue = quantityInput.value; // Уменьшаем его

        quantityInput.value--; // Проверяем допустимость изменения

        _this._checkInputValue(quantityInput); // Если изменилось


        if (initialValue !== quantityInput.value) {
          quantityText.textContent = quantityInput.value;
          price.textContent = product.price * quantityInput.value;
          eventsForStore.updateQuantityOfProductInCart({
            product: product,
            quantityUp: false
          });
        }
      });

      this._CartItemComponent.setQuantityInputHandler(function () {
        return _this._checkInputValue(quantityInput);
      });

      this._CartItemComponent.setQuantityUpHandler(function () {
        quantityInput.value++;
        quantityText.textContent = quantityInput.value;
        price.textContent = product.price * quantityInput.value;
        eventsForStore.updateQuantityOfProductInCart({
          product: product
        });
      });

      this._CartItemComponent.setDeleteProductHandler(function () {
        eventsForStore.deleteProductInCart(product);
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      remove(this._CartItemComponent);
    }
  }, {
    key: "_checkInputValue",
    value: function _checkInputValue(input) {
      // Если первый символ ноль
      if (input.value[0] === '0') {
        input.value = 1;
      } // Если ввод пустой


      if (input.value === '') {
        input.value = 1;
      } // Зачем-то ещё одна проверка (пока делал, забыл какой баг был)


      if (input.value < '0' || input.value > '9') {
        input.value = 1;
      } // Запрещаем ввод букв


      input.value = input.value.replace(/\D/g, '');
    }
  }]);

  return CartItemController;
}();


// CONCATENATED MODULE: ./src/js/market-mvp/cart/controllers/cart.js














var cart_renderProducts = function renderProducts(container, setting, products) {
  return map_default()(products).call(products, function (item) {
    var productController = new cart_item_CartItemController(container);
    productController.render(setting, item);
    return productController;
  });
};

var cart_CartController = /*#__PURE__*/function () {
  function CartController() {
    var _context, _context2;

    classCallCheck_default()(this, CartController);

    this._header = arguments.length <= 0 ? undefined : arguments[0];
    this._container = arguments.length <= 1 ? undefined : arguments[1];
    this._setting = arguments.length <= 2 ? undefined : arguments[2];
    this._cartIconComponent = null;
    this._cartPageComponent = null;
    this._showedCartProductsComponent = [];
    this._removeProduct = bind_default()(_context = this._removeProduct).call(_context, this);
    this._changeTotalPrice = bind_default()(_context2 = this._changeTotalPrice).call(_context2, this);
  }

  createClass_default()(CartController, [{
    key: "render",
    value: function render() {
      var _this = this;

      // Обновляем иконку корзины
      $cart.watch(function (state) {
        return _this._updateIcon(state);
      }); // Обновляем страницу корзины при удалении товара

      $cart.watch(eventsForStore.deleteProductInCart, function (state) {
        return _this._renderCartPage(state);
      });
      $cart.watch(eventsForStore.updateQuantityOfProductInCart, function (state) {
        return _this._changeTotalPrice(state);
      });
      eventsForStore.openCartPage.watch(function () {
        eventsForStore.clearSearchInput();
        eventsForStore.disabledSearch();
        eventsForStore.createCartMenu();

        _this._renderCartPage($cart.getState());
      });
      eventsForStore.closeCartPage.watch(function () {
        eventsForStore.enabledSearch();

        _this._removeCartPage();
      });
    }
  }, {
    key: "_updateIcon",
    value: function _updateIcon(cartData) {
      if (this._cartIconComponent) {
        remove(this._cartIconComponent);
      }

      this._cartIconComponent = new cart_icon_CartIconComponent(cartData, this._setting);
      render_render(this._header.getElement(), this._cartIconComponent, RenderPosition.BEFOREEND);

      this._cartIconComponent.setProductCount();

      this._cartIconComponent.setOpenCartClickHandler(function () {
        eventsForStore.openCartPage();
      });
    }
  }, {
    key: "_renderCartPage",
    value: function _renderCartPage(cartData) {
      if (this._cartPageComponent) {
        remove(this._cartPageComponent);
      }

      this._cartPageComponent = new cart_page_CartPageComponent(cartData, this._setting);
      render_render(this._container.getElement(), this._cartPageComponent, RenderPosition.BEFOREEND);

      this._cartPageComponent.setToMainBtnOnClickHandler(function () {
        eventsForStore.toMainPageFromCart();
      });

      if (cartData.length > 0) {
        var _context3;

        var newProducts = cart_renderProducts(this._cartPageComponent.getElement(), this._setting, cartData);
        this._showedCartProductsComponent = concat_default()(_context3 = this._showedCartProductsComponent).call(_context3, newProducts);

        this._cartPageComponent.setMakeOrderBtnOnClickHandler(function () {
          var getOrderList = function getOrderList(arr) {
            var order = [];

            map_default()(arr).call(arr, function (item) {
              var product = {
                name: item.name,
                count: item.quantity,
                price: item.price
              };

              if (item.option !== undefined) {
                product.optionName = item.option.optionName.replace(/:/, "");
                product.optionValue = item.option.optionValue;
              }

              return order.push(product);
            });

            return order;
          };

          var orderList = getOrderList($cart.getState());

          var totalPrice = reduce_default()(orderList).call(orderList, function (priceAcc, product) {
            return priceAcc + product.count * product.price;
          }, 0); // Коллбек на отправку заказа


          eventsForStore.sendOrder({
            orderList: orderList,
            totalPrice: totalPrice
          });
        });
      }
    }
  }, {
    key: "_changeTotalPrice",
    value: function _changeTotalPrice(cart) {
      var totalPrice = reduce_default()(cart).call(cart, function (total, item) {
        return total + item.price * item.quantity;
      }, 0).toLocaleString("ru-RU");

      this._cartPageComponent.getTotalPriceElement().textContent = totalPrice;
    }
  }, {
    key: "_removeProduct",
    value: function _removeProduct() {
      var _context4;

      for_each_default()(_context4 = this._showedCartProductsComponent).call(_context4, function (productController) {
        return productController.destroy();
      });

      this._showedCartProductsComponent = [];
    }
  }, {
    key: "_removeCartPage",
    value: function _removeCartPage() {
      remove(this._cartPageComponent);
    }
  }]);

  return CartController;
}();


// CONCATENATED MODULE: ./src/js/market-mvp/main.js












 // TODO: кнопка быстрой покупки. По-умолчанию: на страницу корзины. Если опция кастомной быстрой покупки, то через колбек.
// TODO: сделать опцию, чтобы отобразить опции как селект
// TODO: количество доступного товара. В том числе и отдельных опций
// TODO: где хранить сохранять значение текущего кол-ва товара?
// TODO: круто было бы на сервере сохранять список всех товаров.
// Новое:
// 1. Кнопка быстрого добалвения в корзину
// 2. Кнопка быстрой покупки (опционально)
// 3. Открытие страницы товара из корзины
// 4. Кнопка назад на поиске
// 5. Анимация добавления в корзину из списка
// Архитектурные изменения:
// 1. Реализован паттерн MVP.
// 2. Использован стейт-менеджер эфектор.
// 3. Для отрисовки магазина, нужен только один тег на странице.
// DREAMS:
// TODO: 1. сделать навигацию по кнопкам назад, когда мышка над магазином. А как историю писать?
// TODO: возвращаться к результатам поиска. - Пока не получится, потому что сломается поиск, ведь он работает по текущему виду. Плюс инпут очищается при переходе по списку.
// TODO:

var main_Market = /*#__PURE__*/function () {
  function Market(element, setting, products, option) {
    var _this = this;

    classCallCheck_default()(this, Market);

    this.container = document.querySelector("".concat(element));
    this._setting = JSON.parse(setting);
    this._products = awaitProducts(JSON.parse(products));
    this._options = assign_default()({
      horizontalScroll: true,
      oneClickOrder: true,
      oneClickOrderCustom: false
    }, option);
    awaitProducts.done.watch(function () {
      _this._init();
    });
  }

  createClass_default()(Market, [{
    key: "_init",
    value: function _init() {
      var header = new header_HeaderComponent();
      render_render(this.container, header, RenderPosition.BEFOREEND);
      var inputSearch = new controller_search_input_SearchInputController(header);
      inputSearch.render();
      var menuController = new controller_menu_MenuController(header);
      menuController.render();
      var mainContent = new main_content_MainContentComponent();
      render_render(this.container, mainContent, RenderPosition.BEFOREEND);
      var productListController = new market_list_MarketListController(mainContent, this._options, this._setting);
      productListController.render(); // Страница и значок корзины

      var cartController = new cart_CartController(header, mainContent, this._setting);
      cartController.render(); // Инициаоизируем сейчас - отрисовываем потом

      new product_page_ProductPageController(mainContent, this._setting);
    }
  }, {
    key: "sendOrder",
    value: function sendOrder(fn) {
      eventsForStore.sendOrder.watch(fn);
    }
  }, {
    key: "oneClickOrder",
    value: function oneClickOrder(fn) {
      eventsForStore.oneClickOrder.watch(fn);
    }
  }]);

  return Market;
}();

new main_Market('.market', '{"userId": "557933","currency": "₽"}', '[{"id":1,"name":"Футболки","img":"1.png","subCategory":[{"id":2,"name":"Крутые","img":"1.png","productsInCategory":[{"id":3,"name":"Крутая первая","price":"1200","img":"1.png","active":true,"desc":"Состав: чистая крутость<br />Ваще круть","options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":4,"name":"Крутая вторая","price":"1300","img":"2.png"}]},{"id":5,"name":"Не оч крутые","img":"2.png","productsInCategory":[{"id":6,"name":"Ну такая первая","price":"800","img":"1.png","active":true,"desc":"Состав: посредственность<br />Пойдёт","options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"800"}]}}]}]},{"id":7,"name":"Толстковки","img":"1.png","subCategory":[{"id":8,"name":"Крутые2","img":"1.png","subCategory":[{"id":9,"name":"Крутые3","img":"1.png","productsInCategory":[{"id":10,"name":"Крутая первая толст","price":"1200","img":"1.png","desc":"Состав: чистая крутость<br />Ваще круть","active":true,"options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":11,"name":"Крутая вторая толст","price":"1300","img":"2.png","active":true}]}]},{"id":12,"name":"Не оч крутыеТол","img":"2.png","productsInCategory":[{"id":13,"name":"Ну такая первая","price":"800","img":"1.png","desc":"Состав: посредственность<br />Пойдёт","active":true,"options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"1800"}]}}]}]},{"id":14,"name":"Суперск","price":"6000","img":"1.png","active":true},{"id":15,"name":"Ееее","price":"200","img":"2.png","desc":"Состав: ееее.<br />Ееее ее е ееее.","active":true,"options":{"nameOptionList":"Е","optionList":[{"е":false,"price":"200"},{"ее":true,"price":"300"},{"еее":true,"price":"800"}]}}]', {
  horizontalScroll: true
}).sendOrder(function (order) {
  console.log('orderList :', order.orderList);
  console.log('totalPrice :', order.totalPrice);
});
// EXTERNAL MODULE: ./src/styles/market.scss
var market = __webpack_require__(279);

// CONCATENATED MODULE: ./src/market-mvp.js
// require.context("./img/", true, /\.(gif|png|jpe?g|svg)$/i);
// import "core-js";
// import "regenerator-runtime/runtime";





 // import 'effector/effector.es'

 // import 'normalize.css'



/***/ })
/******/ ]);