const fs = require('fs');

async function idRegistry(argv, files) {

  this.section = {};

  if (!files) {
    console.log('idRegistry: files not specified. Skipped.');
    return;
  }

  function storeId(id, number, title) {
    if (this.section[id] != undefined) {
      console.error('idRegistry: Same ID found! Check correctness of source files', id);
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
    //console.log('section:', section);
    const figref = section.match(/reference=\"(.+)\".+caption=\"(.+)\&mdash\;([^\"]+)\"/);
    const sectionref = section.match(/^#*\s*(\d+[\.\d]*|\d.)?\s+(.+)\s+\{#([a-z]+)\}/);
    const annexref = section.match(/^#*\s*([A-Z][\.\d+]*|Annex\s[A-Z])\s+(.+)\s+\{#([a-z]+)\}/);
    
    if (sectionref && sectionref[1]) {
      storeId(sectionref[3], sectionref[1], sectionref[2]);
    }

    if (annexref) {
      storeId(annexref[3], annexref[1], annexref[2]);
    }

    if (figref) {
      storeId(figref[1], figref[2], figref[3]);
    }
    //console.log(' section', this.section);
  }

  await scanFile(file);
}

module.exports = idRegistry
