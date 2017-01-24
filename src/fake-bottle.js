function noop () {}
var fakeBottle = {
  refill: noop,
  drink: noop,
  open: noop,
  recycle: noop
}
module.exports = fakeBottle
