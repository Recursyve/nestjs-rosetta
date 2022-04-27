import { Model } from "sequelize-typescript";
import { TranslationObject } from "@recursyve/nestjs-rosetta-core";
import { TRANSLATION_COLUMN_METADATA_KEY } from "../decorators/translation-column.decorator";

export function NestjsRosettaSequelizeAfterFind(instanceOrInstances: Model | Model[]) {
    if (!(instanceOrInstances instanceof Array)) {
        instanceOrInstances = [instanceOrInstances];
    }

    for (const instance of instanceOrInstances) {
        if (!instance?.["dataValues"]) continue;

        for (const key of Object.keys(instance["dataValues"])) {
            if (Reflect.getMetadata(TRANSLATION_COLUMN_METADATA_KEY, Object.getPrototypeOf(instance), key)) {
                instance["dataValues"][key] = new TranslationObject(instance["dataValues"][key]);
            } else if (instance["dataValues"][key]?.["dataValues"]) {
                // Run the hook on nested models
                NestjsRosettaSequelizeAfterFind(instance["dataValues"][key]);
            }
        }
    }
}
