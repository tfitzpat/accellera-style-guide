const fs = require('fs');
const readline = require('readline');

function numberSections(file) {
  if (!file) {
    console.log('numberSections: file not specified. Skipped.');
    return
  }
  const depth = 3; // TODO

  this.isChapter = false;
  this.annexLevel = 0;

  // reset section counter
  this.sectionNumber = {};
  for (let i = 0; i < depth; i++) {
    this.sectionNumber[i] = 0;
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
  }
  
  function convertLine (line) {
    const section = line.match(/^#+/);
    const chapter = line.match(/style: chapter/);
    const annex = line.match(/style: annex/);

    if (chapter) {
      this.isChapter = true;
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

    return line; // no change
  }
  
  function updateSectionNumber(line, targetLevel) {
    if (targetLevel > depth) {
      return line;
    }
    const headerSign = '#'.repeat(targetLevel);
    let regex;
    if (this.annexLevel > 0) {
      regex = new RegExp('^#{' + targetLevel + '}\\s*([A-Z](\\.\\d+)|Annex\\s[A-Z])?\\s*(.+)');
    } else { // chapter
      regex = new RegExp('^#{' + targetLevel + '}\\s(\\d+(\\.\\d+)*.?)?\\s*(.+)');
    }
    const match = line.match(regex);
    console.log('old:', line);
    const number = calculateSectionNumber(targetLevel);
    const title = match[3].toString();
    const str = headerSign + ' ' + number + ' ' + title;
    console.log('new:', str);
    return str;
  }
  
  function calculateSectionNumber(level) {
    this.sectionNumber[level-1] += 1;

    for (let i = level; i < depth; i++) { 
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
  
  processFile(file);
}

module.exports = numberSections
