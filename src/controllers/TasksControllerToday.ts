import { prisma } from '@/database/prisma'
import { getTodayDate } from '@/utils/GetTodayDate'
import { Request, Response } from 'express'

export class TasksControllerToday {
    async index(request: Request, response: Response) {
        const today = getTodayDate()

        const { id: user_id } = request.user

        const task = await prisma.task.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                time: true,
            },
            where: {
                time: today,
                user_id,
            },
        })

        response.json({ task })
    }
}
