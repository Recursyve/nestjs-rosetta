import { PropertyMetadata } from "@nestjs/mongoose/dist/metadata/property-metadata.interface";
import { TypeMetadataStorage } from "@nestjs/mongoose/dist/storages/type-metadata.storage";
import { TranslationFieldMetadataInterface } from "../interfaces/translation-field-metadata.interface";

export function TranslationFields(options: { paths?: string[], disableFallback?: boolean }): PropertyDecorator;
export function TranslationFields(...paths: string[]): PropertyDecorator;
export function TranslationFields(...args: any[]): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const transformArgs = (args: any[]): TranslationFieldMetadataInterface => {
            if (typeof args[0] === "object") {
                return {
                    paths: [],
                    ...args[0]
                };
            }

            return { paths: args };
        };

        const property = ((TypeMetadataStorage as any).properties as PropertyMetadata[]).find(x => x.propertyKey === propertyKey && x.target === target.constructor);
        if (!property) {
            return
        }

        property.options["rosetta"] = transformArgs(args);
    };
}
