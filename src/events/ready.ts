import { Client, Event } from '@made-simple/discord.js';
import { updateStatus } from '../util/index.js';

export default new Event('ready', true).setExecutor(
    (client: Client<object>) => {
        updateStatus(client);
    }
);
