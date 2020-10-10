const fetch = require('node-fetch');
const spawn = require('child_process').spawn;
const Discord = require('discord.js');
const client = new Discord.Client();

//basic required server info
const server = {
    ip: 'INSERT-IP', // Mc Server's IP address
    port: 25565, // MC Server's query port :: change if different.
    version: 'INSERT-VERSION' //MC Server's version
};

// MC SERVER STARTUP SCRIPT

// The starter.bat has to include a 'cd "C:/Users/_____/Desktop/Server/"' command
const MC_SERVER_START_SCRIPT = "INSERT-HERE";
var mcserver;

function startCommand(message) {
    try {
        // Starting the server requires a special role named "ServerStarter"
        if(!message.member.roles.cache.find(r => r.name === "ServerStarter")) return message.reply(commands.start.text.wrongperms)
        else {
            // Start the server
            message.reply("Starting server...");
            mcserver = spawn(MC_SERVER_START_SCRIPT);

            mcserver.stdout.on('data', (data) => {
                console.log("stdout: " + data);
                // Not everything is send (because i think there is a send limit per time)
            });

            mcserver.stderr.on('data', (data) => {
                console.log("stderr: " + data);
                message.reply("Data: " + data);
            });

            mcserver.on('close', (code) => {
                console.log("child process exited with code " + code);
            });
        }
    }
    catch {
        console.error('Error: Unknown Error');
        return message.reply(commands.start.text.error);
    };
}


// Base Command System
const commands = {
    status: {
        command: '!status',
        text: {
            error: 'Error getting Minecraft server status...', // Check your terminal when you see this
            offline: 'The server is currently offline',
            online: '**Minecraft** server is **online**  -  ',
            players: '**{online}** people are playing!', // {online} will show player count
            noPlayers: '**Nobody is playing**'
        }
        
    },
    ip: {
        command: '!ip',
        text: {
            main: 'The main IP for the server is `{ip}`.' // If the server is hosted on a different port to 25565 and you don't have a DNS change the code here to 'The IP for the server is `{ip} + {port}`'
        }
    },
    version: {
        command:'!version',
        text: {
            main: '`{ip}` is currently running {version}'
        }
    },
    start: {
        command: '!start',
        text: {
            startup: 'Starting server...',
            error: 'I\'m sorry, I couldn\'t start the server. Try again in a few minutes, and if the error persists tell the bot developer.',
            wrongperms: 'Sorry, but you don\'t have permission to execute that command. This command can only be executed by someone with a role named `ServerStarter`.'
        }
    }
};

// bot activity + setup console log + log module
client.login('INSERT-TOKEN-HERE');
client.on('ready', () => {
    console.log(`${client.user.username} is now active.`);	// logs in console that the bot is ready to be used once fully loaded.
	client.user.setActivity("!botinfo | !cmds", {type: "PLAYING"}) // info >> https://discord.js.org/#/docs/main/11.6.4/class/ClientUser?scrollTo=setActivity 
});

// easy command system
const prefix = '!';

client.on('message', message=>{
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLocaleLowerCase();

// !help | lists out all of the bot commands
    if (command === 'cmds') {
        const helpCommand = new Discord.MessageEmbed()
            .setColor('db6d07')
            .setTitle('All Commands for this Bot:')
            .setDescription('!cmds > Displays this info box.\n!botinfo > This discord bot\'s \"About Me\" section.\n!status > Displays the current status of the Minecraft Server.\n!ip > Lists the main IP of the Minecraft Server.\n!serverinfo > Displays a helpful info box containing the most important server info.\n!version > Lists the current server version.\n!rules > Lists the server rules.\n!start > Starts the Minecraft Server (Requires the Role "ServerStarter")')
            .setAuthor('ServerStatus', 'https://media.discordapp.net/attachments/709051531499929614/741588576437010462/alex.jpg?width=465&height=465')
            .setFooter('Created by Nickel')
            .setTimestamp()
        try {
            message.reply(helpCommand);
        } catch {
            message.reply(`Sorry ${message.author.username}, I cannot respond to your command.`)
        }
    }

// !serverinfo | lists out a bunch of server info shit idk im tired
    if (command === 'serverinfo') {
        const serverInfo = new Discord.MessageEmbed()
            .setColor('098fe3')
            .setTitle('Server Information')
            .setDescription('**Current Server IP Addresses:**\nMain: INSERT-SERVER-IP\n\n**Server Version:** \nINSERT-SERVER-VERSION') // can be changed to match your liking.
            .setAuthor('ServerStatus', 'https://media.discordapp.net/attachments/709051531499929614/741588576437010462/alex.jpg?width=465&height=465')
            .setFooter('Created by Nickel')
            .setTimestamp()
        try {
            message.reply(serverInfo);
        } catch {
            message.reply(`Sorry ${message.author.username}, I cannot respond to your command.`)
        }
    }

    // !botinfo | displays a message of information regarding this discord bot
    if(command === 'botinfo') {
        message.channel.send('**About this bot:**\nThis Discord Utility bot was created by **Nickel** using vegeta897\'s ServerBot Framework\n(Which can be found here: https://gist.github.com/vegeta897/e4410669c921c2ab7635e1d0153b0bc6)');
    } else

    // !rules | lists out the rules of the server to whoever asked.
    if(command === 'rules') {
        message.channel.send('INSERT-RULES') // remember to insert your server rules here.
    };
});

// Do not edit below this line unless you know what you're doing

const url = 'https://mcapi.us/server/status?ip=' + server.ip + '&port=' + server.port;
const cacheTime = 5 * 60 * 1000; // 5 minute API cache time
let data, lastUpdated = 0;

client.on('message', message => { // Listen for messages and trigger commands
    if(message.content.trim() == commands.status.command) {
        statusCommand(message)
    } else if(message.content.trim() == commands.ip.command) {
        ipCommand(message)
    } else if(message.content.trim() == commands.version.command) {
        versionCommand(message)
    } else if(message.content.trim() == commands.start.command) {
        startCommand(message)
    }
});

function statusCommand(message) { // Handle status command
    if(Date.now() > lastUpdated + cacheTime) { // Cache expired or doesn't exist
        fetchStatus()
        .then(body => {
            if(body.status === 'success') return body;
            else throw body.error || 'unknown API error';
        })
        .then(body => {
            data = body;
            lastUpdated = body.last_updated * 1000 || Date.now();
            lastUpdated = Math.min(lastUpdated, Date.now()); // Last updated time can't be in the future
            lastUpdated = Math.max(lastUpdated, Date.now() - cacheTime + 60000); // Wait at least 1 minute
            replyStatus(message, data)
        })
        .catch(err => {
            console.error('Error:', err);
            return message.reply(commands.status.text.error);
        });
    } else { // Use cached data
        replyStatus(message)
    }
}

function replyStatus(message) {
    let { text } = commands.status;
    let status = text.offline;
    if(data.online) {
        status = text.online;
        status += data.players.now ? text.players : text.noPlayers;
        status = status.replace('{online}', data.players.now);
    }
    message.reply(status);
}

function fetchStatus() {
    return fetch(url)
        .then(res => {
            if(res.ok) return res;
            else throw res.statusText;
        })
        .then(res => res.json())
}

function ipCommand(message) { // Handle IP command
    message.reply(commands.ip.text.main.replace('{ip}', server.ip).replace('{port}', server.port));
}

function versionCommand(message) { // Handle IP command
    message.reply(commands.version.text.main.replace('{version}', server.version).replace('{ip}', server.ip).replace('{port}', server.port));
}

// Credit to The MG#8238 on Discord for improvements to this script
