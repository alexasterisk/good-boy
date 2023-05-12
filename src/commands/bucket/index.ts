import { SubcommandGroup } from '@made-simple/discord.js';

export default new SubcommandGroup('bucket', {
    allowedInDMs: false
})
    .setDescription('Manage buckets')
    .setDefaultMemberPermissions(268435504);
