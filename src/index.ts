import { config } from 'dotenv';
config();

import { updateStatus, wipeMessages } from './util/index.js';
import { Client } from '@made-simple/discord.js';
import { CronJob } from 'cron';

const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'GuildMembers',
        'GuildModeration',
        'DirectMessages',
        'MessageContent'
    ],
    partials: ['Channel', 'GuildMember', 'Message']
});

const eventsFolder = new URL('events/', import.meta.url);
await client.addEventsFolder(eventsFolder);

await client.login();

new CronJob('0 0 0 * * *', () => {
    wipeMessages(client);
}).start();

new CronJob('0 */15 * * * *', () => {
    updateStatus(client);
}).start();
