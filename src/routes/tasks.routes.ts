import { Router } from 'express'
import { TasksController } from '@/controllers/TasksController'
import { ensureAuthenticated } from '@/middlewares/EnsureAtuhenticated'

export const tasksRoute = Router()
const taskController = new TasksController()

tasksRoute.use(ensureAuthenticated)
tasksRoute.post('/', taskController.create)
tasksRoute.get('/', taskController.index)
tasksRoute.get('/:id', taskController.show)
tasksRoute.put('/:id', taskController.update)
tasksRoute.delete('/:id', taskController.delete)
