var test      = require('tape'),
    eventuate = require('..')

test('eventuate filter forEach chain', function (t) {
  t.plan(6)
  var event = eventuate()

  var oddEvents = event.filter(odd)
  oddEvents.forEach(function (num) {
    t.equal(num % 2, 1)
  })

  t.ok(event.hasConsumer(), 'event has consumer')
  event.produce(1)
  event.produce(2)
  event.produce(3)
  event.produce(4)
  event.produce(5)

  oddEvents.destroy()
  t.notOk(event.isDestroyed(), 'event is not destroyed')
  t.notOk(event.hasConsumer(), 'event has no consumer after stopping handler')

  function odd (num) {
    return num % 2 === 1
  }
})

test('eventuate filter next chain', function (t) {
  t.plan(3)
  var event = eventuate()

  event.filter(odd).next(function (_, num) {
    t.equal(num % 2, 1)
  })

  t.ok(event.hasConsumer(), 'event has consumer')
  event.produce(1)
  event.produce(2)
  event.produce(3)

  t.notOk(event.hasConsumer(), 'event has no consumer after next resolves')

  function odd (num) {
    return num % 2 === 1
  }
})
