#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const through = require('through2')
const omit = require('lodash.omit')
const ndjson = require('ndjson').stringify
const csv = require('csv-write-stream')

const getYoutubeMetadata = require('.')
const pkg = require('./package.json')

const argv = minimist(process.argv.slice(2))

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    youtube-metadata <url>

Options:
    --format -f  Output format.
                 Default: csv
                 Available: csv,ndjson,url

Examples:
    youtube-metadata --format url 'https://www.youtube.com/watch?v=rFtP7Xc_Fbo'
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

let formatter = process.stdout
if (argv.format === 'url' || argv.f === 'url') {
	formatter = through.obj((meta, _, cb) => {
		cb(null, meta.webpage_url + '\n')
	})
	formatter
	.on('error', showError)
	.pipe(process.stdout)
}
else if (argv.format === 'ndjson' || argv.f === 'ndjson') {
	const simplify = (meta, _, cb) => {
		const simplified = omit(meta, [
			'series', 'chapters', 'season_number', 'episode_number',
			'_filename', 'ext',
			'format', 'abr', 'acodec', 'vbr', 'vcodec', 'format_id', 'resolution',
			'requested_formats',
			'extractor_key', 'extractor'
		])
		for (let format of simplified.formats) delete format.http_headers
		cb(null, simplified)
	}

	formatter = through.obj(simplify)
	formatter
	.on('error', showError)
	.pipe(ndjson())
	.on('error', showError)
	.pipe(process.stdout)
}
else if (argv.format === 'csv' || argv.f === 'csv' || (!argv.format && !argv.f)) {
	const simplify = (meta, _, cb) => cb(null, {
		id: meta.id,
		url: meta.webpage_url,
		title: meta.fulltitle,
		user: meta.uploader_id,
		tags: meta.tags,
		categories: meta.categories,
		duration: meta.duration,
		thumbnail: meta.thumbnail,
		resolution: meta.width + 'x' + meta.height,

		playlist: meta.playlist_id,
		index: meta.playlist_index,

		views: meta.view_count,
		rating: meta.average_rating,
		likes: meta.like_count,
		dislikes: meta.dislike_count,
	})

	formatter = through.obj(simplify)
	formatter
	.on('error', showError)
	.pipe(csv())
	.on('error', showError)
	.pipe(process.stdout)
}
else showError('Invalid format.')

const url = argv._[0]
if (!url) showError('Missing URL.')

getYoutubeMetadata(url)
.on('error', showError)
.pipe(formatter)
