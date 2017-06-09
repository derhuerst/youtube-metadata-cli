'use strict'

const process = require('child_process')
const {parse} = require('ndjson')

const getYoutubeMetadata = (url) => {
	const out = parse()

	const ytdl = process.exec([
		'youtube-dl',
		'--simulate', // do not download
		'--dump-json', // extract metadata
		'--yes-playlist', // resolve the whole playlist
		'--no-call-home', // disable tracking calls
		'--',
		'"' + url + '"' // todo: properly escape here
	].join(' '))

	ytdl.stderr.on('data', (msg) => {
		out.emit('error', msg)
	})
	ytdl.stdout.pipe(out)

	return out
}

module.exports= getYoutubeMetadata
