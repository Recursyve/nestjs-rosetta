import { Model } from "sequelize-typescript";
import { TranslationObject, TranslationObjectOptions } from "@recursyve/nestjs-rosetta-core";
import { TRANSLATION_COLUMN_METADATA_KEY } from "../decorators/translation-column.decorator";
import { TranslationColumnMetadataInterface } from "../interfaces/translation-column-metadata.interface";

export function NestjsRosettaSequelizeAfterFind(instanceOrInstances: Model | Model[]) {
    if (!(instanceOrInstances instanceof Array)) {
        instanceOrInstances = [instanceOrInstances];
    }

    for (const instance of instanceOrInstances) {
        if (!instance?.["dataValues"]) continue;

        for (const key of Object.keys(instance["dataValues"])) {
            const translationColumnMetadata = Reflect.getMetadata(
                TRANSLATION_COLUMN_METADATA_KEY,
                Object.getPrototypeOf(instance),
                key
            ) as TranslationColumnMetadataInterface;

            if (!translationColumnMetadata) {
                if (Array.isArray(instance["dataValues"][key]) || typeof instance["dataValues"][key] === "object") {
                    // Run the hook on nested models
                    NestjsRosettaSequelizeAfterFind(instance["dataValues"][key]);
                }

                continue;
            }

            const { when, paths, ...options } = translationColumnMetadata;
            if (when && !when(instance)) continue;

            instance["dataValues"][key] = createTranslationObject(instance["dataValues"][key], paths, options);
        }
    }
}

function createTranslationObject(value: any, paths: string[], options?: TranslationObjectOptions): any {
    if (value === null || value === undefined || value instanceof Date) return value;

    if (value instanceof Array) {
        return value.map(v => createTranslationObject(v, paths, options));
    }

    if (!paths.length || paths.every(path => !path)) {
        return new TranslationObject(value, options);
    }

    const combinedPaths = combinePathsByHead(paths);
    for (const [head, tails] of Object.entries(combinedPaths)) {
        if (typeof value === "object") {
            value[head] = createTranslationObject(value[head], [...tails], options);
        }
    }

    return value;
}


type CombinedPaths = Record<string, Set<string>>;

// Combines paths for a single depth
function combinePathsByHead(paths: string[]): CombinedPaths {
    const combinedPaths: CombinedPaths = {};

    for (const path of paths) {
        const separatorIndex = path.indexOf(".");

        let head: string;
        let tail: string;

        if (separatorIndex === -1) {
            head = path;
            tail = "";
        } else {
            head = path.slice(0, separatorIndex);
            tail = path.slice(separatorIndex + 1);
        }

        (combinedPaths[head] ??= new Set<string>()).add(tail);
    }

    return combinedPaths;
}
