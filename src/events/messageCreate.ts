/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Client, Event } from '@made-simple/discord.js';
import {
    ActionRowBuilder,
    ChannelType,
    Guild,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';

import { makeRandomMessage, keyv } from '../util/index.js';
import BucketManager from '../classes/Bucket.js';

async function buildSelectMenu(guild: Guild) {
    const buckets = await BucketManager.getBuckets(guild);
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

        const msg = message.content.toLowerCase().trim();

        if (isDM) {
            if (await keyv.get('u' + message.author.id)) {
                if (
                    msg.includes('im sorry') ||
                    msg.includes('i am sorry') ||
                    msg.includes("i'm sorry")
                ) {
                    await message.channel.send('ok. i forgive.');
                    await keyv.delete('u' + message.author.id);
                    return;
                } else {
                    await message.channel.send('no. you are bad. go away.');
                }
                return;
            }

            if (msg.includes('feeds') || msg.includes('food')) {
                await message.channel.send('thank. water?');
            } else if (msg.includes('water')) {
                await message.channel.send('thank. treat?');
            } else if (msg.includes('treat')) {
                await message.channel.send('thank. walk?');
            } else if (msg.includes('walk')) {
                await message.channel.send('thank. sleep?');
            } else if (msg.includes('sleep')) {
                await message.channel.send('most thank. i have a secret.');
            } else if (msg.includes('secret') || msg.includes('what is it')) {
                await message.channel.send('i am undercover cat.');
            } else if (msg.includes('cat') || msg.includes('feline')) {
                await message.channel.send('grr. go away.');
            } else if (msg.includes('undercover')) {
                await message.channel.send('never. i am good doggo. believe.');
            } else if (msg.includes('shh')) {
                await message.channel.send('no tell what do. i tell what do.');
            } else if (
                msg.includes('bark') ||
                msg.includes('woof') ||
                msg.includes('bork')
            ) {
                await message.channel.send('bark bark bark bark bark bark.');
            } else if (
                msg.includes('grr') ||
                msg.includes('growl') ||
                msg.includes('hiss')
            ) {
                await message.channel.send('GRRRRRRRRRRR!!!!');
            } else if (
                msg.includes('fight') ||
                msg.includes('attack') ||
                msg.includes('bite')
            ) {
                await message.channel.send('GRRRRRRRRRRR!!!!');
            } else if (msg.includes('pat') || msg.includes('pet')) {
                await message.channel.send('thank. i like pat.');
            } else if (msg.includes('loser') || msg.includes('bad')) {
                await message.channel.send(
                    'describe self. i am good doggo. real doggo.'
                );
            } else if (msg.includes('lizard')) {
                await message.channel.send(
                    'lizard doggo is cool. i like lizard doggo. what do you know about lizard doggo?'
                );
            } else if (msg.includes('satisfactory')) {
                await message.channel.send(
                    'satisfactory is good game. are you stalker. i am good doggo. you are stalker.'
                );
            } else if (msg.includes('not') && msg.includes('stalker')) {
                await message.channel.send(
                    'can not confirm. you are stalker. go away.'
                );
            } else if (
                msg.includes('i wont') ||
                msg.includes('i will not') ||
                msg.includes("i won't")
            ) {
                await message.channel.send(
                    'you will. i am just doggo. dont lie.'
                );
            } else if (
                msg.includes('mean') ||
                msg.includes('rude') ||
                msg.includes('suck')
            ) {
                await message.channel.send(
                    'coming from you. i have no words. i am good doggo. you are bad human.'
                );
            } else if (
                msg.includes('good') ||
                msg.includes('great') ||
                msg.includes('awesome')
            ) {
                await message.channel.send(
                    'thank. i am good doggo. you are good human.'
                );
            } else if (
                msg.includes('good boy') ||
                msg.includes('good dog') ||
                msg.includes('good doggo')
            ) {
                await message.channel.send('that is me. i am good doggo.');
            } else if (
                msg.includes('fuck you') ||
                msg.includes('bitch') ||
                msg.includes('asshole') ||
                msg.includes('whore')
            ) {
                await message.channel.send(
                    'you are a terrible person. you would say that to a doggo. me. a good doggo. had to hear you say that.'
                );
                await message.channel.send(
                    'do you think that is ok. i am good doggo. you are bad human.'
                );
                await message.channel.send(
                    'dont understand how that affect me. (good doggo).'
                );
                await message.channel.send(
                    'are you okay with what you do. hurting cute doggos.'
                );
                await message.channel.send('dont respond. i am sad doggo.');
                await keyv.set('u' + message.author.id, true);
            } else {
                const randomMessage = makeRandomMessage();
                await message.channel.send(randomMessage);
            }
        } else {
            const mentions = message.mentions.users;
            if (mentions.has(client.user!.id)) {
                const selectMenu = await buildSelectMenu(
                    message.guild as Guild
                );
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

                    const bucket = await BucketManager.getBucket(
                        message.guild as Guild,
                        parseInt(collector.values[0])
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
