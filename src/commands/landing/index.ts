import { SubcommandGroup } from '@made-simple/discord.js';

export interface LandingData {
    message?: string | null;
    channel?: string | null;
}

export default new SubcommandGroup('landing', {
    allowedInDMs: false
})
    .setDescription('Commands for the landing channel')
    .setDefaultMemberPermissions(26672);
