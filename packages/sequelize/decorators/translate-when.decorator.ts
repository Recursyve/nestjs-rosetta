import { TRANSLATION_COLUMN_METADATA_KEY } from "./translation-column.decorator";
import { TranslationColumnMetadataInterface } from "../interfaces/translation-column-metadata.interface";

export const TranslateWhen = (when: (value: any) => boolean): PropertyDecorator => {
    return (target: any, propertyKey: string | symbol) => {
        const metadata: TranslationColumnMetadataInterface = Reflect.getMetadata(TRANSLATION_COLUMN_METADATA_KEY, target, propertyKey);
        if (!metadata) {
            throw new Error("In order to use the TranslateWhen decorator, make sure the TranslationColumn decorator is present on the property. This decorator should be placed before the TranslationColumn decorator.");
        }

        metadata.when = when;
    };
}
