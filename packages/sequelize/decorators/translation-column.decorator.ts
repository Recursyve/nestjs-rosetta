import * as path from "path";
import { TranslationColumnMetadataInterface } from "../interfaces/translation-column-metadata.interface";

export const TRANSLATION_COLUMN_METADATA_KEY = "translation_column_metadata_key";

export function TranslationColumn(options: { paths?: string[], disableFallback?: boolean }): PropertyDecorator;
export function TranslationColumn(...paths: string[]): PropertyDecorator;
export function TranslationColumn(...args: any[]): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const transformArgs = (args: any[]): TranslationColumnMetadataInterface => {
            if (typeof args[0] === "object") {
                return {
                    paths: [],
                    ...args[0]
                };
            }

            return { paths: args };
        };

        const metadata = transformArgs(args);

        Reflect.defineMetadata(TRANSLATION_COLUMN_METADATA_KEY, metadata, target, propertyKey);
    };
}
