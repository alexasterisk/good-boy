import { Client } from '@made-simple/discord.js';
import { ActivityType } from 'discord.js';

const statuses: Record<string, string[]> = {
    Playing: ['with a bone', 'with a ball', 'with a stick'],
    Listening: ['the birds', 'the wind', 'cats fight'],
    Watching: ['cats fight', 'rain fall', 'the sun set'],
    Competing: ['a dog contest', 'a game with cats', 'their owners affection']
};

export function updateStatus(client: Client<object>) {
    const statusType = Math.floor(Math.random() * 4);
    const status = statuses[Object.keys(statuses)[statusType]];
    const statusText = status[Math.floor(Math.random() * status.length)];

    client.user?.setPresence({
        activities: [
            {
                name: statusText + '.',
                type: ActivityType[Object.keys(statuses)[statusType]]
            }
        ]
    });
}
