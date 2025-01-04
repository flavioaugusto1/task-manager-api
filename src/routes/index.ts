import { Router } from 'express'
import { usersRoutes } from './users.routes'
import { tasksRoute } from './tasks.routes'

export const route = Router()

route.use('/users', usersRoutes)
route.use('/tasks', tasksRoute)
