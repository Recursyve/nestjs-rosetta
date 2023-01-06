import { TranslationObject, TranslationObjectOptions } from "@recursyve/nestjs-rosetta-core";
import { Model, Schema } from "mongoose";
import { TranslationFieldMetadataInterface } from "../interfaces/translation-field-metadata.interface";

export function rosettaPlugin(schema: Schema) {
    schema.post(["find", "findOne", "findOneAndDelete", "findOneAndRemove", "findOneAndReplace", "findOneAndUpdate"], (doc: Model<any>, next) => {
        transformModel(doc, schema);
        next();
    });
}

function transformModel(docs: Model<any> | Model<any>[], schema: Schema) {
    if (!schema) {
        return;
    }

    if (!(docs instanceof Array)) {
        docs = [docs];
    }

    for (const doc of docs) {
        if (doc === null || doc === undefined) {
            continue;
        }

        for (const key in schema.obj) {
            const obj = schema.obj[key];
            if (!obj["rosetta"]) {
                if (Array.isArray(doc[key]) || typeof doc[key] === "object") {
                    transformModel(doc[key], schema.paths[key].schema);
                }
                continue;
            }

            const config = obj["rosetta"] as TranslationFieldMetadataInterface;
            const { paths, ...options } = config;
            doc[key] = createTranslationObject(doc[key], paths, options);
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
