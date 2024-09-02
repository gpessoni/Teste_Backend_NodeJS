import { Request, Response } from "express"
import { ListTournamentsService } from "../../services/TournamentService/ListTournamentsService"

class ListTournamentController {
    async handle(request: Request, response: Response) {
        const listTournamentsService = new ListTournamentsService()

        try {
            const tournaments = await listTournamentsService.execute()
            return response.json(tournaments)
        } catch (error) {
            return response.status(500).json({ error: "Erro ao listar torneios" })
        }
    }
}

export { ListTournamentController }
