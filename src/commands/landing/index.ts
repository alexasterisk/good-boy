import { SubcommandGroup } from '@made-simple/discord.js';

export default new SubcommandGroup('landing', {
    allowedInDMs: false
})
    .setDescription('Commands for the landing channel')
    .setDefaultMemberPermissions(26672);
