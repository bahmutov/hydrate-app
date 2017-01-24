(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["bottle"] = factory();
	else
		root["bottle"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var isGoodEnvironment = __webpack_require__(1)
	var bottle = isGoodEnvironment()
	  ? __webpack_require__(2) : __webpack_require__(5)
	bottle.open()
	module.exports = bottle


/***/ },
/* 1 */
/***/ function(module, exports) {

	function isFunction (x) {
	  return typeof x === 'function'
	}

	function isGoodEnvironment () {
	  return window.localStorage &&
	    isFunction(window.localStorage.getItem) &&
	    isFunction(Function.prototype.bind)
	}

	module.exports = isGoodEnvironment


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	function noop () {}

	var display = (function initDisplay () {
	  var tinyToast = __webpack_require__(3)
	  var tinyOverlay = __webpack_require__(4)

	  return {
	    message: tinyToast,
	    overlay: {
	      show: function show (text) {
	        tinyOverlay.show()
	        if (text) {
	          tinyToast.show(text)
	        }
	      },
	      hide: tinyOverlay.hide
	    }
	  }
	}())

	function getBottle (selectId, verbose, verboseUi) {
	  var log = verbose ? console.log.bind(console) : noop

	  function formDrySelectorId (id) {
	    return 'dry-' + id
	  }

	  var dryId = formDrySelectorId(selectId)

	  /* global localStorage */

	  var storageId = 'bottle-' + selectId

	  return {
	    // clears any saved HTML
	    recycle: function recycle () {
	      localStorage.removeItem(storageId)
	      log('removed HTML from localStorage')
	      if (verboseUi) {
	        display.message.show('Cleared storage')
	        display.message.hide(1000)
	      }
	    },
	    // saves HTML snapshot for a given module
	    refill: function refill (defer) {
	      function refillBottle () {
	        var html = document.getElementById(selectId).outerHTML
	        localStorage.setItem(storageId, html)
	        log('poured', selectId, html.substr(0, 20) + '...')
	      }

	      if (defer) {
	        setTimeout(refillBottle, 0)
	      } else {
	        refillBottle()
	      }
	      // if (verboseUi) {
	      //   display.message.show('Saved application UI')
	      //   display.message.hide(1000)
	      // }
	    },
	    // takes saved HTML snapshot and creates
	    // a temporary static DOM, allowing real app
	    // to load in hidden mode
	    open: function open () {
	      log('opening', selectId)
	      if (verboseUi) {
	        display.overlay.show('Web application is loading ...')
	      }

	      var html = localStorage.getItem(storageId)
	      if (html) {
	        html = html.replace('id="' + selectId + '"',
	          'id="' + dryId + '"')
	        var el = document.getElementById(selectId)
	        el.insertAdjacentHTML('beforebegin', html)
	        el.style.visibility = 'hidden'
	        el.style.display = 'none'
	      }
	    },
	    // when application is ready, replaces the static
	    // DRY content with fully functioning application
	    drink: function drink () {
	      log('drinking', selectId)
	      if (verboseUi) {
	        display.message.show('Web application is running')
	        display.overlay.hide()
	        display.message.hide(1000)
	      }

	      var dryEl = document.getElementById(dryId)
	      if (dryEl) {
	        dryEl.parentNode.removeChild(dryEl)
	      }
	      var appEl = document.getElementById(selectId)
	      appEl.style.visibility = ''
	      appEl.style.display = ''
	      appEl.classList.remove('hidden')
	    }
	  }
	}

	var bottle = (function initBottle () {
	  function findAttribute (attributes, name) {
	    var found
	    Array.prototype.some.call(attributes, function (attr) {
	      if (attr.name === name) {
	        found = attr
	        return found
	      }
	    })
	    return found && found.value
	  }

	  var scripts = document.querySelectorAll('script')
	  var lastScript = scripts[scripts.length - 1]

	  var id = findAttribute(lastScript.attributes, 'id') || 'app'
	  var verbose = findAttribute(lastScript.attributes, 'verbose') === 'true'
	  var verboseUi = findAttribute(lastScript.attributes, 'verbose-ui') === 'true'

	  var bottle = getBottle(id, verbose, verboseUi)

	  var shouldHydrateName = findAttribute(lastScript.attributes, 'on')
	  if (shouldHydrateName) {
	    if (!window[shouldHydrateName]) {
	      bottle.open = bottle.drink = noop
	    }
	  }
	  return bottle
	}())

	// you can open a bottle right away
	// bottle.open()
	module.exports = bottle


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict'

	var tinyToast

	function createCssStyleSheet () {
	  // code taken from
	  // https://davidwalsh.name/add-rules-stylesheets
	  const style = document.createElement('style')
	  // WebKit hack :(
	  // style.appendChild(document.createTextNode(''))
	  document.head.appendChild(style)
	  return style.sheet
	}

	function insertStyle (className, sheet, style) {
	  // insert a rule for each style property
	  Object.keys(style).forEach((key) => {
	    const value = style[key]
	    sheet.insertRule(`.${className} { ${key}: ${value} }`, 0)
	  })
	}

	function createTinyToastStyle () {
	  const className = 'tinyToast'
	  const style = {
	    color: '#333',
	    position: 'fixed',
	    bottom: '0em',
	    right: '1em',
	    'background-color': '#7FFFD4',
	    'border-radius': '5px',
	    'border-width': '1px',
	    'border-color': '#73E1BC',
	    'border-style': 'solid',
	    padding: '1em 2em',
	    'z-index': 1000
	  }

	  const sheet = createCssStyleSheet()
	  insertStyle(className, sheet, style)
	  return className
	}

	function createDom () {
	  if (tinyToast) {
	    return tinyToast
	  }

	  const className = createTinyToastStyle()

	  tinyToast = document.createElement('h3')
	  tinyToast.classList.add(className)
	  document.body.appendChild(tinyToast)
	  return tinyToast
	}

	function createMessage (text) {
	  createDom().textContent = text
	}

	function closeMessage () {
	  if (tinyToast) {
	    document.body.removeChild(tinyToast)
	    tinyToast = null
	  }
	}

	function maybeDefer (fn, timeoutMs) {
	  if (timeoutMs) {
	    setTimeout(fn, timeoutMs)
	  } else {
	    fn()
	  }
	}

	function hide (timeoutMs) {
	  maybeDefer(closeMessage, timeoutMs)
	}

	var tinyToastApi = {
	  show: function show (text) {
	    createMessage(text)
	    return tinyToastApi
	  },
	  hide: hide
	}

	module.exports = tinyToastApi


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict'

	var tinyOverlay

	function createDom () {
	  if (tinyOverlay) {
	    return tinyOverlay
	  }

	  tinyOverlay = document.createElement('div')
	  var style = tinyOverlay.style
	  style.width = '100%'
	  style.height = '100%'
	  style.opacity = 0.5
	  style.position = 'fixed'
	  style.left = 0
	  style.top = 0
	  style.backgroundColor = 'hsla(187, 100%, 42%, 0.12)'
	  document.body.appendChild(tinyOverlay)
	  return tinyOverlay
	}

	function close () {
	  if (tinyOverlay) {
	    document.body.removeChild(tinyOverlay)
	    tinyOverlay = null
	  }
	}

	function maybeDefer (fn, timeoutMs) {
	  if (timeoutMs) {
	    setTimeout(fn, timeoutMs)
	  } else {
	    fn()
	  }
	}

	var tinyOverlayApi = {
	  show: createDom,
	  hide: function (timeoutMs) {
	    maybeDefer(close, timeoutMs)
	  }
	}

	module.exports = tinyOverlayApi


/***/ },
/* 5 */
/***/ function(module, exports) {

	function noop () {}
	var fakeBottle = {
	  refill: noop,
	  drink: noop,
	  open: noop,
	  recycle: noop
	}
	module.exports = fakeBottle


/***/ }
/******/ ])
});
;