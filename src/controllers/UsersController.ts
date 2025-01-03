import { Request, Response } from 'express'
import { z } from 'zod'
import { hash } from 'bcrypt'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'

export class UsersController {
    async create(request: Request, response: Response) {
        const requestBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
        })

        const { name, email, password } = requestBodySchema.parse(request.body)

        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (user) {
            throw new AppError('Usuário já existente. Tente outro e-mail!', 401)
        }

        const hashedPassword = await hash(password, 8)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        const { password: _, ...userWithoutPassword } = newUser

        response.status(201).json({ user: userWithoutPassword })
    }
}
