import { Router } from 'express'
import { TasksController } from '@/controllers/TasksController'
import { ensureAuthenticated } from '@/middlewares/EnsureAtuhenticated'
import { TasksControllerToday } from '@/controllers/TasksControllerToday'

export const tasksRoute = Router()
const taskController = new TasksController()
const taskControllerToday = new TasksControllerToday()

tasksRoute.use(ensureAuthenticated)
tasksRoute.post('/', taskController.create)
tasksRoute.get('/', taskController.index)
tasksRoute.get('/:id', taskController.show)
tasksRoute.get('/status/today', taskControllerToday.index)
tasksRoute.put('/:id', taskController.update)
tasksRoute.delete('/:id', taskController.delete)
