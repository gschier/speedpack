# Speedpack

_NOTE: Do not use this yet please_

Speedpack is a command line tool to automatically compress and optimize a static website.


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

  Usage: speedpack [options]

  Options:

    -h, --help           output usage information
    -v, --version        output the version number
    -o, --output <path>  output directory
    -i, --input <path>   input directory
```
