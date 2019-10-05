import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookie from 'cookie-parser'

import db from './helpers/db.helper'
import {buildEnv} from './helpers/env.helper'

import router from './routes/index'

const app = express()
const env = buildEnv()

if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'))
}

app.disable('x-powered-by')
app.use(function(req, res, next) {
	const origin = req.get('origin') || 'http://localhost:3000'
	res.setHeader('Access-Control-Allow-Origin', origin)
	res.setHeader('Access-Control-Allow-Credentials', true)
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'XOrigin, X-Requested-With, Content-Type, Accept')
	if ('OPTIONS' === req.method) {
		return res.status(200).send('Ok')
	}
	next()
})
db.authenticate()
	.then((_)=>{
		console.log('Connection has been established successfully.')
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err)
	})
app.use(cookie(env.EXPRESS.SECRET_SESSION || process.env.SECRET_SESSION || ''))
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}))
app.use(bodyParser.json())
app.use(router)
app.listen(env.EXPRESS.PORT)
