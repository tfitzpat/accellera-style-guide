const fs = require('fs');
const readline = require('readline');
const { ebSlugify } = require('../../../gulp/helpers/utilities.js')

async function numberSections(argv, file) {
  if (!file) {
    console.log('numberSections: file not specified. Skipped.');
    return
  }
  this.isChapter = false;
  this.annexLevel = 0;
  this.topicName = [];
  this.override = argv.override;
  this.depth = argv.depth ? argv.depth : 5;

  // reset section counter
  this.sectionNumber = {};
  for (let i = 0; i < this.depth; i++) {
    this.sectionNumber[i] = 0;
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

    await waitForStreamClose(writeStream);

    if (this.override) {
      fs.copyFile(file + '.tmp.md', file, (err) => {
        if (err) throw err;
      });
      fs.unlink(file + '.tmp.md', (err) => {
        if (err) throw err;
      });
    }  
  }

  function convertLine (line) {
    const section = line.match(/^#+/);
    const chapter = line.match(/style: chapter/);
    const annex = line.match(/style: annex/);

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

    return line; // no change
  }
  
  function updateSectionNumber(line, targetLevel) {
    if (targetLevel > this.depth) {
      return line;
    }
    const headerSign = '#'.repeat(targetLevel);
    let regex;
    if (this.annexLevel > 0) {
      regex = new RegExp('^#{' + targetLevel + '}\\s*([A-Z](\\.\\d+)|Annex\\s[A-Z])?\\s*(.+)');
    } else { // chapter
      regex = new RegExp('^#{' + targetLevel + '}\\s*(\\d+(\\.\\d+)*.?)?\\s*(.+)?');
    }        

    const match = line.match(regex);
    const number = calculateSectionNumber(targetLevel);
    let title = match[3].toString().replace(/\s*{#.+}/g, ''); // remove {#id}  
    let id = title;

    if (this.annexLevel > 0) { // TODO remove based on text in line
      id = title.replace('informative','').replace('normative','');
    }

    console.log('old:', line, title);
    this.topicName[level] = this.topicName[level-1] ? this.topicName[level-1] + '-' + ebSlugify(id) : ebSlugify(id);
    const str = headerSign + ' ' + number + ' ' + title + ' {#'  + this.topicName[level] + '}';
    console.log('new:', str);
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
  
  processFile(file);
  console.log('next');
}

module.exports = numberSections
