const puppeteer = require('puppeteer')
const fs = require('fs')
const fsPath = require('path')
const fsPromises = require('fs/promises')



// The main process for generating an index of targets.
async function buildTocNav (outputFormat) {
  'use strict'

  // Initialise an array that will store an index
  // or 'database' of the book-index targets.
  const tocObj = {
    toc: []
  }

  // Get the store.
  // TODO: READ THIS FROM FORMAT FILE LIST
  const searchStore = require(process.cwd() +
    '/_site/assets/js/search-engine.js').store

  // Launch the browser.
  const browser = await puppeteer.launch({ headless: true })

  let i
  let count = 0
  for (i = 0; i < searchStore.length; i += 1) {
    const path = process.cwd() + '/_site/' + searchStore[i].url

    // Get the filename from the path.
    // const file = path.split('/').pop().split('.')[0]
    // console.log('FILENAME', file)

    // User feedback
    console.log('Getting TOC items in ' + path)

    // Open a new tab.
    const page = await browser.newPage()

    // Set debug to true to return any browser-console
    // messages to the Node console.
    const debug = true
    if (debug === true) {
      page.on('console', function (consoleObj) {
        console.log(consoleObj.text())
      })
    }

    // Go to the page path.
    // Puppeteer requires the protocol (file://) on unix.
    await page.goto('file://' + path)

    // Note: we can only pass serialized data
    // back to the parent process.
    let tocEntries = await page.evaluate(function () {
      // For each page, we first want to get all of the relevant headings
      const headingLevels = ['h1', 'h2']
      const allHeadings = document.querySelectorAll(headingLevels.join(', '))

      const file = window.location.href.split('/').pop().split('.')[0]

      // Object for holding this page's info
      const pageObj = {}
      const pageList = []

      // Then we need to travel down the list of headings
      for (let i = 0; i < allHeadings.length; i++) {
        const heading = allHeadings[i]
        const id = heading.id
        const label = heading.innerHTML

        const dataObj = {
          file: file,
          id: id,
          label: label
        }

        const thisLevel = parseInt(heading.nodeName[1])

        if (allHeadings[i + 1]) {
          const nextLevel = parseInt(allHeadings[i + 1].nodeName[1])
          if (thisLevel + 1 === nextLevel) {
            dataObj.children = []
          }
        }

        if (allHeadings[i - 1]) {
          const prevLevel = parseInt(allHeadings[i - 1].nodeName[1])
        }
        pageList.push(dataObj)
      }

      // Now we have a list of objects, some of which have a children: [] field

      pageList.reduce((pageObj, thisEntry, thisIndex) => {
        if ()
      }, {})

      pageObj.toc = pageList

      return JSON.stringify(pageObj)
    })

    tocEntries = JSON.parse(tocEntries)
    console.log(tocEntries)

    // // Add the entries to the master index,
    // // if there are any.
    if (tocEntries.toc.length > 0) {
      tocObj.toc.push(tocEntries)
    }

    // Increment counter.
    count += 1

    // Close the page when we're done.
    await page.close()
  }

  // If we've got all the pages, close the Puppeteer browser.
  if (count === searchStore.length) {
    browser.close()
  }

  console.log(tocObj)

  // Create empty output file to write to, if it doesn't exist
  const outputFilePath = fsPath.normalize(process.cwd() +
      '/_output/toc.yml')
  if (!fs.existsSync(outputFilePath)) {
    console.log('Creating ' + outputFilePath)
    await fsPromises.writeFile(outputFilePath, '')
  }

  // Write to the output file
  fs.writeFile('/_output/toc.yml',
    'yaml output',
    function () {
      console.log('Writing ' + outputFilePath)
      console.log('Done.')
    }
  )
}

// Run the rendering process.
module.exports = buildTocNav
