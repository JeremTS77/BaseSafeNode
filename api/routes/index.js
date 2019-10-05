import {Router} from 'express'

import usersRouter from './users.routes'

const routes = new Router()

routes.use('/users', usersRouter)

export default routes
