var defineError = require('define-error'),
    assign      = require('object-assign')

module.exports.UnconsumedEventError = defineError('UnconsumedEventError', assignData)

function assignData (_, data) {
    assign(this, data)
}
