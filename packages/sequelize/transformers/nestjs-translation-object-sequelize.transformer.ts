import { NestjsTranslationObjectDefaultTransformer } from "../../core/transformers/nestjs-translation-object.transformer";
import { NestjsTranslationObjectInterceptorConfig } from "../../core/interfaces/nestjs-translation-object-interceptor.config";
import { TranslationObject } from "../../core/models/translation-object.model";

export class NestjsTranslationObjectSequelizeTransformer extends NestjsTranslationObjectDefaultTransformer {
    public override canTransform(value: any): boolean {
        return value?.dataValues !== null && value?.dataValues !== undefined;
    }

    public override transformObject(value: any, objectDepth: number, config: NestjsTranslationObjectInterceptorConfig): any {
        console.log(objectDepth);

        if (super.maxObjectDepthReached(config.maxTranslationDepth, objectDepth)) {
            return value;
        }

        if (!value || typeof value !== "object") {
            return value;
        }

        if (!value.dataValues) {
            return super.transformObject(value, objectDepth, config);
        }

        for (const key of Object.keys(value.dataValues)) {
            if (value.dataValues[key] instanceof TranslationObject) {
                value.dataValues[key] = (value[key] as TranslationObject).getOrFirstIfNull(config.language);
            } else {
                value.dataValues[key] = super.transformValue(value.dataValues[key], objectDepth, config);
            }
        }

        return value;
    }
}
