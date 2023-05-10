import { config } from 'dotenv';
config();

import { Client, Event } from '@made-simple/discord.js';
import { ChannelType, Snowflake, TextBasedChannel } from 'discord.js';
import { CronJob } from 'cron';

const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'GuildMembers',
        'GuildModeration',
        'DirectMessages',
        'MessageContent'
    ],
    partials: ['Channel', 'GuildMember', 'Message']
});

const buckets: Record<number, Snowflake> = {
    [0]: '1105759308873994271',
    [1]: '1105732454947508224'
};

const userBuckets: Record<Snowflake, (keyof typeof buckets)[]> = {
    // technicolorcatz
    '712414398391648301': [1]
};

const weightedWords: Record<string, number> = {
    bark: 100,
    woof: 100,
    ruff: 100,
    arf: 100,
    'bow wow': 100,
    bork: 50,
    yip: 10,
    yap: 10,
    yelp: 10,
    yowl: 10,
    meow: 1,
    purr: 1,
    hiss: 20
};

const messagesForWipe = [
    'channel has been wiped.',
    'channel clean. doggo good.',
    'got dusty. removed dirt.',
    'fetched broom. swept.',
    'cleaned. doggo happy.',
    'doggo best janitor.',
    'unpaid labor. doggo sad.',
    'sweep sweep. clean.',
    'clean up mess.',
    'ate leftovers. in trouble.'
];

const wipeMessages = async () => {
    const guild = await client.guilds.fetch('1028132582933667903');
    const channels = await guild.channels.fetch();

    for (const channel of channels.values()) {
        if (!channel || !channel.isTextBased()) continue;
        if (channel.id === '1105734585263853590') continue;

        const messages = (await channel.messages.fetch())
            .filter((message) => !message.pinned)
            .filter((message) => {
                const date = new Date();
                date.setDate(date.getDate() - 14);
                return message.createdAt > date;
            });

        if (messages.size === 0) continue;

        for (let i = 0; i < Math.ceil(messages.size / 100); i++) {
            const messageArray = messages
                .map((message) => message)
                .slice(i * 100, (i + 1) * 100);

            for (let j = 0; j < 5; j++) {
                try {
                    await channel.bulkDelete(messageArray);
                    break;
                } catch (err) {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                }
            }
        }

        await channel.send(
            'i am good doggo. ' +
                messagesForWipe[
                    Math.floor(Math.random() * messagesForWipe.length)
                ]
        );
    }
};

new CronJob('0 0 0 * * *', wipeMessages).start();

const makeRandomMessage = () => {
    let message = '';
    const words = Object.keys(weightedWords);
    const weights = Object.values(weightedWords);

    const randomLength = Math.floor(Math.random() * 125) + 75;
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    for (let i = 0; i < randomLength; i++) {
        const randomWeight = Math.floor(Math.random() * totalWeight) + 1;
        let weightSum = 0;

        for (let j = 0; j < words.length; j++) {
            weightSum += weights[j];
            if (randomWeight <= weightSum) {
                message += `${words[j]} `;
                break;
            }
        }
    }

    return message;
};

client.addEvent(
    new Event('messageCreate').setExecutor(async (_, message) => {
        const isDM = message.channel.type === ChannelType.DM;
        const isBot = message.author.bot;

        if (!isDM || isBot) return;

        if (
            message.content.toLowerCase().includes('clean') &&
            message.author.id === '887739292372332584'
        ) {
            await message.channel.send('ok. cleaning.');
            await wipeMessages();
            await message.channel.send('done. food?');
            return;
        }

        const randomMessage = makeRandomMessage();
        await message.channel.send(randomMessage);
    })
);

client.addEvent(
    new Event('guildMemberAdd').setExecutor(async (_, member) => {
        const guild = await member.guild.fetch();
        if (guild.id !== '1028132582933667903') return;

        const roles = userBuckets[member.id];

        const landingChannel = await guild.channels.fetch(
            '1105734585263853590'
        );

        if (roles.length > 1) {
            await member.roles.add(roles.map((role) => buckets[role]));

            await (landingChannel as TextBasedChannel).send(
                `hello <@${
                    member.id
                }> welcome. i am doggo. me bouncer.\nyou are cleared for these buckets:\n**${roles
                    .toString()
                    .replace(',', ', ')}**\ndm me for more info.`
            );
        } else {
            await (landingChannel as TextBasedChannel).send(
                `i dont know you <@${member.id}>. tell me who you are. start with "i am".`
            );

            const filter = (message) => message.author.id === member.id;
            const collector = (
                landingChannel as TextBasedChannel
            ).createMessageCollector({
                filter,
                time: 60000
            });

            collector.once('collect', async (message) => {
                if (message.content.toLowerCase().includes('i am')) {
                    const name = message.content
                        .split('i am')[1]
                        .trim()
                        .split('')
                        .map((char) => {
                            return Math.random() < 0.5
                                ? char.toUpperCase()
                                : char.toLowerCase();
                        })
                        .join('');
                    await member.setNickname(
                        name,
                        'i am doggo bot. i do what i want.'
                    );
                    await (landingChannel as TextBasedChannel).send(
                        `hello ${name}. i am doggo. youre not cleared for any bucket. you are a bucket. bark. dm me for more info.`
                    );
                } else {
                    await (landingChannel as TextBasedChannel).send(
                        'wow. you are bad at listening. i am doggo. you are now a doggo follower.'
                    );

                    await member.setNickname(
                        'doggo follower',
                        'i am doggo bot. i do what i want.'
                    );
                }

                collector.stop();
            });
        }
    })
);

await client.login();
