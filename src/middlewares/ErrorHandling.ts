import { AppError } from '@/utils/AppError'
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

export function errorHandling(
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
) {
    if (error instanceof AppError) {
        return response
            .status(error.statusCode)
            .json({ message: error.message })
    }

    if (error instanceof ZodError) {
        return response.status(400).json({
            message: 'Validation error',
            issue: error.format(),
        })
    }

    console.log(error)

    return response.status(500).json({ message: 'Internal server error' })
}
