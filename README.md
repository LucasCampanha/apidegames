# 🎮 API Games – Endpoints & Authentication

API simples em **Node.js + Express** protegida com **JWT**, para gerenciamento de jogos.

---

## 🔐 Autenticação

### 📍 **POST /auth**

Gera o token JWT para acessar as rotas protegidas.

#### **Body**
```json
{
  "email": "seu_email@example.com",
  "password": "sua_senha"
}
Resposta
json
Copiar código
{
  "message": "Tudo certo!",
  "token": "SEU_TOKEN_AQUI"
}
Enviar token nas requisições protegidas
makefile
Copiar código
Authorization: Bearer SEU_TOKEN_AQUI
📘 Rotas da API
⚠️ Todas as rotas abaixo exigem autenticação JWT.

🎮 Games
📍 GET /games
Retorna todos os jogos.

📍 GET /game/:id
Retorna um jogo específico.

Parâmetro	Tipo	Descrição
id	Number	ID do jogo

📍 POST /game
Cria um novo jogo.

Body
json
Copiar código
{
  "title": "Nome do jogo",
  "year": 2024,
  "price": 59
}
📍 PUT /game/:id
Atualiza um jogo existente.

Body (opcional)
json
Copiar código
{
  "title": "Novo título",
  "year": 2020,
  "price": 39
}
📍 DELETE /game/:id
Remove um jogo pelo ID.

🛡 Middleware de Autorização (JWT)
makefile
Copiar código
Authorization: Bearer SEU_TOKEN_AQUI
O token é validado pelo middleware auth, que bloqueia requisições sem autenticação.

yaml
