import { Event } from '@made-simple/discord.js';
import { Snowflake } from 'discord.js';
import BucketManager from '../classes/Bucket.js';
import PlacementManager from '../classes/Placement.js';
import { keyv } from '../util/index.js';

export default new Event('guildMemberAdd').setExecutor(async (_, member) => {
    const guild = await member.guild.fetch();

    const landingId: Snowflake | null = await keyv.get(
        `landingChannel-${guild.id}`
    );
    if (!landingId) return;

    const landing = await guild.channels.fetch(landingId);
    if (!landing || !landing.isTextBased()) return;

    PlacementManager.getPlacement(guild, member.id)
        .then(async (placement) => {
            const roles: Snowflake[] = [];
            for (const key of placement.buckets) {
                const bucket = await BucketManager.getBucket(guild, key);
                if (!bucket) continue;

                roles.push(bucket.role);
            }

            await member.roles.add(roles, 'user placement');

            await landing.send(
                `hello <@${
                    member.id
                }> welcome. i am doggo. me bouncer.\nyou are cleared for these buckets:\n**${roles
                    .toString()
                    .replace(',', ', ')}**\ndm me for more info.`
            );
        })
        .catch(async () => {
            await landing.send(
                `i dont know you <@${member.id}>. tell me who you are. start with "i am".`
            );

            const filter = (message) => message.author.id === member.id;
            const collector = landing.createMessageCollector({
                filter,
                time: 60000
            });

            collector.once('collect', async (message) => {
                const content = message.content
                    .replace(/\s+/g, ' ')
                    .replace(/[^a-zA-Z ]/g, '')
                    .replace(/\d+/g, '')
                    .trim()
                    .toLowerCase();

                if (message.content.toLowerCase().includes('i am')) {
                    const name = content
                        .split('i am')[1]
                        .split('')
                        .map((char) => {
                            return Math.random() < 0.5
                                ? char.toUpperCase()
                                : char.toLowerCase();
                        })
                        .join('');

                    if (name.length === 0 || name.length > 32) {
                        await landing.send(
                            'what a terrible name. doggo is cooler. you are now doggo follower.'
                        );
                        await member.setNickname(
                            'doggo follower',
                            'because doggo follower.'
                        );
                    } else {
                        await landing.send(
                            `hello ${name}. i am doggo. youre not cleared for any bucket. you are a bucket. bark. dm me for more info.`
                        );
                        await member.setNickname(
                            name,
                            'i am doggo bot. i do what i want.'
                        );
                    }
                } else {
                    await landing.send(
                        'wow. you are bad at listening. i am doggo. you are now doggo follower.'
                    );
                    await member.setNickname(
                        'doggo follower',
                        'because doggo follower.'
                    );
                }

                collector.stop();
            });
        });
});
