import { SubcommandGroup } from '@made-simple/discord.js';

export default new SubcommandGroup('wipe', {
    allowedInDMs: false
})
    .setDescription('The wipe command group.')
    .setDefaultMemberPermissions(8240);
