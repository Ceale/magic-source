/**
 * @name 野花🌷
 * @version 1.0.0
 */


const { EVENT_NAMES, request, on, send, env, version, currentScriptInfo, utils } = globalThis.lx

const getId = (Y, L) => {
	switch (Y) {
		case 'tx':
		case 'wy':
		case 'kw':
			return L["songmid"]
		case 'kg':
			return L['hash']
		case 'mg':
			return L['copyrightId']
	}
	throw Error("failed")
}

const headers = { 'User-Agent': 'lx-music/' + env, 'ver': version, 'source-ver': currentScriptInfo["version"] }

on(EVENT_NAMES["request"], (args) => {
	const { source, action, info: { musicInfo, type } } = args

	if (action != 'musicUrl') {
		throw Error("fialed")
	}
	return new Promise((resolve, reject) => {
		let B = '/url/' + source + '/' + getId(source, musicInfo) + '/' + type
		headers.tag = utils.buffer.bufToString(
			utils.buffer.from(
				JSON.stringify(
					B.match(/(?:\d\w)+/g),
					null,
					1
				)
			),
			"hex"
		)
		request(
			'http://flower.tempmusics.tk/v1' + B,
			{
				'method': "GET",
				'headers': headers
			},
			(err, resp) => err ? reject(err) : 0 !== resp.body.code ? reject(Error(resp.body.msg)) : void resolve(resp.body.data)
		)
	})
})

request(
	"http://flower.tempmusics.tk/v1/urlinfo/" + currentScriptInfo.version,
	{
		'method': "GET",
		'headers': headers
	},
	(err, resp) => {
		const B = {
			'body':
			{
				'code': 0,
				s: 'kw|128k&wy|128k&mg|128k&tx|128k&kg|128k'
			}
		}
		if (err) {
			resp = B
		}
		if (
			0 !== resp.body.code // ||
			// resp.body.m &&
			// utils.crypto.md5(currentScriptInfo.rawScript.trim()) != resp.body.m
		) {
			throw Error(resp.body.msg ?? '服务器异常')
		}
		let v = {}
		for (let M of resp.body.s.trim().split('&')) {
			v[
				(M = M.split('|')).shift()
			] = {
				'type': 'music',
				'actions': ['musicUrl'],
				'qualitys': M
			}
		}
		send(EVENT_NAMES.inited, { sources: v })
		if (resp.body.u) {
			send(
				EVENT_NAMES.updateAlert,
				{
					log: resp.body.u,
					updateUrl: resp.body.h
				}
			)
		}
	}
)