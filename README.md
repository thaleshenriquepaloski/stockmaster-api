# StockMaster API 📦

API RESTful para gerenciamento de estoque, desenvolvida com Node.js, Express, Prisma ORM e SQLite.

## 📋 Sobre o Projeto

O **StockMaster API** é um sistema de controle e gestão de estoque projetado com foco em boas práticas de arquitetura de software, separação de responsabilidades e facilidade de manutenção.

---

## 🛠️ Tecnologias Utilizadas

- **Runtime:** Node.js (ES Modules)
- **Framework Web:** Express.js
- **ORM:** Prisma 7
- **Banco de Dados:** SQLite (`better-sqlite3`)
- **Segurança:** Bcrypt (Hash de senhas) e JSON Web Token (JWT)
- **Gerenciador de Dependências:** npm

---

## 🏗️ Arquitetura do Projeto

O projeto segue a arquitetura em camadas (Layered Architecture), separando as responsabilidades em:

```text
stockmaster-api/
├── prisma/               # Schemas e migrações do banco de dados
├── src/
│   ├── controllers/      # Camada de entrada (trata requisições e respostas HTTP)
│   ├── database/         # Instância e configuração de conexão do Prisma Client
│   ├── routes/           # Definição das rotas e endpoints do Express
│   ├── services/         # Camada de regras de negócio e acesso a dados
│   └── app.js            # Configuração das middlewares e rotas do Express
├── .env                  # Variáveis de ambiente
├── dev.db                # Banco de dados SQLite local
└── server.js             # Ponto de entrada (Entrypoint) do servidor HTTP
```

Como Executar o Projeto:

Pré requisitos: 

 - Node.js instalado (versão 18 ou superior recomendada);
 - npm instalado

Passo a Passo:

1. Clone o repositório:

 - git clone <URL DO REP>
 - cd stockmaster-api

2. Instale as dependências:

 - npm install

3. Configure as Variáveis de Ambiente:

    Crie ou certifique-se de ter um arquivo .env na raiz do projeto com a seguinte variável:

     - DATABASE_URL="file:./dev.db"

4. Execute as migrações do Prisma:

 - npx prisma migrate dev

5. Inicie o servidor de desenvolvimento:

 - npm run dev
 
 A aplicação estará rodando em http://localhost:3000 (ou na porta configurada).


Documentação dos Endpoints

### Autenticação (/auth) ###

| Método | Endpoint | Descrição | Corpo da Requisição (JSON) | Status de Sucesso |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/auth/cadastro` | Cadastra um novo usuário com senha criptografada | `{ "nome": "...", "email": "...", "senha": "..." }` | `201 Created` |
| **POST** | `/auth/login` | Faz login e devolve um Token JWT | `{ "email": "...", "senha": "..." }` | `200 Ok` |

### 👤 Usuários (`/usuarios`)

| Método | Endpoint | Descrição | Corpo da Requisição (JSON) | Status de Sucesso |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/usuarios` | Lista todos os usuários | Nenhum | `200 OK` |
| **DELETE** | `/usuarios/:id` | Rota para deletar usuários durante o desenvolvimento da API | Nenhum | `200 Ok` |

## Produtos (`/produtos`)

| Método | Endpoint | Descrição | Corpo da Requisição (JSON) | Status de Sucesso |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/produtos` | Lista todos os produtos | Nenhum | `200 OK` |
| **GET** | `/produtos/:id` | Busca um produto específico pelo ID | Nenhum | `200 OK` |
| **POST** | `/produtos` | Cadastra um novo produto | `{ "nome": "...", "descricao": "...", "preco": 10.5, "qtd_estoque": 10 }` | `201 Created` |
| **PUT** | `/produtos/:id` | Atualiza dados de um produto | `{ "nome": "...", "descricao": "...", "preco": 12.0, "qtd_estoque": 15 }` | `200 OK` |
| **DELETE** | `/produtos/:id` | Remove um produto pelo ID | Nenhum | `200 OK` |

## Vendas (`/vendas`)

| Método | Endpoint | Descrição | Corpo da Requisição (JSON) | Status de Sucesso |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/vendas` | Lista todas as vendas | Nenhum | `200 OK` |
| **GET** | `/vendas/:id` | Busca uma venda específica pelo ID | Nenhum | `200 OK` |
| **POST** | `/produtos` | Realiza uma nova venda | `{ "produto_id": "...", "usuario_id": "...", "qtd_vendida": "..." }` | `201 Created` |

# Próximos Passos & Funcionalidades Futuras

- [x] Autenticação e Autorização (JWT)
- [x] CRUD em Produtos
- [x] CRUD em Vendas
- [x] Movimentações de Estoque (Entradas e Saídas)
- [ ] Middleware Global de Tratamento de Erros (Ainda não obrigatório no projeto)
- [ ] Códigos HTTP ajustados para cada tipo de erro
- [ ] Midleware de autenticação para rotas específicas.