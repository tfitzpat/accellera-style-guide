---
style: annex
---

# Annex B **(informative)** Electric Book commands

## B.1 Usage

```
npm run electric-book -- <command> [options]

or

npm run eb -- <command> [options]

commands:
  npm run eb -- check    Check project files and folders
  npm run eb -- export   Export to another file format
  npm run eb -- images   Process source images for output
  npm run eb -- help     Show available commands and options
  npm run eb -- index    Refresh search and book indexes
  npm run eb -- install  Install or update dependencies
  npm run eb -- new      Copy a book to create a new one
  npm run eb -- output   Generate a project or publication
  npm run eb -- package  Create a zip file of this project
  npm run eb -- toc      Build table of contents

options:
  -h, --help             Show available commands and options
  -f, --format           Format to output. Supported choices:
                           print-pdf
                           screen-pdf
                           web (default)
                           epub
                           app
  -b, --book             Relevant book or assets directory (default: book)
  -n, --name             Name of a new book  (default: new)
  -l, --language         Translation language (default: None)
  -c, --configs          Custom files in /_configs, comma-separated (default: None)
  -m, --mathjax          Enable MathJax (default: false)
  -u, --baseurl          A custom base URL, e.g. /books (default: None)
  -i, --incremental      Enable Jekyll's incremental build (default: false)
  -e, --epubcheck        Local path to folder containing epubcheck.jar (UNIX only)
                           (default: /usr/local/bin/epubcheck-4.2.6)
  -o, --app-os           Target app operating system. Supported choices:
                           android (default)
                           ios
                           windows
  -d, --app-build        Create app with Cordova after building HTML (default: false)
  -r, --app-release      Make the app a signed release (default: false)
  -p, --app-emulate      Launch app in default emulator (default: false)
  -x, --export-format    File format to export to (default: MS Word)
  -s, --numbering        Depth of section (re)numbering in the book (default: 0)
  -j, --merged           Whether to merge HTML files for PDF output (default: true)
  -g, --pdf-engine       Select PDF rendering engine (default: prince)
```

## B.2 Examples

Create a screen PDF for the Accellera standard template (`accellera-standard-template`) document:

```
npm run electric-book -- output --format screen-pdf --book accellera-standard-template
```

Create a screen PDF for the Accellera Style Guide:

```
npm run electric-book -- output --format screen-pdf --book accellera-style-guide
```

Create a screen PDF for the Accellera Style Guide, and enable renumbering of sections and cross-references down to 5th level:

```
npm run electric-book -- output --format screen-pdf --book accellera-style-guide --numbering 5
```

Create a screen PDF for the IEEE SA Standards Style Manual:

```
npm run electric-book -- output --format screen-pdf --book ieee-sa-standards-style-manual
```

Create a table of contents file for the Accellera standard template (`accellera-standard-template`) document:

```
npm run electric-book -- toc --book accellera-standard-template
```
