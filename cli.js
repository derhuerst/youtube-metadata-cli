#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const through = require('through2')

const getYoutubeMetadata = require('.')
const pkg = require('./package.json')

const argv = minimist(process.argv.slice(2))

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    youtube-metadata <url>

Examples:
    youtube-metadata 'https://www.youtube.com/watch?v=rFtP7Xc_Fbo'
\n`)
	process.exit()
}

if (argv.version || argv.v) {
	process.stdout.write(pkg.name + ' ' + pkg.version + '\n')
	process.exit(0)
}

const showError = function (err) {
	if (process.env.NODE_DEBUG === 'listen-to-youtube-cli') console.error(err)
	else process.stderr.write(err.toString() + '\n')
	process.exit(err.code || 1)
}

const formatter = through.obj((meta, _, cb) => {
	cb(null, meta.webpage_url + '\n')
})
formatter
.on('error', showError)
.pipe(process.stdout)

const url = argv._[0]
if (!url) showError('Missing URL.')

getYoutubeMetadata(url)
.on('error', showError)
.pipe(formatter)
