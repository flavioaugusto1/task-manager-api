import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { getTodayDate } from '@/utils/GetTodayDate'
import { Request, Response } from 'express'
import { z } from 'zod'

export class TasksController {
    async create(request: Request, response: Response) {
        const requestBodySchema = z.object({
            title: z.string(),
            description: z.string(),
            time: z.string().date(),
        })

        const { id } = request.user

        const { title, description, time } = requestBodySchema.parse(
            request.body,
        )

        const today = getTodayDate()

        if (today > new Date(time)) {
            throw new AppError(
                'Não é possível cadastrar uma data menor que a atual',
                409,
            )
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                time: new Date(time),
                user_id: id,
            },
        })

        response.status(201).json(task)
    }

    async index(request: Request, response: Response) {
        const requestQuerySchema = z.object({
            orderBy: z.enum(['asc', 'desc']).optional(),
        })

        const { id } = request.user

        const { orderBy } = requestQuerySchema.parse(request.query)

        const tasks = await prisma.task.findMany({
            where: {
                user_id: id,
            },
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

        const { id: user_id } = request.user

        const { id } = requestParamSchema.parse(request.params)

        const task = await prisma.task.findFirst({
            where: {
                id,
                user_id,
            },
        })

        if (!task) {
            throw new AppError('A task informada não existe.', 404)
        }

        response.json(task)
    }

    async update(request: Request, response: Response) {
        const requestBodySchema = z.object({
            title: z.string(),
            description: z.string(),
            time: z.string().date(),
        })

        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { id: user_id } = request.user

        const { title, description, time } = requestBodySchema.parse(
            request.body,
        )

        const { id } = requestParamSchema.parse(request.params)

        const task = await prisma.task.findFirst({
            where: {
                user_id,
            },
        })

        if (!task) {
            throw new AppError('Task informada não existe.', 404)
        }

        await prisma.task.update({
            where: {
                id,
                user_id,
            },
            data: {
                title,
                description,
                time: new Date(time),
            },
        })

        response.json({ message: 'Task atualizada com sucesso.' })
    }

    async delete(request: Request, response: Response) {
        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { id: user_id } = request.user

        const { id } = requestParamSchema.parse(request.params)

        const task = await prisma.task.findFirst({
            where: {
                id,
                user_id,
            },
        })

        if (!task) {
            throw new AppError('Task não encontrada!', 404)
        }

        await prisma.task.delete({
            where: {
                id,
            },
        })

        response.json({ message: 'Task deletada com sucesso' })
    }
}
