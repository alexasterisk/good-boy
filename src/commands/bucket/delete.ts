import { Subcommand } from '@made-simple/discord.js';
import BucketManager from '../../classes/Bucket.js';
import { ChannelType } from 'discord.js';

export default new Subcommand('delete')
    .setDescription('Delete a bucket')
    .addNumberOption((option) =>
        option
            .setName('key')
            .setDescription('The key of the bucket to delete')
            .setRequired(true)
            .setMinValue(0)
    )
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply();

        const key = interaction.options.getNumber('key', true);

        const guild = interaction.guild;
        if (!guild) return;

        const bucket = await BucketManager.getBucket(guild, key);
        if (!bucket) {
            await interaction.editReply(
                'cannot delete something that does not exist. i am not a magician.'
            );
            return;
        }

        const role = interaction.guild?.roles.cache.find(
            (role) => role.name === 'Bucket ' + key
        );

        const category = interaction.guild?.channels.cache.find((channel) => {
            return (
                channel.name === 'Bucket ' + key &&
                channel.type === ChannelType.GuildCategory
            );
        });

        const deleted = await BucketManager.deleteBucket(guild, key);
        if (!deleted) {
            await interaction.editReply(
                'could not delete bucket. i am sorry. i am bad doggo.'
            );
            return;
        }

        if (role) await role.delete();
        if (category) await category.delete();

        await interaction.editReply('bucket deleted. i am best bouncer.');
    });
