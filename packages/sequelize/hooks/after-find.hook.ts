import { TranslationObject } from "@recursyve/nestjs-translation-object-core";
import { Model } from "sequelize-typescript";
import { TRANSLATION_COLUMN_METADATA_KEY } from "../decorators/translation-column.decorator";

export function NestjsTranslationObjectSequelizeAfterFind(instanceOrInstances: Model | Model[]) {
    if (!(instanceOrInstances instanceof Array)) {
        instanceOrInstances = [instanceOrInstances];
    }

    for (const instance of instanceOrInstances) {
        if (!instance?.["dataValues"]) continue;

        for (const key of Object.keys(instance["dataValues"])) {
            if (Reflect.getMetadata(TRANSLATION_COLUMN_METADATA_KEY, Object.getPrototypeOf(instance), key)) {
                instance["dataValues"][key] = new TranslationObject(instance["dataValues"][key]);
            }
        }
    }
}
