export const SEQUELIZE_TRANSLATION_OBJECT_METADATA_KEY = "sequelize_translation_object_metadata_key";

export const SequelizeTranslationObjectDecorator = (): PropertyDecorator => {
    return (target: any, propertyKey: string | symbol) => {
        Reflect.defineMetadata(SEQUELIZE_TRANSLATION_OBJECT_METADATA_KEY, true, target, propertyKey);
    };
}
