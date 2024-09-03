import prismaClient from "../../prisma";

class ListTournamentsService {
    async execute() {
        const tournaments = await prismaClient.tournament.findMany({
            include: {
                matches: true,
                players: true,
            },
        });

        const formattedTournaments = await Promise.all(tournaments.map(async (tournament) => {
            let champion: number | null = null;

            if (tournament.type === "ELIMINATORY" && tournament.matches.length > 0) {
                const lastMatch = tournament.matches[tournament.matches.length - 1];
                champion = lastMatch.score1 > lastMatch.score2
                    ? lastMatch.player1Id
                    : lastMatch.player2Id;
            } else if (tournament.type === "GROUP") {
                champion = await this.calculateGroupChampion(tournament.id);
            }

            return {
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
                champion,
            };
        }));

        return formattedTournaments;
    }

    async calculateGroupChampion(tournamentId: number) {
        const players = await prismaClient.player.findMany({
            where: { tournamentId },
            include: {
                matchesAsPlayer1: true,
                matchesAsPlayer2: true,
            },
        });

        const playerScores = players.map(player => {
            let points = 0;
            let goalsFor = 0;
            let goalsAgainst = 0;

            player.matchesAsPlayer1.forEach(match => {
                goalsFor += match.score1;
                goalsAgainst += match.score2;
                points += match.score1 > match.score2 ? 3 : match.score1 === match.score2 ? 1 : 0;
            });

            player.matchesAsPlayer2.forEach(match => {
                goalsFor += match.score2;
                goalsAgainst += match.score1;
                points += match.score2 > match.score1 ? 3 : match.score2 === match.score1 ? 1 : 0;
            });

            return {
                playerId: player.id,
                points,
                goalDifference: goalsFor - goalsAgainst,
                goalsFor,
            };
        });

        playerScores.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
        });

        return playerScores[0]?.playerId ?? null;
    }
}

export { ListTournamentsService }
