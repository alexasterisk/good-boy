import { Snowflake } from 'discord.js';

export const inviteURL = 'discord.gg/HveUd5z7cJ';
export const creatorId: Snowflake = '887739292372332584';
export const guildId: Snowflake = '1028132582933667903';
export const landingChannel: Snowflake = '1105734585263853590';

export interface Bucket {
    key: number;
    description: string;
    role: Snowflake;
    open?: boolean;
}

export interface UserPlacement {
    userId: Snowflake;
    buckets: number[];
}

export const buckets: Bucket[] = [
    {
        key: 0,
        description: 'good boy testing',
        role: '1105759308873994271'
    },
    {
        key: 1,
        description: 'For testing with StarPop!',
        role: '1105732454947508224',
        open: true
    }
];

export const placements: UserPlacement[] = [
    {
        userId: '712414398391648301', // technicolorcatz
        buckets: [1]
    }
];
