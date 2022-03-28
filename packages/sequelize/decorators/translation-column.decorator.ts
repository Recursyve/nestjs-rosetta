export const TRANSLATION_COLUMN_METADATA_KEY = "translation_column_metadata_key";

export const TranslationColumn = (): PropertyDecorator => {
    return (target: any, propertyKey: string | symbol) => {
        Reflect.defineMetadata(TRANSLATION_COLUMN_METADATA_KEY, true, target, propertyKey);
    };
}
