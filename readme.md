# Torneio Generator API

Este projeto é uma API que gera chaveamentos de torneios com base no número de jogadores e no tipo de chaveamento. O backend foi desenvolvido utilizando Node.js, Prisma como ORM, e PostgreSQL como banco de dados.

## Funcionalidades

### Chave Eliminatória

-   Gera confrontos iniciais e avança os vencedores automaticamente até a final.
-   Trata casos em que o número de jogadores não é uma potência de 2, gerando byes conforme necessário.

### Grupo Único

-   Organiza todos os jogadores em um grupo.
-   Cria uma tabela onde todos jogam contra todos, registrando os resultados.

## Tecnologias Utilizadas

-   **Node.js**: Plataforma de desenvolvimento backend.
-   **Prisma**: ORM utilizado para interagir com o banco de dados.
-   **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.

## Pré-requisitos

-   [Node.js](https://nodejs.org/) instalado.
-   [Docker](https://www.docker.com/) instalado.

## Configuração do Projeto

1. **Renomeie o arquivo `.env_example` para `.env`.**

    - Este arquivo contém variáveis de ambiente essenciais para o funcionamento da aplicação, como credenciais do banco de dados.

2. **Instale as dependências:**

    ```bash
    npm install
    ```

    - Esse comando instala todas as dependências listadas no `package.json`.

3. **Suba o container com o banco de dados:**

    ```bash
    docker-compose up -d
    ```

    - Este comando utiliza o Docker Compose para criar e rodar um container com o PostgreSQL em segundo plano.

4. **Execute as migrações do Prisma:**

    ```bash
    npx prisma migrate dev
    ```

    - Esse comando aplica as migrações ao banco de dados, criando as tabelas e estruturas necessárias.

5. **Inicie o servidor backend:**
    ```bash
    npm run dev
    ```
    - Este comando inicia o servidor backend em modo de desenvolvimento, permitindo que você faça testes e desenvolva a API.

## Uso

Após configurar e iniciar o servidor, a API estará disponível para receber requisições do frontend. Você pode usar ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) para testar as rotas.

Este projeto é licenciado sob a [MIT License](LICENSE).
