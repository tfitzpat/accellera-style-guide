// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const helpers = require('../helpers/helpers')

// Exports

exports.command = 'toc'
exports.desc = 'Build the TOC for this book'
exports.handler = function (argv) {
  'use strict'

  console.log('Building TOC')
  helpers.toc(argv)
}
