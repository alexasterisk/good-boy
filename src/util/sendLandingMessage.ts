import { Client } from '@made-simple/discord.js';
import { Bucket, buckets, inviteURL, landingChannel } from '../config.js';

function makeBucketDescription(bucket: Bucket) {
    const statusCircle = bucket.open ? '🟢' : '🔴';
    const statusMessage = bucket.open ? 'OPEN' : 'CLOSED';
    return `> **Bucket ${bucket.key}** \`${statusCircle} ${statusMessage} \`\n> ${bucket.description}`;
}

export async function sendLandingMessage(client: Client<object>) {
    const hiddenInvite =
        '||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _' +
        inviteURL;
    const goodBoyPing = `*join any open bucket by pinging* <@${client.user?.id}>`;

    const bucketDescriptions = buckets.map(makeBucketDescription).join('\n\n');

    const landing = await client.channels.fetch(landingChannel);
    if (!landing || !landing.isTextBased()) return;

    const message = await landing.send(
        `${bucketDescriptions}\n\n${goodBoyPing}\n${hiddenInvite}`
    );

    await message.pin();
}
