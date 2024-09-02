import { Request, Response } from "express"
import { DeleteTournamentService } from "../../services/TournamentService/DeleteTournamentService "

class DeleteTournamentController {
    async delete(request: Request, response: Response) {
        const { id } = request.params
        const deleteTournamentService = new DeleteTournamentService()

        try {
            await deleteTournamentService.execute(parseInt(id, 10))
            return response.status(200).json({ message: "Torneio excluído com sucesso" })
        } catch (error) {
            return response.status(404).json({ error: error.message })
        }
    }
}

export { DeleteTournamentController }
