const fs = require('fs');
const readline = require('readline');
const { ebSlugify } = require('../../../gulp/helpers/utilities.js');

async function idRegistry(argv, files) {

  this.section = {};

  if (!files) {
    console.log('idRegistry: files not specified. Skipped.');
    return;
  }

  function storeId(number, title, isFigure=false) {
    let id;
    if (isFigure) {
      id = ebSlugify(number);
    } else {
      id = ebSlugify(number + ' ' + title);
    }

    if (this.section[id] != undefined) {
      console.error('idRegistry: Duplicated ID found! Check correctness of source files.', id);
      return;
    }
    this.section[id] = {
      number: number,
      title: title
    }
  }

  function scanFile(file) {
    const readableStream = fs.createReadStream(file);
    let section;

    const lineReader  = readline.createInterface({
      input: readableStream,
      crlfDelay: Infinity
    });

    lineReader.on('error', function (error) {
      console.log(`error: ${error.message}`);
    });

    lineReader.on("line", function(line){
      section += line;
      if (line == '') {
        scanSection(section + '\n');
        section = '';
      }
    });

    return new Promise((resolve) => {
      readableStream.on('end', () => {
        resolve();
      });
    });
  }

  function scanSection(section) {
    const figref = section.match(/reference=\"(.+)\".+caption=\"([^\"]+)\"/);
    const sectionref = section.match(/^#+\s+(\d+[\.\d]*|\d.)?\s+(.+)/);
    const annexref = section.match(/^\#+\s+([A-Z][\.\d+]*|Annex\s+[A-Z])\s+(.+)/);

    if (sectionref && sectionref[1]) {
      storeId(sectionref[1], sectionref[2]);
    }

    if (annexref && annexref[1]) {
      storeId(annexref[1], annexref[2]);
    }

    if (figref) {
      storeId(figref[1], figref[2], isFigure=true);
    }
  }

  for (let i = 0; i < files.length; i++) {
    await scanFile(files[i]);
  }
  //console.log(' section', this.section);
  return this.section;
}

module.exports = idRegistry
