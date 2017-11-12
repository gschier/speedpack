# Speedpack

_NOTE: Do not use this yet please_

Speedpack is a command line tool to automatically compress and optimize a static website.

```
$ speedpack _dist
packing [####################] 100%
Finished in 5070ms
Compressed:
  File: 169 -> saved 0.00 Bytes (0%)
  JavaScript: 1 -> saved 367.97 KB (0.356%)
  Image: 4 -> saved 1.22 MB (0.145%)
  CSS: 1 -> saved 397.14 KB (0.304%)
  -------------------------------
  Total: 175 -> saved 1.97 MB (0.550%)
```


## Installation

```bash
npm install -g speedpack
```


## More Details

Speedpack is meant to be a simple and user friendly tool to help fix common problems reported by
[Google Page Speed Insights](https://developers.google.com/speed/pagespeed/). So far, it can compress
the following:

- `CSS`
- `HTML`
- Images (`PNG`, `JPG`, `SVG`, `GIF`)
- `JS`
- `JSON`
- `XML`

And in the near future, it will:

- guided CLI that saves preferences to a config file
- javascript and css concatenation (detect nearby items in HTML and concat them)
- show cool stats on how much was improved
- suggest fixes that should not be handled by this tool (missing title tags, etc)


## Usage

```bash
speedpack --help

  Usage: slimpack [options] <input>

  Options:

    -h, --help           output usage information
    -v, --version        output the version number
    -o, --output <path>  output directory

