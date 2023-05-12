import { config } from 'dotenv';
config();

import { updateStatus, keyv, wipeMessages } from './util/index.js';
import { Client } from '@made-simple/discord.js';
import { CronJob } from 'cron';

keyv.on('error', console.error);

const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'GuildMembers',
        'GuildModeration',
        'DirectMessages',
        'MessageContent'
    ],
    partials: ['Channel', 'GuildMember', 'Message', 'User']
});

const eventsFolder = new URL('events/', import.meta.url);
await client.addEventsFolder(eventsFolder);

const commandsFolder = new URL('commands/', import.meta.url);
await client.addCommandsFolder(commandsFolder);
await client.registerCommands(undefined, '1105735653255295079');

await client.login();

let guilds = await client.guilds.fetch();
new CronJob('0 0 0 * * *', async () => {
    guilds = await client.guilds.fetch();
    for (const guild of guilds.values()) {
        const actualGuild = await guild.fetch();
        await wipeMessages(actualGuild);
    }
}).start();

new CronJob('0 */15 * * * *', () => updateStatus(client)).start();
