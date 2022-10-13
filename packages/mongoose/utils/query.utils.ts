import { Query } from "mongoose";
import { TRANSLATION_FIELDS_METADATA_KEY } from "../decorators/translation-field.decorator";
import { TranslationFieldMetadataInterface } from "../interfaces/translation-field-metadata.interface";
import { Logger, Type } from "@nestjs/common";
import { TranslationObject } from "@recursyve/nestjs-rosetta-core";

export class NestjsRosettaMongooseQueryUtils {
    private static logger = new Logger("NestjsRosettaMongoose");

    public static hydrateTranslationObjects(docType: Type, value: any | any[]): void {
        const metadata = Reflect.getMetadata(TRANSLATION_FIELDS_METADATA_KEY, docType) as TranslationFieldMetadataInterface | null;
        if (!metadata?.translationPaths?.length) return;

        if (Array.isArray(value)) {
            for (const r of value) {
                this.hydrateTranslationObjects(docType, r);
            }

            return;
        }

        for (const translationPath of metadata.translationPaths) {
            this.hydrateTranslationObjectsInner(docType, value, translationPath.split("."), translationPath);
        }
    }

    private static hydrateTranslationObjectsInner(docType: Type, value: any, pathParts: string[], fullPath: string): void {
        if (!pathParts.length) return;

        if (typeof value !== "object") {
            this.logger.error(`Error while traversing '${docType.name}': encountered non-object value '${value}' for path '${fullPath}'`)
            return;
        }

        const propertyKey = pathParts[0];
        if (!value[propertyKey]) {
            this.logger.error(`Error while traversing '${docType.name}': property '${propertyKey}' not found in value '${value}' for path '${fullPath}'`)
            return;
        }

        if (pathParts.length === 1) {
            if (typeof value[propertyKey] !== "object") {
                this.logger.error(`Error while traversing '${docType.name}': value '${value[propertyKey]}' at path '${fullPath}' must be an object in order to be hydrated to a TranslationObject`)
                return;
            }

            value[propertyKey] = new TranslationObject(value[propertyKey]);
            return;
        }

        this.hydrateTranslationObjectsInner(docType, value[propertyKey], pathParts.slice(1), fullPath);
    }
}

declare module "mongoose" {
    // Executes the query and hydrates TranslationObjects
    interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
        execAndTranslate<ResultType>(docType: Type): Promise<ResultType>;
    }
}

Query.prototype.execAndTranslate = async function<ResultType>(docType: Type): Promise<ResultType> {
    const result = await (this as Query<any, any>).exec();
    NestjsRosettaMongooseQueryUtils.hydrateTranslationObjects(docType, result);
    return result;
};
