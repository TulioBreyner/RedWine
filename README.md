# RedWine - Bot Discord

## Sobre o Projeto
RedWine é um bot do discord que foi desenvolvido em 2021. Visto que os bots de músicas esatavam suspensos, como sempre tive curiosidade, aproveitei a oportunidade para estudar e tentar solucionar o problema de não ter músicas no chat de voz com os amigos.

## Funcionalidades
- 🎵 **Tocar músicas** via links do YouTube ou busca por nome.
- 🔊 **Entrar e sair de canais de voz**.
- 🎶 **Gerenciar fila de reprodução**.
- 📢 **Comandos de chat e moderação**.

## Tecnologias Utilizadas
- [Node.js](https://nodejs.org/)
- [discord.js](https://discord.js.org/)
- [ytdl-core](https://www.npmjs.com/package/ytdl-core)
- [Google API (YouTube)](https://developers.google.com/youtube/)

## Pré-requisitos
Antes de rodar o bot, você precisa ter instalado:
- Node.js (versão 16 ou superior)
- Um bot configurado no [Discord Developer Portal](https://discord.com/developers/applications)
- Chave da API do YouTube

## Configuração
1. Clone este repositório:
   ```sh
   git clone https://github.com/seu-usuario/redwine-bot.git
   cd redwine-bot
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Crie um arquivo `config.json` na raiz do projeto e adicione:
   ```json
   {
       "TOKEN_DISCORD": "seu-token-aqui",
       "GOOGLE_KEY": "sua-chave-youtube-api",
       "PREFIX": "?",
       "YTDL": { "filter": "audioonly" }
   }
   ```
4. Execute o bot:
   ```sh
   node index.js
   ```

## Comandos Disponíveis
| Comando | Descrição |
|---------|-------------|
| `?join` | Entra no canal de voz |
| `?leave` | Sai do canal de voz |
| `?play <música/link>` | Toca a música solicitada |
| `?p <música/link>` | Atalho para `?play` |
| `?help` | Exibe informações sobre o bot |
| `?comandos` | Lista todos os comandos disponíveis |
| `?avatar` | Exibe o avatar do usuário |
| `?msg <mensagem>` | Envia uma mensagem no chat |

---
Desenvolvido por TulioBreyner 🚀

