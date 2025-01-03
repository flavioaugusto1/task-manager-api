import 'express-async-errors'
import express, { Request, Response, NextFunction } from 'express'
import { errorHandling } from './middlewares/ErrorHandling'
import { route } from './routes'

export const app = express()

app.use(express.json())

app.use(route)

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    errorHandling(error, req, res, next)
})
