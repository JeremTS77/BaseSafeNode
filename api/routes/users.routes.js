import {Router} from 'express'

import usersCtrl from '../controllers/users.controller'

const usersRouter = new Router()

usersRouter.get('/:id', usersCtrl.getOne)
usersRouter.get('/', usersCtrl.list)

usersRouter.post('/', usersCtrl.create)

usersRouter.put('/:id', usersCtrl.updateOne)

usersRouter.delete('/:id', usersCtrl.deleteOne)

export default usersRouter
