import { Model } from "sequelize-typescript";
import { SEQUELIZE_TRANSLATION_OBJECT_METADATA_KEY } from "../decorators/sequelize-translation-object.decorator";
import { TranslationObject } from "../../core/models/translation-object.model";

export function NestjsTranslationObjectSequelizeAfterFind(instanceOrInstances: Model | Model[]) {
    if (!(instanceOrInstances instanceof Array)) {
        instanceOrInstances = [instanceOrInstances];
    }

    for (const instance of instanceOrInstances) {
        if (!instance?.["dataValues"]) continue;

        for (const key of Object.keys(instance["dataValues"])) {
            if (Reflect.getMetadata(SEQUELIZE_TRANSLATION_OBJECT_METADATA_KEY, Object.getPrototypeOf(instance), key)) {
                instance["dataValues"][key] = new TranslationObject(instance["dataValues"][key]);
            }
        }
    }
}
