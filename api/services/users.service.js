import usersModel from '../models/users.model'

export default {
	findByPk(id, query = {}) {
		return usersModel.findByPk(id)
	},
	list(query) {
		return usersModel.findAll({
			limit: query.limit || 500,
			offset: query.offset || 0,
		})
	},
	create(obj) {
		return usersModel.create(obj)
	},
	delete(id) {
		return usersModel.destroy({where: {id: id}})
	},
}
