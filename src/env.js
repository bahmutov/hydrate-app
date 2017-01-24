function isFunction (x) {
  return typeof x === 'function'
}

function isGoodEnvironment () {
  return window.localStorage &&
    isFunction(window.localStorage.getItem) &&
    isFunction(Function.prototype.bind)
}

module.exports = isGoodEnvironment
