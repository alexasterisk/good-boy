import { Guild } from 'discord.js';
import { keyv } from '../util/index.js';

export interface UserPlacement {
    userId: string;
    buckets: number[];
}

export default class PlacementManager {
    static async getPlacements(guild: Guild): Promise<UserPlacement[]> {
        return (await keyv.get(`placements-${guild.id}`)) ?? [];
    }

    static async getPlacement(
        guild: Guild,
        userId: string
    ): Promise<UserPlacement> {
        const placements = await this.getPlacements(guild);
        const placement = placements.find(
            (placement) => placement.userId === userId
        );

        if (!placement)
            throw new Error(`Placement for user ${userId} not found`);
        return placement;
    }

    static async createPlacement(
        guild: Guild,
        userId: string
    ): Promise<boolean> {
        const placements = await this.getPlacements(guild);

        const placement = await this.getPlacement(guild, userId);
        if (placement)
            throw new Error(`Placement for user ${userId} already exists`);

        placements.push({
            userId,
            buckets: []
        });

        await keyv.set(`placements-${guild.id}`, placements);
        return true;
    }

    static async deletePlacement(
        guild: Guild,
        userId: string
    ): Promise<boolean> {
        const placement = await this.getPlacement(guild, userId);
        if (!placement)
            throw new Error(`Placement for user ${userId} not found`);

        const newPlacements = (await this.getPlacements(guild)).filter(
            (placemnt) => placemnt.userId !== userId
        );

        await keyv.set(`placements-${guild.id}`, newPlacements);
        return true;
    }

    static async addBucket(
        guild: Guild,
        userId: string,
        key: number
    ): Promise<boolean> {
        const placements = await this.getPlacements(guild);
        const placement = await this.getPlacement(guild, userId);

        if (!placement)
            throw new Error(`Placement for user ${userId} not found`);

        if (placement.buckets.includes(key))
            throw new Error(`User ${userId} already has bucket ${key}`);

        const newPlacements = placements.map((placement) => {
            if (placement.userId === userId) {
                placement.buckets.push(key);
                return placement;
            } else {
                return placement;
            }
        });

        await keyv.set(`placements-${guild.id}`, newPlacements);
        return true;
    }

    static async removeBucket(
        guild: Guild,
        userId: string,
        key: number
    ): Promise<boolean> {
        const placements = await this.getPlacements(guild);
        const placement = await this.getPlacement(guild, userId);

        if (!placement)
            throw new Error(`Placement for user ${userId} not found`);

        if (!placement.buckets.includes(key))
            throw new Error(`User ${userId} does not have bucket ${key}`);

        const newBuckets = placement.buckets.filter((bucket) => bucket !== key);
        placement.buckets = newBuckets;

        await keyv.set(`placements-${guild.id}`, placements);
        return true;
    }
}
