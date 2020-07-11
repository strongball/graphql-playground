import { createParamDecorator } from "type-graphql";
import { Context } from "koa";
import DataLoader = require("dataloader");
const DATALOADER_KEY = "dataloaders";

export function Loaders<K, V>(key: string, options?: DataLoader.Options<K, V>) {
    return createParamDecorator<Context>(({ context }) => {
        return (fn: (ids: readonly K[]) => Promise<V[]>) => {
            if (!context[DATALOADER_KEY]) {
                context[DATALOADER_KEY] = {};
            }
            if (!context[DATALOADER_KEY][key]) {
                context[DATALOADER_KEY][key] = new DataLoader<K, V>(fn, options);
            }
            return context[DATALOADER_KEY][key];
        };
    });
}
export type Loader<K, V> = (fn: (ids: K[]) => Promise<V[]>) => DataLoader<K, V>;
