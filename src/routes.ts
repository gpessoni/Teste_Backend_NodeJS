// routes.ts
import { Router } from "express"
import { tournamentRoutes } from "./Routes/TorunamentRoutes"

const router = Router()

router.use("/tournaments", tournamentRoutes)

export { router }
