import prismaClient from "../../prisma"

interface GenerateTournamentRequest {
    numberOfPlayers: number
    tournamentType: "ELIMINATORY" | "GROUP"
}

class GenerateTournamentService {
    async execute({ numberOfPlayers, tournamentType }: GenerateTournamentRequest) {
        if (tournamentType === "ELIMINATORY" && !this.isPowerOfTwo(numberOfPlayers)) {
            throw new Error("O número de jogadores deve ser uma potência de 2 para torneios eliminatórios.")
        }

        const tournament = await prismaClient.tournament.create({
            data: {
                name: `Tournament ${new Date().toISOString()}`,
                type: tournamentType,
            },
        })

        const players = await this.createPlayers(numberOfPlayers, tournament.id)

        let matches = []

        if (tournamentType === "ELIMINATORY") {
            matches = this.generateEliminatory(players)
        } else if (tournamentType === "GROUP") {
            matches = this.generateGroup(players)
        }

        await prismaClient.match.createMany({
            data: matches.map((match) => ({
                player1Id: match.player1Id,
                player2Id: match.player2Id,
                round: match.round,
                score1: match.score1,
                score2: match.score2,
                tournamentId: tournament.id,
            })),
        })

        const champion =
            matches[matches.length - 1].score1 > matches[matches.length - 1].score2
                ? matches[matches.length - 1].player1Id
                : matches[matches.length - 1].player2Id

        return {
            tournamentType: tournamentType,
            tournamentName: tournament.name,
            tournamentId: tournament.id,
            matches,
            champion,
        }
    }

    getUniqueRandomScore(existingScores: number[]): number {
        let score: number
        do {
            score = Math.floor(Math.random() * 5)
        } while (existingScores.includes(score))
        return score
    }

    isPowerOfTwo(n: number) {
        return n > 0 && (n & (n - 1)) === 0
    }

    async createPlayers(numberOfPlayers: number, tournamentId: number) {
        const players = Array.from({ length: numberOfPlayers }, (_, index) => ({
            name: `Player ${index + 1}`,
            tournamentId: tournamentId,
        }))

        await prismaClient.player.createMany({
            data: players,
            skipDuplicates: true,
        })

        const createdPlayers = await prismaClient.player.findMany({
            where: {
                tournamentId: tournamentId,
            },
        })

        return createdPlayers
    }

    generateEliminatory(players: { id: number }[]) {
        const matches = [];
        let round = 1;

        // Calcula o próximo número de potência de dois para garantir um número de jogadores válido
        const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(players.length)));
        let paddedPlayers = [...players, ...Array(powerOfTwo - players.length).fill(null)];

        while (paddedPlayers.length > 1) {
            const currentRoundMatches = [];

            for (let i = 0; i < paddedPlayers.length; i += 2) {
                const player1 = paddedPlayers[i];
                const player2 = paddedPlayers[i + 1] || null;

                // Gera os scores aleatórios para os jogadores
                const score1 = this.getUniqueRandomScore([]);
                const score2 = this.getUniqueRandomScore([]);

                const match = {
                    player1Id: player1?.id ?? null,
                    player2Id: player2?.id ?? null,
                    round,
                    score1,
                    score2,
                };
                currentRoundMatches.push(match);
                matches.push(match);
            }

            // Prepara a lista de jogadores para a próxima rodada
            paddedPlayers = currentRoundMatches.map((m) => ({
                id: m.score1 > m.score2 ? m.player1Id : m.player2Id,
            }));

            round++;
        }

        return matches;
    }

    generateGroup(players: { id: number }[]) {
        const matches = []
        const round = 1

        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                const score1 = this.getUniqueRandomScore([])
                const score2 = this.getUniqueRandomScore([])

                matches.push({
                    player1Id: players[i].id,
                    player2Id: players[j].id,
                    round,
                    score1,
                    score2,
                })
            }
        }

        return matches
    }
}

export { GenerateTournamentService }
