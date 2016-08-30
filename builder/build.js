var Vulcanize = require('vulcanize')
var fs = require('fs')
var path = require('path')

var vulcan = new Vulcanize({
  excludes: ['./styles/*'],
  inlineScripts: true,
  inlineCss: true,
  implicitStrip: false,
})

vulcan.process(path.resolve(__dirname, '../index.html'), (err, html) => fs.writeFile('dist.html', html))