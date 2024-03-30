const fs = require('fs');
const readline = require('readline');
const { ebSlugify } = require('../../../gulp/helpers/utilities.js');

async function idRegistry(argv, files) {

  this.section = {};
  this.isChapter = false;
  this.annexLevel = 0;
  this.depth = argv.depth ? argv.depth : 5;
  
  // reset section counter
  this.sectionNumber = {};
  for (let i = 0; i < this.depth; i++) {
    this.sectionNumber[i] = 0;
  }

  if (!files) {
    console.log('idRegistry: files not specified. Skipped.');
    return;
  }

  function storeId(ref, title, isFigure=false) {
    let id;
    if (isFigure) {
      id = ebSlugify(ref);
    } else {
      id = ebSlugify(ref + ' ' + title);
    }

    if (this.section[id] != undefined) {
      console.error('idRegistry: Duplicated ID found! Check correctness of source files.', id);
      return;
    }
    
    // For Chapters/clauses, the reference name should include the full name
    if (ref.length==1) {
      ref = 'Clause ' + ref;
    }

    this.section[id] = {
      ref: ref,
      title: title
    }
  }

  async function scanFile(file) {
    const readableStream = fs.createReadStream(file);
    let block = '';

    const lineReader  = readline.createInterface({
      input: readableStream,
      crlfDelay: Infinity
    });

    lineReader.on('error', function (error) {
      console.log(`error: ${error.message}`);
    });

    // instead of processing a single line, we merge
    // multiple lines into a single block, as this is
    // required for figures
    lineReader.on("line", function(line){
      block += line;
      if (line == '') {
        scanBlock(block + '\n');
        block = '';
      }
    });

    return new Promise((resolve) => {
      readableStream.on('end', () => {
        resolve();
      });
    });
  }

  function scanBlock(block) {
    const figref = block.match(/reference=\"(.+)\".+caption=\"([^\"]+)\"/);
    const sectionref = block.match(/^#+\s*(\d+(\.\d+)*.?)?\s+(.+)/);
    const annexref = block.match(/^#+\s*([A-Z][\.\d+]*|Annex\s+[A-Z])\s+(.+)/);
    const chapter = block.match(/style: chapter/);
    const annex = block.match(/style: annex/);
    const section = block.match(/^#+/);
    const codeblock = block.match(/^\`\`\`/);
    const rawblock = block.match(/^\{\%\sraw\s\%\}/);
    
    // no not process codeblocks, rawblocks
    if (codeblock || rawblock) {
      return block;
    }

    let ref;  

    if (chapter) {
      this.isChapter = true;
      this.annexLevel = 0;
    }

    if (annex && (this.annexLevel == 0)) {
      this.annexLevel = this.sectionNumber[0];
    }

    if (section && (this.isChapter || this.annexLevel > 0)) {
      level = section[0].length;
      ref = calculateSectionNumber(level);
    }

    if (sectionref && this.isChapter && this.annexLevel == 0) {
      storeId(ref, sectionref[3]);
    }

    if (annexref && annexref[1]) {
      storeId(ref, annexref[2]);
    }

    if (figref) {
      storeId(figref[1], figref[2], isFigure=true);
    }
  }

  function calculateSectionNumber(level) {
    let number = '';
    this.sectionNumber[level-1] += 1;

    for (let i = level; i < this.depth; i++) { 
      if (sectionNumber[i] && sectionNumber[i] > 0) {
        sectionNumber[i] = 0;
      }
    }

    // annex should return full name for references
    if ((this.annexLevel>0) && (level == 1)) {
      number += 'Annex ';
    }

    // chapter should return full name for references
    //if ((level-1 == 0) && (this.annexLevel==0)) {
    //  number += 'Clause ';
   // }

    for (let i = 0; i < level; i++) {
      if (i>0) number += '.';
      if ((i == 0) && this.annexLevel!=0) {
        number += String.fromCharCode(64+sectionNumber[i]-this.annexLevel);
      } else {
        number += sectionNumber[i].toString();
      }
    }

    return number;
  }

  for (let i = 0; i < files.length; i++) {
    await scanFile(files[i].temp);
  }
  //console.log(' section', this.section);
  return this.section;
}

module.exports = idRegistry
