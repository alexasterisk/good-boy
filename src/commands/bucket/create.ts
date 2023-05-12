import { Subcommand } from '@made-simple/discord.js';
import BucketManager from '../../classes/Bucket.js';
import { ChannelType } from 'discord.js';

export default new Subcommand('create')
    .setDescription('Create a bucket')
    .addStringOption((option) =>
        option
            .setName('description')
            .setDescription('Description of the bucket')
            .setRequired(true)
    )
    .addBooleanOption((option) =>
        option
            .setName('open')
            .setDescription('Whether or not anyone can join the bucket')
            .setRequired(false)
    )
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply();

        const description = interaction.options.getString('description', true);
        const open = interaction.options.getBoolean('open') ?? false;

        const guild = interaction.guild;
        if (!guild) return;

        const buckets = await BucketManager.getBuckets(guild);
        const key = buckets.length;

        const role = await interaction.guild?.roles.create({
            name: `Bucket ${key}`,
            color: 'Random',
            hoist: true,
            permissions: []
        });

        if (!role) {
            await interaction.editReply(
                'could not create role for bucket. i am sorry. i am bad doggo.'
            );
            return;
        }

        const category = await interaction.guild?.channels.create({
            name: `Bucket ${key}`,
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
                {
                    id: interaction.guild?.roles.everyone.id,
                    deny: 'ViewChannel'
                },
                {
                    id: role?.id,
                    allow: 'ViewChannel'
                }
            ]
        });

        if (!category) {
            await interaction.editReply(
                'could not create category for bucket. i am sorry. i am bad doggo.'
            );
            return;
        }

        const created = await BucketManager.createBucket(guild, {
            key,
            description,
            role: role?.id ?? '',
            category: category?.id ?? '',
            open
        });

        if (!created) {
            await interaction.editReply(
                'could not create bucket data. i am sorry. i will clean up.'
            );
            await role.delete();
            await category.delete();
            return;
        }

        await interaction.editReply(
            `created bucket ${key}. i am best bouncer.`
        );
    });
