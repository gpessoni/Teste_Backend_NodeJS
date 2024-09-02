import prismaClient from "../../prisma"

class DeleteTournamentService {
    async execute(tournamentId: number) {
        const tournament = await prismaClient.tournament.findUnique({
            where: { id: tournamentId },
        })

        if (!tournament) {
            throw new Error("Torneio não encontrado")
        }

        await prismaClient.match.deleteMany({
            where: { tournamentId: tournamentId },
        })

        await prismaClient.player.deleteMany({
            where: { tournamentId: tournamentId },
        })

        await prismaClient.tournament.delete({
            where: { id: tournamentId },
        })

        return { message: "Torneio excluído com sucesso" }
    }
}

export { DeleteTournamentService }
