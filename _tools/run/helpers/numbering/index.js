const fs = require('fs');
const readline = require('readline');

async function numberSections(argv, files, ids) {

  this.isChapter = false;
  this.annexLevel = 0;
  this.topicName = [];
  this.override = argv.override;
  this.depth = argv.depth ? argv.depth : 5;
  this.ids = ids;

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
    const readableStream = fs.createReadStream(file);
    const writeStream = fs.createWriteStream(file + '.tmp.md');

    readableStream.on('error', function (error) {
      console.log(`error: ${error.message}`);
    });

    const lines = readline.createInterface({
      input: readableStream,
      crlfDelay: Infinity
    });
  
    for await (const line of lines) {
      const newline = convertLine(line);
      writeStream.write(newline+'\n');
    }

    return waitForStreamClose(writeStream);
  }

  function convertLine (line) {
    const section = line.match(/^#+/);
    const chapter = line.match(/style: chapter/);
    const annex = line.match(/style: annex/);
    const xref = [...line.matchAll(/(\[[^\(]+\]|\[\])\(((?!http).+html)?#([^\)]+)\)/gi)];

    if (chapter) {
      this.isChapter = true;
      this.annexLevel=0;
    }

    if (annex) {
      if (this.annexLevel==0) {
        this.annexLevel = this.sectionNumber[0];
      }
    }

    if (section && (this.isChapter || this.isAnnex)) {
      level = section[0].length;
      return updateSectionNumber(line, level);
    }

    if (xref.length) {
      return updateCrossReference(xref, line);
    }

    return line; // no change
  }

  function updateCrossReference(xref, line) {
    let nline = line;
    for (let i = 0; i < xref.length; i++) {
      //console.log('xref:', i, xref[i], xref[i][3]);
      const id = this.ids[xref[i][3]];
      if (id) {
        nline = line.replace(xref[i][1], '[' + id.number + ']');
        //console.log(' line:', nline);
      } else {
        console.error('xref update: no cross reference found for ID', xref[i][3]);
      }
    }
    return nline;
  }

  function updateSectionNumber(line, targetLevel) {
    if (targetLevel > this.depth) {
      return line;
    }
    const headerSign = '#'.repeat(targetLevel);
    let regex;
    if (this.annexLevel > 0) {
      regex = new RegExp('^#{' + targetLevel + '}\\s*([A-Z](\\.\\d+)|Annex\\s+[A-Z])?\\s*(.+)');
    } else { // chapter
      regex = new RegExp('^#{' + targetLevel + '}\\s*(\\d+(\\.\\d+)*.?)?\\s+(.+)?');
    }        

    const match = line.match(regex);
    const number = calculateSectionNumber(targetLevel);
    let title = match[3].toString();

    if (this.annexLevel > 0) { // TODO remove based on text in line
      title.replace('informative','').replace('normative','');
    }
    //console.log('old:', line);
    const str = headerSign + ' ' + number + ' ' + title;
    //console.log('new:', str);
    return str;
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

    if (this.override) {
      fs.copyFile(files[i] + '.tmp.md', files[i], (err) => {
        if (err) throw err;
      });
      fs.unlink(files[i] + '.tmp.md', (err) => {
        if (err) throw err;
      });
    }
  }
  //console.log(' section', this.section);
}

module.exports = numberSections
