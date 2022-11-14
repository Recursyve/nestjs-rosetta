import { PropertyMetadata } from "@nestjs/mongoose/dist/metadata/property-metadata.interface";
import { TypeMetadataStorage } from "@nestjs/mongoose/dist/storages/type-metadata.storage";
import { TranslationFieldMetadataInterface } from "../interfaces/translation-field-metadata.interface";

export const TranslationFields = (...paths: string[]): PropertyDecorator => {
    return (target: any, propertyKey: string | symbol) => {
        const property = ((TypeMetadataStorage as any).properties as PropertyMetadata[]).find(x => x.propertyKey === propertyKey && x.target === target.constructor);
        if (!property) {
            console.log("R: No property found");
            return
        }

        property.options["rosetta"] = { paths } as TranslationFieldMetadataInterface;
    };
};
