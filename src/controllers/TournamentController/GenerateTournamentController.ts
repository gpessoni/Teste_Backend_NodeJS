import { Request, Response } from "express"
import { GenerateTournamentService } from "../../services/TournamentService/GenerateTournamentService"

class GenerateTournamentController {
    async handle(request: Request, response: Response) {
        const { numberOfPlayers, tournamentType } = request.body

        const generateTournamentService = new GenerateTournamentService()

        try {
            const matches = await generateTournamentService.execute({ numberOfPlayers, tournamentType })
            return response.json(matches)
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    }
}

export { GenerateTournamentController }
