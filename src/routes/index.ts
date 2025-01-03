import { Router } from 'express'
import { usersRoutes } from './users.routes'

export const route = Router()

route.use('/users', usersRoutes)
