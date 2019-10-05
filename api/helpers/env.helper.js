import fs from 'fs-extra'
import path from 'path'

export const buildEnv = (options) => {
	const jsonFile = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'preproduction') ? 'conf/appsettings.json' : '.env.json'
	const encoding = (options && options.encoding) || 'utf8'
	const jsonString = fs.readFileSync(path.resolve(process.cwd(), jsonFile), {
		encoding: encoding,
	})
	return JSON.parse(jsonString)
}
