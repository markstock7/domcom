module.exports = dc = require('./dc')

if typeof window != 'undefined'
  window.dc = dc

dc.DomNode = require('./DomNode')

dc.extend = extend = require('extend')

dc.EventMixin = require('./dc-event')

extend(dc, dc.flow = require('lazy-flow'))

require('lazy-flow/addon')

dc.bindings = dc.flow.bindings

require('dc-watch-list')

extend(dc,

  require('dc-util'),

  require('./config'),

  require('./dom-util'),
  require('./dc-update'),

  # component
  require('./core/index'),

  require('./dc-error')
)

extend(dc, dc.builtinDirectives = require('./directives/index'))

extend(dc,
  require('./core/property/delegate-event'),
  require('./core/property/css-arith')
)


