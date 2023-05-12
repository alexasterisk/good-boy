import { Subcommand } from '@made-simple/discord.js';
import BucketManager from '../../classes/Bucket.js';

export default new Subcommand('edit')
    .setDescription('Edit a bucket')
    .addNumberOption((option) =>
        option
            .setName('key')
            .setDescription('The key of the bucket to edit')
            .setRequired(true)
            .setMinValue(0)
    )
    .addStringOption((option) =>
        option
            .setName('optionname')
            .setDescription('The name of the option to edit')
            .setRequired(true)
            .addChoices(
                {
                    name: 'Description',
                    value: 'description'
                },
                {
                    name: 'Open',
                    value: 'open'
                }
            )
    )
    .addStringOption((option) =>
        option
            .setName('value')
            .setDescription('The value to set the option to')
            .setRequired(true)
    )
    .setExecutor(async (_, interaction) => {
        const key = interaction.options.getNumber('key', true);

        const guild = interaction.guild;
        if (!guild) return;

        const bucket = await BucketManager.getBucket(guild, key);
        if (!bucket) {
            await interaction.reply(
                'cannot edit something that does not exist. i am not a magician.'
            );
            return;
        }

        const option = interaction.options.getString('optionname', true);
        const value = interaction.options.getString('value', true);

        switch (option) {
            case 'description': {
                const edited = await BucketManager.editBucket(guild, key, {
                    description: value
                });

                if (!edited) {
                    await interaction.reply(
                        'could not edit bucket. i am sorry. i am bad doggo.'
                    );
                    return;
                }

                break;
            }

            case 'open': {
                const edited = await BucketManager.editBucket(guild, key, {
                    open: value === 'true'
                });

                if (!edited) {
                    await interaction.reply(
                        'could not edit bucket. i am sorry. i am bad doggo.'
                    );
                    return;
                }

                break;
            }
        }

        await interaction.reply('bucket edited. i am best bouncer.');
    });
