const puppeteer = require('puppeteer')
const fs = require('fs')
const fsPath = require('path')
const fsPromises = require('fs/promises')



// The main process for generating the TOC.
async function buildTOC (outputFormat, bookDirectory) {
  'use strict'

  // Initialise an object that will store the
  // TOC in JSON format
  const tocObj = {
    toc: []
  }

  // TODO: REFINE THIS FILE LIST
  // There's a filelist method in helpers that'll be enought for a prototype

  // Get the store. We do this here, not at the top,
  // so that it'll get required after it's freshly built
  // by Jekyll. I.e. not the _site from the last build.
  const searchStore = require(process.cwd() +
    '/_site/assets/js/search-engine.js').store

  // Launch the browser.
  const browser = await puppeteer.launch({ headless: true })

  let i
  let count = 0
  for (i = 0; i < searchStore.length; i += 1) {
    const path = process.cwd() + '/_site/' + searchStore[i].url

    // Get the filename from the path.
    const filename = path.split('/').pop().replace('.html', '')

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
      //
      function nest (data, parentLevel = 1) {
        return data.reduce((arr, element) => {
          const obj = Object.assign({}, element)
          if (parentLevel + 1 === element.level) {
            const children = nest(data, element.level)
            if (children.length) obj.children = children
          }
          arr.push(obj)
          return arr
        }, [])
      }

      // TODO: Call this in from args or maybe settings?
      const headings = 'h1, h2'
      const headingLevels = headings.replace(/\s/g, '').split(',').sort()

      const headingElements = Array.from(document.querySelectorAll(headings))

      // map headingElements to something easier to digest
      const objectArray = headingElements.map(function (element) {
        return {
          id: element.id,
          label: element.innerText,
          level: parseInt(element.nodeName[1])
        }
      })

      // console.log(JSON.stringify(objectArray))

      // then we process this using our fancy function
      const newArray = nest(objectArray, 1)
      // console.log(JSON.stringify(newArray))
      return JSON.stringify(newArray)
    })

    tocEntries = JSON.parse(tocEntries)
    tocEntries.forEach(function (entry) {
      entry.file = filename
    })

    tocObj.toc.push(tocEntries)

    // Increment counter.
    count += 1

    // Close the page when we're done.
    await page.close()
  }

  // If we've got all the pages, close the Puppeteer browser.
  if (count === searchStore.length) {
    browser.close()
  }

  console.log(JSON.stringify(tocObj))

  // Create empty TOC file to write to, if it doesn't exist
  const TOCFilePath = fsPath.normalize(process.cwd() +
      '/output/' + bookDirectory + '/book-toc-' + outputFormat + '.yml')
  if (!fs.existsSync(TOCFilePath)) {
    console.log('Creating ' + TOCFilePath)
    await fsPromises.writeFile(TOCFilePath, '')
  }

  // Write the file.
  fs.writeFile('/output/' + bookDirectory + '/book-toc-' + outputFormat + '.yml',
    JSON.stringify(tocObj),
    function () {
      console.log('Writing ' + TOCFilePath)
      console.log('Done.')
    }
  )
}

// Run the rendering process.
module.exports = buildTOC
