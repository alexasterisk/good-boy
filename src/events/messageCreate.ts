/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Client, Event } from '@made-simple/discord.js';
import {
    ActionRowBuilder,
    ChannelType,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';

import {
    makeRandomMessage,
    sendLandingMessage,
    wipeMessages
} from '../util/index.js';
import { buckets, creatorId, guildId } from '../config.js';

async function buildSelectMenu(client: Client<object>) {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) return;

    const options: StringSelectMenuOptionBuilder[] = [];

    for (const bucket of buckets) {
        if (!bucket.open) continue;

        const role = await guild.roles.fetch(bucket.role);
        if (!role) continue;

        options.push(
            new StringSelectMenuOptionBuilder()
                .setLabel(role.name)
                .setValue(bucket.key.toString())
                .setDescription(`Join ${role.name}.`)
        );
    }

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select-bucket')
        .setPlaceholder('Select a bucket');

    selectMenu.addOptions(options);

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectMenu
    );
}

export default new Event('messageCreate').setExecutor(
    async (client: Client<object>, message) => {
        const isDM = message.channel.type === ChannelType.DM;
        const isBot = message.author.bot;

        if (isBot) return;

        const msg = message.content.toLowerCase();

        if (isDM) {
            if (message.author.id === creatorId) {
                if (msg.includes('clean')) {
                    await message.channel.send('ok. cleaning.');
                    await wipeMessages(client);
                    await message.channel.send('done. food?');
                    return;
                } else if (msg.includes('landing')) {
                    await message.channel.send('ok. landing.');
                    await sendLandingMessage(client);
                    await message.channel.send('done. food?');
                    return;
                }
            }

            if (msg.includes('feeds') || msg.includes('food')) {
                await message.channel.send('thank. water?');
                return;
            } else if (msg.includes('water')) {
                await message.channel.send('thank. treat?');
                return;
            } else if (msg.includes('treat')) {
                await message.channel.send('thank. walk?');
                return;
            } else if (msg.includes('walk')) {
                await message.channel.send('thank. sleep?');
                return;
            } else if (msg.includes('sleep')) {
                await message.channel.send('most thank. i have a secret.');
                return;
            } else if (msg.includes('secret') || msg.includes('what is it')) {
                await message.channel.send('i am undercover cat.');
                return;
            } else if (msg.includes('cat') || msg.includes('feline')) {
                await message.channel.send('grr. go away.');
                return;
            } else if (msg.includes('undercover')) {
                await message.channel.send('never. i am good doggo. believe.');
                return;
            } else if (msg.includes('shh')) {
                await message.channel.send('no tell what do. i tell what do.');
                return;
            } else if (
                msg.includes('bark') ||
                msg.includes('woof') ||
                msg.includes('bork')
            ) {
                await message.channel.send('bark bark bark bark bark bark.');
                return;
            } else if (
                msg.includes('grr') ||
                msg.includes('growl') ||
                msg.includes('hiss')
            ) {
                await message.channel.send('GRRRRRRRRRRR!!!!');
                return;
            }

            const randomMessage = makeRandomMessage();
            await message.channel.send(randomMessage);
        } else {
            const mentions = message.mentions.users;
            if (mentions.has(client.user!.id)) {
                const selectMenu = await buildSelectMenu(client);
                if (!selectMenu) return;

                const response = await message.channel.send({
                    content: 'doggo worker. what bucket?',
                    components: [selectMenu]
                });

                const filter = (interaction) =>
                    interaction.user.id === message.author.id;

                try {
                    const collector = await response.awaitMessageComponent({
                        filter,
                        time: 60000
                    });

                    if (!collector.isStringSelectMenu()) return;

                    const bucket = buckets.find(
                        (b) => b.key === parseInt(collector.values[0])
                    );
                    if (!bucket) return;

                    const role = await message.guild?.roles.fetch(bucket.role);
                    if (!role) return;

                    if (message.member?.roles.cache.has(role.id)) {
                        await message.member?.roles.remove(
                            role,
                            'removed bucket'
                        );
                        await response.edit({
                            content: `you are no longer in ${role.name}. bark.`,
                            components: []
                        });
                        return;
                    }

                    await message.member?.roles.add(role, 'selected bucket');
                    await response.edit({
                        content: `welcome to ${role.name}. bark.`,
                        components: []
                    });
                } catch (e) {
                    await response.edit({
                        content: 'you took too long. i look at bird now.',
                        components: []
                    });
                }
            }
        }
    }
);
