import BucketManager, { Bucket } from '../classes/Bucket.js';
import { Guild, TextChannel } from 'discord.js';
import { keyv } from '../util/index.js';
import { LandingData } from '../commands/landing/index.js';
import { deleteLandingMessage } from '../commands/landing/delete.js';

function makeBucketDescription(bucket: Bucket) {
    const statusCircle = bucket.open ? '🟢' : '🔴';
    const statusMessage = bucket.open ? 'OPEN' : 'CLOSED';
    return `> **Bucket ${bucket.key}** \`${statusCircle} ${statusMessage} \`\n> ${bucket.description}`;
}

export async function sendLandingMessage(
    guild: Guild,
    channel: TextChannel
): Promise<void> {
    await deleteLandingMessage(guild);

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

    const message = await channel.send({
        content: `${bucketDescriptions}\n\n${goodBoyPing}\n${hiddenInvite}}`
    });

    await message.pin();
    await keyv.set<LandingData>(`landing-${guild.id}`, {
        message: message.id,
        channel: channel.id
    });
}
