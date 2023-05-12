import PlacementManager from './Placement.js';
import { keyv } from '../util/index.js';
import { Guild } from 'discord.js';

export interface Bucket {
    key: number;
    description: string;
    role: string;
    category: string;
    open?: boolean;
}

export interface UserPlacement {
    userId: string;
    buckets: number[];
}

export default class BucketManager {
    static async getBuckets(guild: Guild): Promise<Bucket[]> {
        return (await keyv.get(`buckets-${guild.id}`)) ?? [];
    }

    static async getBucket(guild: Guild, key: number): Promise<Bucket> {
        const buckets = await this.getBuckets(guild);
        const bucket = buckets.find((bucket) => bucket.key === key);

        if (!bucket) throw new Error(`Bucket ${key} not found`);
        return bucket;
    }

    static async createBucket(guild: Guild, options: Bucket): Promise<boolean> {
        const buckets = await this.getBuckets(guild);
        const key = buckets.length;

        buckets.push({
            key,
            description: options.description,
            role: options.role,
            category: options.category,
            open: options.open
        });

        await keyv.set(`buckets-${guild.id}`, buckets);
        return true;
    }

    static async deleteBucket(guild: Guild, key: number): Promise<boolean> {
        const bucket = await this.getBucket(guild, key);
        if (!bucket) throw new Error(`Bucket ${key} not found`);

        const buckets = await this.getBuckets(guild);
        const newBuckets = buckets.filter((bucket) => bucket.key !== key);

        await keyv.set(`buckets-${guild.id}`, newBuckets);

        const placements = await PlacementManager.getPlacements(guild);
        placements.forEach((placement) => {
            const newPlacements = placement.buckets.filter(
                (bucket) => bucket !== key
            );

            placement.buckets = newPlacements;
        });

        await keyv.set(`buckets-${guild.id}`, placements);
        return true;
    }

    static async editBucket(
        guild: Guild,
        key: number,
        options: Partial<Omit<Bucket, 'key' | 'role' | 'category'>>
    ): Promise<boolean> {
        const bucket = await this.getBucket(guild, key);
        if (!bucket) throw new Error(`Bucket ${key} not found`);

        const buckets = await this.getBuckets(guild);
        const newBuckets = buckets.map((bucket) => {
            if (bucket.key === key) {
                return {
                    key,
                    description: options.description ?? bucket.description,
                    role: bucket.role,
                    category: bucket.category,
                    open: options.open ?? bucket.open
                };
            } else {
                return bucket;
            }
        });

        await keyv.set(`buckets-${guild.id}`, newBuckets);
        return true;
    }

    static async addUser(
        guild: Guild,
        userId: string,
        key: number
    ): Promise<boolean> {
        const bucket = await this.getBucket(guild, key);
        if (!bucket) throw new Error(`Bucket ${key} not found`);

        const placements = await PlacementManager.getPlacements(guild);
        const placement = placements.find(
            (placement) => placement.userId === userId
        );

        if (!placement) {
            placements.push({
                userId,
                buckets: [key]
            });
        }

        if (placement) {
            placement.buckets.push(key);
        }

        await keyv.set(`placements-${guild.id}`, placements);
        return true;
    }

    static async removeUser(
        guild: Guild,
        userId: string,
        key: number
    ): Promise<boolean> {
        const bucket = await this.getBucket(guild, key);
        if (!bucket) throw new Error(`Bucket ${key} not found`);

        const placements = await PlacementManager.getPlacements(guild);
        const placement = placements.find(
            (placement) => placement.userId === userId
        );

        if (!placement) throw new Error(`User ${userId} not found`);

        const newBuckets = placement.buckets.filter((bucket) => bucket !== key);
        placement.buckets = newBuckets;

        await keyv.set(`placements-${guild.id}`, newBuckets);
        return true;
    }
}
