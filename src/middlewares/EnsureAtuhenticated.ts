import { authConfig } from '@/configs/auth'
import { AppError } from '@/utils/AppError'
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface TokenPayload {
    sub: string
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            throw new AppError('Token JWT não informado.', 401)
        }

        const [, token] = authHeader.split(' ')

        const { sub: user_id } = verify(
            token,
            authConfig.jwt.secret,
        ) as TokenPayload

        request.user = {
            id: user_id,
        }

        next()
    } catch (error) {
        throw new AppError('JWT informado é inválido', 401)
    }
}
