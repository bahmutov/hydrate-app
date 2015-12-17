'use strict'

var tinyToast = require('tiny-toast')

function noop () {}

function getBottle (selectId, verbose, verboseUi) {
  var log = verbose ? console.log.bind(console) : noop

  function formDrySelectorId (id) {
    return 'dry-' + id
  }

  var dryId = formDrySelectorId(selectId)

  // TODO factor out into separate module
  var display = (function initOverlay () {
    var overlay

    function createOverlay () {
      if (overlay) {
        return
      }

      overlay = document.createElement('div')
      var style = overlay.style
      style.width = '100%'
      style.height = '100%'
      style.opacity = 0.5
      style.position = 'fixed'
      style.left = 0
      style.top = 0
      style.backgroundColor = 'hsla(187, 100%, 42%, 0.12)'
      document.body.appendChild(overlay)
    }

    function closeOverlay () {
      if (overlay) {
        document.body.removeChild(overlay)
        overlay = null
      }
    }

    return {
      message: tinyToast,
      overlay: {
        show: function show (text) {
          createOverlay()
          if (text) {
            tinyToast.show(text)
          }
        },
        hide: function hide (timeoutMs) {
          if (timeoutMs) {
            setTimeout(closeOverlay, timeoutMs)
          } else {
            closeOverlay()
          }
        }
      }
    }
  }())

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

bottle.open()
module.exports = bottle
