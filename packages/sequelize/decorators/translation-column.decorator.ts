import { TranslationColumnMetadataInterface } from "../interfaces/translation-column-metadata.interface";

export const TRANSLATION_COLUMN_METADATA_KEY = "translation_column_metadata_key";

export const TranslationColumn = (...paths): PropertyDecorator => {
    return (target: any, propertyKey: string | symbol) => {
        const metadata = { paths } as TranslationColumnMetadataInterface;

        Reflect.defineMetadata(TRANSLATION_COLUMN_METADATA_KEY, metadata, target, propertyKey);
    };
}
