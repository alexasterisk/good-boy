import { Subcommand } from '@made-simple/discord.js';
import BucketManager from '../../classes/Bucket.js';

export default new Subcommand('add')
    .setDescription('Adds a user to a bucket')
    .addMentionableOption((option) =>
        option
            .setName('user')
            .setDescription('The user to add to the bucket')
            .setRequired(true)
    )
    .addNumberOption((option) =>
        option
            .setName('key')
            .setDescription('The key of the bucket to add the user to')
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

        const added = await BucketManager.addUser(guild, user.id, key);
        if (!added) {
            await interaction.reply(
                'could not add user to bucket. i am sorry. i am bad doggo.'
            );
            return;
        }

        const member = interaction.guild?.members.cache.get(user.id);
        if (!member) {
            await interaction.reply(
                `added offline ${user.username} to bucket ${key}`
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

        await member.roles.add(role);
        await interaction.reply(`added ${user.username} to bucket ${key}`);
        await user.send(`you have been added to bucket ${key}`);
    });
