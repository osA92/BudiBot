const Discord = require('discord.js');
const config = require('./botconfig.json');
const token = require('./token.json')
const client = new Discord.Client();

let prefix = config.prefix;

//client.login(config.token);
client.login(token.token);

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

client.on('ready', () => {
    console.log('Заводи меня!');

    console.log('Servers:');
    client.guilds.cache.map((Guild) => Guild.name)
    .forEach((name,indx) => console.log((indx + 1).toString() + '. ' + name.toString()));
});

client.on('message', (message) => {
    if (message.content.toUpperCase() === 'ПРИВЕТ, БОТ'.toUpperCase()) {
        message.channel.send('Здорова');
    }

    else if (!message.content.startsWith(prefix) && message.attachments.size === 0) return;

    const args = message.content.substr(prefix.length).split(/\s+/g);
    const cmd = args.shift();

    //console.log(cmd);
    //console.log(args);

    if (cmd.toUpperCase() === 'help'.toUpperCase()) {
        const embed = new Discord.MessageEmbed()
        .setTitle('BUDI BOT HELP')
        .setDescription(config.responses.help_description)
        .addFields(config.responses.help_commands);

        message.channel.send(embed);
    }

    else if (cmd.toUpperCase() === 'prefix'.toUpperCase()) {
        if (args.length === 0) message.channel.send(config.responses.prefix_error2);
        else if (args[0].length > 1) message.channel.send(config.responses.prefix_error1);
        else if (args[0].length === 1) {
            prefix = args[0];
            message.channel.send(config.responses.prefix_success + prefix);
        }
    }

    else if (config.responses.hi.map((greeting) => greeting.toUpperCase()).includes(cmd.toUpperCase())) {
        message.channel.send(config.responses.hi[getRandomInt(config.responses.hi.length)]);
    }

    else if (cmd.toUpperCase() === 'bye'.toUpperCase()) {
        message.channel.send(config.responses.bye)
        .then(() => client.destroy());
    }

    else if (cmd.toUpperCase() === 'таймер'.toUpperCase()) {
        if (
            (args[3] != args[1]) && (
                (args.length === 2 && args[0] != isNaN && ['мин','сек'].includes(args[1]))
                || (args.length === 4 && args[0] != isNaN && ['мин','сек'].includes(args[1]) && args[2] != isNaN && ['мин','сек'].includes(args[3]))
            )
        ) {
            let mins = 0;
            let secs = 0;

            switch (args[1]) {
                case 'сек':
                    secs = parseFloat(args[0]);
                    break;
                case 'мин':
                    mins = parseFloat(args[0]);
                    break;
            }

            switch (args[3]) {
                case 'сек':
                    secs = parseFloat(args[2]);
                    break;
                case 'мин':
                    mins = parseFloat(args[2]);
                    break;
            }

            let secondsRemain = mins * 60 + secs;

            if (secondsRemain > 0) {
                message.channel.send('Поехали!')
                .then(async() => {
                    function timer(seconds) {
                        return new Promise((resolve) => {
                            client.setTimeout(() => {
                                resolve('Готово');
                            }, seconds * 100);
                        })
                    }

                    while (secondsRemain > 0) {
                        if (secondsRemain > 60) {
                            if (secondsRemain % 60 > 0) {
                                await timer(secondsRemain % 60);
                                secondsRemain = secondsRemain - (secondsRemain % 60);
                                message.channel.send('Осталось '+ Math.floor(secondsRemain / 60) +' мин');
                            }
                            else {
                                await timer(60);
                                secondsRemain = secondsRemain - 60;
                                message.channel.send('Осталось '+ Math.floor(secondsRemain / 60) +' мин');
                            }
                        }
                        else if (secondsRemain <= 60 && secondsRemain > 30) {
                            await timer(secondsRemain - 30);
                            secondsRemain = 30;
                            message.channel.send('Осталось 30 сек');
                        }
                        else if (secondsRemain <= 30 && secondsRemain > 10) {
                            await timer(secondsRemain - 10);
                            secondsRemain = 10;
                            message.channel.send('Осталось 10 сек');
                        }
                        else if (secondsRemain <= 10) {
                            await timer(secondsRemain);
                            secondsRemain = 0;
                            message.channel.send('Время вышло!');
                        }
                    }
                })
            }
            else if (secondsRemain === 0)
                message.channel.send(config.responses.timer_error_0);

            else
                message.channel.send(config.responses.timer_error_sub0);
        }

        else
            message.channel.send(config.responses.timer_error);
    }

    else if (cmd.toUpperCase() === 'go'.toUpperCase()) {
        let voiceChannel = message.member.voice.channel;

        if (voiceChannel) {
            voiceChannel.join()
            .then(connection => {
                let stream = connection.play('./servisnyy_zvonok.mp3');
                stream.on('finish', () => {
                    stream.destroy();
                    voiceChannel.leave();
                })
            });
        }
    }

    if(message.attachments.size > 0) {
        if (getRandomInt(100) > 66)
            message.channel.send(config.responses["attachement-message"][getRandomInt(config.responses["attachement-message"].length)]);
        
        if (getRandomInt(100) > 49)
            message.react(config.responses["attachement-reaction"][getRandomInt(config.responses["attachement-reaction"].length)]);
    }
});
