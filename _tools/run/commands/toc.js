// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// This file is called 'reindex.js' to avoid confusion
// with a conventional entry-point 'index.js' file.

// Modules

const helpers = require('../helpers/helpers')

// Exports

exports.command = 'toc'
exports.desc = 'Build TOC'
exports.handler = function (argv) {
  'use strict'

  console.log('Building TOC for ' + argv.format + '\n' +
    'Remember to build TOC separately for each output format.')
  helpers.outputTOC(argv)
}
