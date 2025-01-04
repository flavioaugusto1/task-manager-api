import { Router } from 'express'
import { TasksController } from '@/controllers/TasksController'

export const tasksRoute = Router()
const taskController = new TasksController()

tasksRoute.post('/', taskController.create)
