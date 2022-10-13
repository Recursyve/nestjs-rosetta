import { TranslationFieldMetadataInterface } from "../interfaces/translation-field-metadata.interface";

export const TRANSLATION_FIELDS_METADATA_KEY = "rosetta_mongo_translation_field_metadata_key";

export const TranslationFields = (translationPaths: string[]): PropertyDecorator & ClassDecorator => {
    return (target: any, propertyKey?: string | symbol) => {
        const metadata = { translationPaths: [] } as TranslationFieldMetadataInterface;
        if (propertyKey) {
            for (const translationPath of translationPaths) {
                metadata.translationPaths.push(`${String(propertyKey)}.${translationPath}`);
            }
        } else {
            metadata.translationPaths.push(...translationPaths);
        }

        const oldMetadata = Reflect.getMetadata(TRANSLATION_FIELDS_METADATA_KEY, target) as TranslationFieldMetadataInterface | null;
        if (oldMetadata?.translationPaths?.length) {
            metadata.translationPaths.push(...oldMetadata.translationPaths);
        }

        Reflect.defineMetadata(TRANSLATION_FIELDS_METADATA_KEY, metadata, target);
    };
};

/*
    execAndTranslate<Model>(): Promise<ResultType> {
      const result = await exec();
      MongooseUtils.transformResults(typeof Model, result);
      return result;
    }

    test(target, results): void {
      const metadata: { paths: string[] } = Reflect.getMetadata("key", target);

    }
 */
