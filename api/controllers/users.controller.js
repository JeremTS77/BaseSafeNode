import blueBird from 'bluebird'
import moment from 'moment'

import {generateActive, generateSalt, generatePassword} from '../libs/crypto.lib'

import usersService from '../services/users.service'

export default {
	getOne: (req, res) => {
		if (!req.params.id) {
			return res.status(400).json({
				'status': 400,
				'message': 'Bad Request',
				'details': 'Missing id for users',
			})
		}
		usersService.findByPk(req.params.id, req.query)
			.then((data) => {
				if (!data) {
					throw new Error({
						'status': 404,
						'message': 'Not Found',
						'details': `user id ${req.params.id} not found`,
					})
				} else {
					res.status(200).json(data)
				}
			})
			.catch((err) => {
				if (err && err.error && err.error.status && err.error.message && err.error.details) {
					return res.status(err.error.status).json(err)
				} else {
					return res.status(500).json({
						'error': {
							'status': 500,
							'message': 'Internal Server Error',
							'details': err,
						},
					})
				}
			})
	},
	list: (req, res) => {
		usersService.list(req.query)
			.then((data) => {
				if (!data || !data[0]) {
					return res.status(404).json({
						'status': 404,
						'message': 'Not Found',
						'details': 'Users not found',
					})
				}
				res.status(200).json(data)
			})
			.catch((err) => {
				return res.status(500).json({
					'status': 500,
					'message': 'Internal Server Error',
					'details': err,
				})
			})
	},
	create: (req, res) => {
		const {
			lastname,
			firstname,
			email,
			password,
			confirmPassword,
		} = req.body
		const ret = []
		if (!lastname) {
			ret.push('lastname')
		}
		if (!firstname) {
			ret.push('firstname')
		}
		if (!email) {
			ret.push('email')
		}
		if (!password) {
			ret.push('password')
		}
		if (!confirmPassword) {
			ret.push('confirmPassword')
		}
		if (ret.length) {
			return res.status(400).json({
				'status': 400,
				'message': 'Bad Request',
				'details': 'missing ' + ret + ' values',
			})
		}
		if (confirmPassword !== password) {
			return res.status(400).json({
				'status': 400,
				'message': 'Bad Request',
				'details': 'confirm password and password does not match !',
			})
		}
		const today = moment().format('L').toString().replace(/\//gi, '')
		let finalActive = null
		let finalSalt = null
		let finalPassword = null
		blueBird.all([generateSalt, generateActive])
			.then((Crypto) => {
				if (!Crypto || !Crypto.length || Crypto.length !== 2) {
					return (null, {
						'status': 500,
						'message': 'Internal Server Error',
						'details': 'cannot chiffre this password'
					})
				}
				finalActive = today + Crypto[1].toString('hex')
				finalSalt = Crypto[0].toString('hex')
				return generatePassword(req.body.password, finalSalt)
			})
			.then((data, err) => {
				if (err) {
					return (null, err)
				}
				finalPassword = Buffer.from(data, 'binary').toString('hex');
				return usersService.create({
					lastname: req.body.lastname || null,
					firstname: req.body.firstname || null,
					email: req.body.email || null,
					password: finalPassword,
					active: finalActive,
					salt: finalSalt,
				})
			})
			.then((data) => {
				if (!data) {
					return res.status(202).json({
						'status': 202,
						'message': 'Accepted',
						'details': data,
					})
				}
				res.status(201).json(data)
			})
			.catch((err) => {
				return res.status(500).json({
					'status': 500,
					'message': 'Internal Server Error',
					'details': err,
				})
			})
	},
	updateOne: (req, res) => {
		if (!req.params.id) {
			return res.status(400).json({
				'status': 400,
				'message': 'Bad Request',
				'details': 'Missing id for users',
			})
		}
		usersService.findByPk(req.params.id, req.query)
			.then((data) => {
				if (!data) {
					throw new Error({
						'status': 404,
						'message': 'Not Found',
						'details': `user id ${req.params.id} not found`,
					})
				} else {
					return data.update({
						...req.params.body,
					})
				}
			})
			.then((updatedData) => {
				res.status(200).json(updatedData)
			})
			.catch((err) => {
				if (err && err.error && err.error.status && err.error.message && err.error.details) {
					return res.status(err.error.status).json(err)
				} else {
					return res.status(500).json({
						'error': {
							'status': 500,
							'message': 'Internal Server Error',
							'details': err,
						},
					})
				}
			})
	},
	deleteOne: (req, res) => {
		if (!req.params.id) {
			return res.status(400).json({
				'status': 400,
				'message': 'Bad Request',
				'details': 'Missing id for users',
			})
		}
		usersService.delete(req.params.id)
			.then((data) => {
				if (data === 0) {
					return res.status(404).json({
						'status': 404,
						'message': 'Not Found',
						'details': `user ${req.params.id} not found`,
					})
				}
				return res.sendStatus(204)
			})
			.catch((err) => {
				return res.status(500).json({
					'error': {
						'status': 500,
						'message': 'Internal Server Error',
						'details': err,
					},
				})
			})
	},
}
