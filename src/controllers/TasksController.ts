import { prisma } from '@/database/prisma'
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

    async index(request: Request, response: Response) {}
}
