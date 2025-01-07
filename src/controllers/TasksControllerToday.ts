import { prisma } from '@/database/prisma'
import { Request, Response } from 'express'

export class TasksControllerToday {
    async index(request: Request, response: Response) {
        const date = new Date()
        const day = date.getDate().toString().padStart(2, '0')
        const month = date.getDay().toString().padStart(2, '0')
        const year = date.getFullYear().toString()

        const { id: user_id } = request.user

        const task = await prisma.task.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                time: true,
            },
            where: {
                time: new Date(`${year}-${month}-${day}`),
                user_id,
            },
        })

        response.json({ task })
    }
}
