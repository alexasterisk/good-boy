import Keyv from 'keyv';

export const raw = new Keyv('sqlite://data/keyv.sqlite');
raw.on('error', console.error);

export const keyv = {
    get: async <T>(key: string): Promise<T | undefined> => {
        return await raw.get(key);
    },

    set: async <T>(key: string, value: T): Promise<boolean> => {
        return await raw.set(key, value);
    },

    delete: async (key: string): Promise<boolean> => {
        return await raw.delete(key);
    }
};
