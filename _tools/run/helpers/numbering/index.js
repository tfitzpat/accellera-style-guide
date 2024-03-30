const fs = require('fs');
const readline = require('readline');

async function numberSections(argv, files, ids) {

  this.isChapter = false;
  this.annexLevel = 0;
  this.topicName = [];
  this.override = argv.override;
  this.depth = argv.depth ? argv.depth : 5;
  this.ids = ids;
  this.figureNumber = 0;
  this.tableNumber = 0;

  // reset section counter
  this.sectionNumber = {};
  for (let i = 0; i < this.depth; i++) {
    this.sectionNumber[i] = 0;
  }

  if (!files) {
    console.log('numberSections: files not specified. Skipped.');
    return;
  }

  async function waitForStreamClose(stream) {
    stream.end();
    return new Promise((resolve) => {
        stream.once('finish', () => {
            resolve();
        });
    });
  }

  async function processFile(file) {
    const readableStream = fs.createReadStream(file.temp);
    const writeStream = fs.createWriteStream(file.source);
    let block = '';
    let eof = false;

    const lineReader  = readline.createInterface({
      input: readableStream,
      crlfDelay: Infinity
    });

    lineReader.on('error', function (error) {
      console.log(`error: ${error.message}`);
    });

    readableStream.on('end', function() {
      if (block) {  // at EoL, check if there are pending lines in the buffer
        const updatedBlock = convertLine(block);
        writeStream.write(updatedBlock);
      }
    });

    // instead of processing a single line, we merge
    // multiple lines into a single block, as this is
    // required for figures
    for await (const line of lineReader) {
      block += line + '\n';
      if (line == '') {
        //console.log('block', block);
        const updatedBlock = convertLine(block);
        writeStream.write(updatedBlock);
        block = '';
      }
    };

    return waitForStreamClose(writeStream);
  }

  function convertLine (block) {
    const section = block.match(/^#+/);
    const chapter = block.match(/style: chapter/);
    const annex = block.match(/style: annex/);
    const xref = [...block.matchAll(/(\[[0-9.]+\]|\[\])\((([^\s^\)]+)?)\)/gi)];
    const codeblock = block.match(/^\`\`\`/);
    const rawblock = block.match(/^\{\%\s+raw\s+\%\}/);
    const table = block.match(/^\{\%\s+include\s+table/);

    // no not process codeblocks, rawblocks
    if (codeblock || rawblock) {
      return block;
    }

    if (chapter) {
      this.isChapter = true;
      this.annexLevel=0;
    }

    if (annex) {
      if (this.annexLevel==0) {
        this.annexLevel = this.sectionNumber[0];
      }
    }

    if (section && (this.isChapter || this.annexLevel>0)) {
      level = section[0].length;
      return updateSectionNumber(block, level);
    }

    if (xref.length) {
      return updateCrossReference(xref, block);
    }

    if (table) {
      return updateTableReference(block);
    }

    return block; // no change
  }

  function updateTableReference(block) {
    const tableref = block.match(/reference=\"(.*)\"/);
    if (!tableref) return block; // table reference not found
    console.log('tableref', tableref);
    return block;
  }

  function updateCrossReference(xref, block) {
    let nblock = block;
    for (let i = 0; i < xref.length; i++) {
      let link = xref[i][2].split('#');
      if (!link) continue; // no valid link found, continue
      const id = this.ids[link[1]];
      if (id) {
        let ref = id.ref;
        //console.log('ref:', link, xref[i], ref);
        nblock = nblock.replace(xref[i][1], '[' + ref + ']');
        //console.log(' line:', nblock);
      } else {
        console.warn('WARNING: xref - no cross reference found for ID', xref[i][2]);
      }
    }
    return nblock;
  }

  function updateSectionNumber(block, targetLevel) {
    nblock = block;
    if (targetLevel > this.depth) {
      return block;
    }

    let regex;
    if (this.annexLevel > 0) { // annex
      regex = new RegExp('^#{' + targetLevel + '}\\s*([A-Z](\\.\\d+)|Annex\\s+[A-Z])?\\s*(.+)');
    } else { // chapter
      regex = new RegExp('^#{' + targetLevel + '}\\s*(\\d+(\\.\\d+)*.?)?\\s+(.+)?');
    }        

    const match = block.match(regex);
    // regex failed, probably different syntax, so keep block untouched
    if (!match) return block;
    //console.log('section', match);
    const number = calculateSectionNumber(targetLevel);
    return block.replace(match[1], number);
  }

  function calculateSectionNumber(level) {
    this.sectionNumber[level-1] += 1;

    for (let i = level; i < this.depth; i++) { 
      if (sectionNumber[i] && sectionNumber[i] > 0) {
        sectionNumber[i] = 0;
      }
    }

    let number = "";
    // add trailing dot for chapters
    if ((this.annexLevel>0) && (level == 1)) {
      number += 'Annex ';
    }

    for (let i = 0; i < level; i++) {
      if (i>0) number += '.';
      if ((i == 0) && this.annexLevel!=0) {
        number += String.fromCharCode(64+sectionNumber[i]-this.annexLevel);
      } else {
        number += sectionNumber[i].toString();
      }
    }
    // add trailing dot for chapters
    if ((level-1 == 0) && (this.annexLevel==0)) {
      number += '.';
    }
    return number;
  }

  for (let i = 0; i < files.length; i++) {
    await processFile(files[i]);

  }
  //console.log(' section', this.section);
}

module.exports = numberSections
