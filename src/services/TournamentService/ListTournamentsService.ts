import prismaClient from "../../prisma"

class ListTournamentsService {
    async execute() {
        const tournaments = await prismaClient.tournament.findMany({
            include: {
                matches: true, 
                players: true,
            },
        })

        return tournaments
    }
}

export { ListTournamentsService }
