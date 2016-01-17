var assign    = require('object-assign'),
    Eventuate = require('./constructor'),
    fromArray = require('eventuate-from-array')

module.exports = eventuateFactory
assign(eventuateFactory, {
  constructor: Eventuate,
  isEventuate: Eventuate.isEventuate,
  from       : from
})

function eventuateFactory (options) {
  Eventuate.call(assign(eventuate, Eventuate.prototype, {
    factory: eventuateFactory
  }), options)
  return eventuate

  function eventuate (consumer, errConsumer) {
    return eventuate.consume(consumer, errConsumer)
  }
}

function from (obj) {
  if (Array.isArray(obj)) {
    return fromArray(eventuateFactory, obj)
  }
  else {
    throw new TypeError('unable to create eventuate from ' + (typeof obj))
  }
}
