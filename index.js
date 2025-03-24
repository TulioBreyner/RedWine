const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const { google } = require('googleapis');
const configs = require('./config.json');

const youtube = google.youtube({
    version: 'v3',
    auth: configs.GOOGLE_KEY
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const prefixo = configs.PREFIX;

const servidores = {
    'server': {
        connection: null,
        dispatcher: null,
        fila: [],
        estouTocando: false
    }
};

client.on("ready", () => {
    console.log("Estou online!");

    setInterval(() => {
        client.user.setPresence({
            status: "online",
            activities: [{ name: "?help", type: "PLAYING" }]
        });
    }, 15 * 1000);
});

client.on("messageCreate", async (msg) => {
    if (!msg.guild || !msg.content.startsWith(prefixo)) return;

    // Comandos de música
    if (msg.content === prefixo + 'join') {
        try {
            servidores.server.connection = await msg.member.voice.channel.join();
        } catch (err) {
            console.log('Erro ao entrar no canal de voz:', err);
        }
    }

    if (msg.content === prefixo + 'leave') {
        if (msg.member.voice.channel) {
            servidores.server.connection.disconnect();
            servidores.server.connection = null;
            servidores.server.dispatcher = null;
        }
    }

    if (msg.content === prefixo + 'toca aquela') {
        servidores.server.connection = await msg.member.voice.channel.join();
        servidores.server.connection.play(ytdl('https://www.youtube.com/watch?v=eZ2drH7vCcU'));
    }

    if (msg.content.startsWith(prefixo + 'play') || msg.content.startsWith(prefixo + 'p')) {
        let MusicaPedida = msg.content.split(' ').slice(1).join(' ');

        if (!MusicaPedida.length) {
            msg.channel.send({ content: 'Me fale o nome ou link da música para eu poder tocar' });
            return;
        }

        if (!servidores.server.connection) {
            try {
                servidores.server.connection = await msg.member.voice.channel.join();
            } catch (err) {
                console.log('Erro ao entrar no canal de voz:', err);
            }
        }

        if (ytdl.validateURL(MusicaPedida)) {
            servidores.server.fila.push(MusicaPedida);
            tocaMusicas();
        } else {
            youtube.search.list({
                q: MusicaPedida,
                part: 'snippet',
                fields: 'items(id(videoId),snippet(title))',
                type: 'video'
            }, (err, resultado) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (resultado) {
                    const id = resultado.data.items[0].id.videoId;
                    servidores.server.fila.push(`https://www.youtube.com/watch?v=${id}`);
                    tocaMusicas();
                }
            });
        }
    }

    // Comandos de chat
    if (msg.content === prefixo + 'help') {
        const embed = new EmbedBuilder()
            .setColor([50, 0, 0])
            .setTitle('🍷 Prazer, eu sou a RedWine')
            .setDescription('Fui criada por TulioBreyner, um amante de programação com a intenção de fazer do Discord um lugar melhor!')
            .addFields({ name: '🔧 Ajuda', value: 'Use ***?comandos*** para ver mais sobre minha lista de comandos.' });

        msg.channel.send({ embeds: [embed] });
    }

    if (msg.content === prefixo + 'comandos') {
        const embed = new EmbedBuilder()
            .setColor([50, 0, 0])
            .setTitle('🔧 Minha lista de comandos')
            .addFields(
                { name: 'Música:', value: '`?join`, `?play`, `?p`, `?leave`' },
                { name: 'Chat/Moderação:', value: '`?msg`, `?avatar`' }
            );

        msg.channel.send({ embeds: [embed] });
    }

    if (msg.content === prefixo + 'avatar') {
        const embed = new EmbedBuilder()
            .setColor([8, 88, 168])
            .setTitle('Seu avatar aí bro')
            .setImage(msg.author.displayAvatarURL());

        msg.channel.send({ embeds: [embed] });
    }

    if (msg.content.startsWith(prefixo + 'msg')) {
        let mensagem = msg.content.slice(5);
        msg.delete();
        msg.channel.send({ content: mensagem });
    }
});

const tocaMusicas = () => {
    if (!servidores.server.estouTocando && servidores.server.fila.length > 0) {
        const tocando = servidores.server.fila[0];
        servidores.server.estouTocando = true;
        servidores.server.dispatcher = servidores.server.connection.play(ytdl(tocando, configs.YTDL));

        servidores.server.dispatcher.on('finish', () => {
            servidores.server.fila.shift();
            servidores.server.estouTocando = false;

            if (servidores.server.fila.length > 0) {
                tocaMusicas();
            } else {
                servidores.server.dispatcher = null;
            }
        });
    }
};

client.login(configs.TOKEN_DISCORD);