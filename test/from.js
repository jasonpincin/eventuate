var test      = require('tape'),
    eventuate = require('..')

test('from array produces all elements', function (t) {
  t.plan(2)
  var numbers = eventuate.from([1, 2, 3, 4, 5]),
      total   = 0

  numbers.consume(function (n) {
    total += n
  }).then(function () {
    t.equal(total, 15)
    t.ok(numbers.isDestroyed(), 'source is destroyed')
  })
})
