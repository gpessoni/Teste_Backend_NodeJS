import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Iniciando a limpeza dos dados...")

    try {
        await prisma.match.deleteMany({})
        console.log("Todas as partidas foram removidas.")

        await prisma.player.deleteMany({})
        console.log("Todos os usuários foram removidos.")

        await prisma.tournament.deleteMany({})
        console.log("Todos os campeonatos foram removidos.")
    } catch (error) {
        console.error("Erro ao limpar os dados:", error)
    } finally {
        await prisma.$disconnect()
    }
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
