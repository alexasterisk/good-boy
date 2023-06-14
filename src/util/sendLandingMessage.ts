import BucketManager, { Bucket } from '../classes/Bucket.js';
import { TextChannel } from 'discord.js';
import { keyv } from '../util/index.js';

function makeBucketDescription(bucket: Bucket) {
    const statusCircle = bucket.open ? '🟢' : '🔴';
    const statusMessage = bucket.open ? 'OPEN' : 'CLOSED';
    return `> **Bucket ${bucket.key}** \`${statusCircle} ${statusMessage} \`\n> ${bucket.description}`;
}

async function deleteOldMessage(channel: TextChannel) {
    const landingMessage = await keyv.get('landingMessage');
    if (!landingMessage) return;

    const message = await channel.messages.fetch(landingMessage);
    if (!message) throw null;

    await message.delete();
}

export async function sendLandingMessage(
    channel: TextChannel
): Promise<boolean> {
    const guild = channel.guild;
    if (!guild) throw 'Channel is not in a guild';

    const invite = await guild.invites.create(channel, {
        maxAge: 0,
        maxUses: 0
    });

    const hiddenInvite =
        '||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _' +
        invite.url;
    const goodBoyPing = `*join any open bucket by pinging* <@${channel.client.user.id}>`;

    const bucketDescriptions = (await BucketManager.getBuckets(guild))
        .map(makeBucketDescription)
        .join('\n\n');

    deleteOldMessage(channel).finally(async () => {
        const message = await channel.send(
            `${bucketDescriptions}\n\n${goodBoyPing}\n${hiddenInvite}`
        );

        await message.pin();
        await keyv.set('landingMessage', message.id);
    });

    return true;
}
