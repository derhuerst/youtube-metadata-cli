# youtube-metadata-cli

**Get metadata on YouTube videos.** Uses [the wonderful `youtube-dl`](http://rg3.github.io/youtube-dl/). Supports playlists.

[![npm version](https://img.shields.io/npm/v/youtube-metadata-cli.svg)](https://www.npmjs.com/package/youtube-metadata-cli)
[![build status](https://img.shields.io/travis/derhuerst/youtube-metadata-cli.svg)](https://travis-ci.org/derhuerst/youtube-metadata-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/youtube-metadata-cli.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install -g youtube-metadata-cli
```


## Usage

```js
Usage:
    youtube-metadata <url>

Options:
    --format -f  Output format.
                 Default: csv
                 Available: csv,ndjson,url

Examples:
    youtube-metadata --format url 'https://www.youtube.com/watch?v=IFtmB2U3Clo&list=PLJ7QPuvv91Jsf2mEnwtCaVyxkuLMkRJF6'
```

It will write one line of metadata per video.

`youtube-metadata-cli` can als be used from JavaScript:

```js
const getYoutubeMetadata = require('youtube-metadata-cli')

getYoutubeMetadata('https://www.youtube.com/watch?v=IFtmB2U3Clo&list=PLJ7QPuvv91Jsf2mEnwtCaVyxkuLMkRJF6')
.on('error', console.error)
.on('data', (meta) => {
	console.log(meta.display_id, meta.title)
})
```


## Contributing

If you have a question or have difficulties using `youtube-metadata-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/youtube-metadata-cli/issues).
