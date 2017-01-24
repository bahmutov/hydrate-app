'use strict'

var isGoodEnvironment = require('./env')
var bottle = isGoodEnvironment()
  ? require('./bottle') : require('./fake-bottle')
bottle.open()
module.exports = bottle
