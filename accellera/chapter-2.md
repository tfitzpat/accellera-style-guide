---
style: chapter
---

# 2. Project setup
{:.page-break-before}

This chapter explains the projet setup and use of the GitHub repository for technical documentation.

## 2.1 GitHub repository setup

It is recommended to use a dedicated GitHub repository to develop a single standard book. Please contact the Technical Committee chair to request a new repository for the technical documentation. After this, a new GitHub repository will be created, including the installation of default templates and scripts to generate an IEEE-SA stylesheet compatible standards document.

The table below gives an overview of the default strcture of the repository.

{% include figure
   markdown="

| Directory      | Purpose / Content                            | Remarks                      |
|----------------|----------------------------------------------|------------------------------|
| `_api/`        | API to fetch metadata and content in JSON    | Currently not supported      | 
| `_app/`        | Template files for app output                | Not touched by technical editor(s) |
| `_configs/`    | Configuration settings for different outputs | Customization by doc team |
| `_data/`       | Project (meta)data and settings e.g.,<br>`settings.yml`, `locales.yml` | Not touched by technical editor(s) |
| `_data/works/standard/` | Metadata of the standards document in YAML (`default.yml`) | Used by technical editor(s)  |
| `_doc/`        | This documentation                           | Not touched by technical editor(s) |
| `_epub/`       | Template files for epub output               | Not touched by technical editor(s) |
| `_includes/`   | HTML templates to render the document        | Not touched by technical editor(s) |
| `_layouts/`    | Templates to structure pages                 | Not touched by technical editor(s) |
| `_output/`     | Output directory for PDFs and epubs          | Used by technical editor(s)        |
| `_sass/`       | Location to store default document styles    | Not touched by technical editor(s) |
| `_site/`       | Subdirectory for web and app versions of the document | Not touched by technical editor(s) |
| `_tools/`      | Flow documentation utilities                 | Not touched by technical editor(s) |
| `assets/`      | Styles and images for the project            | Not touched by technical editor(s) |
| `standard/`    | Subdirectory for the standard document        | Used by technical editor(s)        |

"
   reference="Table 2-1"
   caption="Repository structure"
   alt-text=""
   class="fixed allow-break"
   caption-position="top"
%}

In addition, the root directory also contains some configuration settings to enable flow installation, automation and/or deployment. Normally technical editor(s) do not have to change these files.

## 2.2 Standard document creation

The root directory to store the standard document is `standard`. This directory will contain the document source files in markdown format.

Table X below gives an overview of the default 
 of the repository.

{% include figure
   markdown="

| File / directory                   | Purpose / Content        |
|------------------------------------|--------------------------|
| `_data/works/standard/defauly.yml` | Metadata of the document |
| `standard/images/`                 | Location to store images |
| `standard/styles/`                 | Location for stylesheets |
| `standard/index.md`                | Landing page (e.g. cover) for the standard document |
| `standard/package.opf`             | Placeholder to generate epub output (do not edit or remove) |
| `standard/toc.ncx`                 | Placeholder to generate navigation file for old ereaders (do not edit or remove) |

"
   reference="Table 2-2"
   caption="Standard document subdirectory structure"
   alt-text=""
   class="fixed allow-break"
   caption-position="top"
%}
