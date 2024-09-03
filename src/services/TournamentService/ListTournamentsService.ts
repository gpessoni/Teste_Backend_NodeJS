import prismaClient from "../../prisma"

class ListTournamentsService {
    async execute() {
        const tournaments = await prismaClient.tournament.findMany({
            include: {
                matches: true,
                players: true,
            },
        })

        const formattedTournaments = tournaments.map((tournament) => ({
            tournamentType: tournament.type,
            tournamentName: tournament.name,
            tournamentId: tournament.id,
            matches: tournament.matches.map((match) => ({
                player1Id: match.player1Id,
                player2Id: match.player2Id,
                round: match.round,
                score1: match.score1,
                score2: match.score2,
            })),
        }))

        return formattedTournaments
    }
}

export { ListTournamentsService }
