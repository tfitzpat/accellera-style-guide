const puppeteer = require('puppeteer')
const fs = require('fs')
const fsPath = require('path')
const fsPromises = require('fs/promises')
const yaml = require('js-yaml')

// The main process for generating TOC YAML
async function buildTocNav (outputFormat, headingLevels) {
  'use strict'

  const tocObj = {
    l1: {
      l2: {
        toc: []
      }
    }
  }

  // Get the store.
  const searchStore = require(process.cwd() +
    '/_site/assets/js/search-engine.js').store

  // Launch the browser.
  const browser = await puppeteer.launch({ headless: true })

  let i
  let count = 0
  for (i = 0; i < searchStore.length; i += 1) {
    const path = process.cwd() + '/_site/' + searchStore[i].url

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
    const tocEntries = await page.evaluate(function (headingLevels) {
      const allHeadings = document.querySelectorAll(headingLevels.join(', '))

      const file = window.location.href.split('/').pop().split('.')[0]

      // Object for holding this page's info
      let pageObj = {}
      const pageList = []

      // Then we need to travel down the list of headings
      for (let i = 0; i < allHeadings.length; i++) {
        const heading = allHeadings[i]
        const id = heading.id
        const label = heading.innerHTML
        const thisLevel = parseInt(heading.nodeName[1])

        const dataObj = {
          file: `${file}`,
          id: `${id}`,
          label: `${label}`,
          level: thisLevel
        }

        pageList.push(dataObj)
      }

      const outputList = pageList.reduce((arr, { level, ...rest }) => {
        const value = { ...rest, children: [] }
        arr[level] = value.children
        arr[level - 1].push(value)
        return arr
      }, [[]]).shift()

      pageObj = { ...pageObj, ...outputList[0] }

      return pageObj
    }, headingLevels)

    // Add the entries to the master index, if there are any.
    if (Object.keys(tocEntries).length !== 0) {
      tocObj.l1.l2.toc.push(tocEntries)
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

  // Create empty output file to write to, if it doesn't exist
  const outputFilePath = fsPath.normalize(process.cwd() +
      '/_output/toc.yml')
  if (!fs.existsSync(outputFilePath)) {
    console.log('Creating ' + outputFilePath)
    await fsPromises.writeFile(outputFilePath, '')
  }

  const yamlOutput = yaml.dump(tocObj, {
    lineWidth: -1,
    forceQuotes: true,
    quotingType: '"'
  }).replace(/\s*children: \[\]\n/g, '\n')

  // Write to the output file
  fs.writeFile(fsPath.normalize(process.cwd() + '/_output/toc.yml'),
    yamlOutput,
    (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('File written successfully')
      }
    }
  )
}

// Run the rendering process.
module.exports = buildTocNav
