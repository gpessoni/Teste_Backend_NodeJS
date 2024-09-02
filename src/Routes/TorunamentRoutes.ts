import { Router } from "express"
import { GenerateTournamentController } from "../controllers/TournamentController/GenerateTournamentController"
import { ListTournamentController } from "../controllers/TournamentController/ListTournamentController"
import { DeleteTournamentController } from "../controllers/TournamentController/DeleteTournamentController"

const tournamentRoutes = Router()

tournamentRoutes.get("/", new ListTournamentController().handle)
tournamentRoutes.post("/generate", new GenerateTournamentController().handle)
tournamentRoutes.delete("/:id", new DeleteTournamentController().delete)

export { tournamentRoutes }
