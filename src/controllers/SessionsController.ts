import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { compare } from 'bcrypt'
import { Request, Response } from 'express'
import { z } from 'zod'
import { sign } from 'jsonwebtoken'
import { authConfig } from '@/configs/auth'

export class SessionsController {
    async create(request: Request, response: Response) {
        const requestBodySchema = z.object({
            email: z.string().email(),
            password: z.string(),
        })

        const { email, password } = requestBodySchema.parse(request.body)

        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (!user) {
            throw new AppError('E-mail e/ou senha inválidos.', 401)
        }

        const matchPassword = await compare(password, user.password)

        if (!matchPassword) {
            throw new AppError('E-mail e/ou senha inválidos.', 401)
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        })

        const { password: _, ...userWithoutPassword } = user

        response.json({ user: userWithoutPassword, token })
    }
}
