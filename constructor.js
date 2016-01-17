var assign   = require('object-assign'),
    core     = require('eventuate-core')

module.exports = Eventuate
assign(Eventuate, {
  isEventuate: core.isEventuate
})
assign(Eventuate.prototype, core.constructor.prototype, {
  constructor: Eventuate,
  filter     : filter,
  map        : map,
  reduce     : reduce,
  forEach    : forEach,
  next       : next,
  last       : last
})

var evFilter = require('eventuate-filter')(Eventuate),
    evMap    = require('eventuate-map')(Eventuate),
    evReduce = require('eventuate-reduce')(Eventuate),
    evNext   = require('eventuate-next'),
    evLast   = require('eventuate-last')

function Eventuate (options) {
  core.constructor.call(this, options)
}

function filter (options, filterFunc) {
  return evFilter(this, options, filterFunc)
}

function map (options, mapFunc) {
  return evMap(this, options, mapFunc)
}

function reduce (options, reducerFunc, init) {
  return evReduce(this, options, reducerFunc, init)
}

function forEach (consumer, errorConsumer) {
  return this.consume(consumer, errorConsumer)
}

function next (cb) {
  return evNext(this, cb)
}

function last (cb) {
  return evLast(this, cb)
}
