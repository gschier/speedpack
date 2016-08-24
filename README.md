# Speedpack

_NOTE: Do not use this yet please_

Speedpack is a command line tool to automatically compress and optimize a static website.

```
$ speedpack _dist
packing [####################] 100%
Finished in 5070ms
Compressed:
  File: 51 -> saved 0 bytes
  Image: 31 -> saved 2922113 bytes
  JavaScript: 1 -> saved 473 bytes
  CSS: 3 -> saved 6031 bytes
  -------------------------------
  Total: 86 -> saved 2928617 bytes
```


## Installation

```bash
npm install -g speedpack
```


## More Details

Speedpack is meant to be a simple and user friendly tool to help fix common problems reported by
[Google Page Speed Insights](https://developers.google.com/speed/pagespeed/). So far, it can do
the following.

- image compression
- css compression
- javascript compression

And in the near future...

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

