import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import { z } from 'zod'

export class TasksController {
    async create(request: Request, response: Response) {
        const requestBodySchema = z.object({
            title: z.string(),
            description: z.string(),
            time: z.string().date(),
        })

        const { title, description, time } = requestBodySchema.parse(
            request.body,
        )

        const task = await prisma.task.create({
            data: {
                title,
                description,
                time: new Date(time),
            },
        })

        response.status(201).json(task)
    }

    async index(request: Request, response: Response) {
        const requestQuerySchema = z.object({
            orderBy: z.enum(['asc', 'desc']).optional(),
        })

        const { orderBy } = requestQuerySchema.parse(request.query)

        const tasks = await prisma.task.findMany({
            orderBy: {
                time: orderBy,
            },
        })

        const total = tasks.length

        response.json({ total, tasks })
    }

    async show(request: Request, response: Response) {
        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const requestQuerySchema = z.object({
            orderBy: z.enum(['asc']),
        })

        const { id } = requestParamSchema.parse(request.params)

        const task = await prisma.task.findFirst({
            where: {
                id,
            },
        })

        if (!task) {
            throw new AppError('A task informada não existe.', 404)
        }

        response.json(task)
    }
}
