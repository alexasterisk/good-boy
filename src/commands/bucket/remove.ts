import { Subcommand } from '@made-simple/discord.js';
import BucketManager from '../../classes/Bucket.js';

export default new Subcommand('remove')
    .setDescription('Removes a user from a bucket')
    .addMentionableOption((option) =>
        option
            .setName('user')
            .setDescription('The user to remove from the bucket')
            .setRequired(true)
    )
    .addNumberOption((option) =>
        option
            .setName('key')
            .setDescription('The key of the bucket to remove the user from')
            .setRequired(true)
            .setMinValue(0)
    )
    .setExecutor(async (_, interaction) => {
        const user = interaction.options.getUser('user', true);
        const key = interaction.options.getNumber('key', true);

        const guild = interaction.guild;
        if (!guild) return;

        const bucket = await BucketManager.getBucket(guild, key);
        if (!bucket) {
            await interaction.reply('that bucket does not exist.');
            return;
        }

        const removed = await BucketManager.removeUser(guild, user.id, key);
        if (!removed) {
            await interaction.reply(
                'could not remove user from bucket. i am sorry. i am bad doggo.'
            );
            return;
        }

        const member = interaction.guild?.members.cache.get(user.id);
        if (!member) {
            await interaction.reply(
                `removed offline ${user.username} from bucket ${key}`
            );
            return;
        }

        const role = await interaction.guild?.roles.fetch(bucket.role);
        if (!role) {
            await interaction.reply(
                'could not find role for bucket. you are bad doggo.'
            );
            return;
        }

        await member.roles.remove(role);
        await interaction.reply(`removed ${user.username} from bucket ${key}`);
    });
