// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const helpers = require('../helpers/helpers')

// Exports

exports.command = 'numbering'
exports.desc = 'Numbering sections in the book'
exports.handler = function (argv) {
  'use strict'

  helpers.renderNumbering(argv)
}
