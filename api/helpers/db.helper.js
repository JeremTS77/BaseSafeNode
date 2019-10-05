import Sequelize from 'sequelize'

import {buildEnv} from './env.helper'
const env = buildEnv()

const db = new Sequelize(process.env.DB_DATABASE || env.DB.DATABASE || 'docker', process.env.DB_USER || env.DB.USER || 'dockers', process.env.DB_PASSWORD || env.DB.PASSWORD || 'docker', {
	port: env.DB.PORT,
	dialect: 'postgresql',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	replication: {
		read: [
			{host: process.env.DB_SLAVE || env.DB.SLAVE || 'localhost'},
		],
		write: {host: process.env.DB_MASTER || env.DB.MASTER || 'localhost'},
	},
	logging: false,
})

db.sync()

export default db
