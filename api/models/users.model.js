import Sequelize from 'sequelize'

import db from '../helpers/db.helper'

const userModel = db.define('users', {
	id: {autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
	firstname: {type: Sequelize.STRING, defaultValue: null, allowNull: true},
	lastname: {type: Sequelize.STRING, defaultValue: null, allowNull: true},
	email: {type: Sequelize.STRING, unique: true, allowNull: false},
	password: {type: Sequelize.TEXT, scopes: ['self'], allowNull: false},
	salt: {type: Sequelize.STRING, scopes: ['self'], allowNull: false},
	active: {type: Sequelize.STRING, defaultValue: false},
	first_connect: {type: Sequelize.BOOLEAN, defaultValue: true},
}, {
	paranoid: true,
})

userModel.sync()

export default userModel
