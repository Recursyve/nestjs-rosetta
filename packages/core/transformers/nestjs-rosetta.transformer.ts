import { Injectable } from "@nestjs/common";
import { TranslationObject } from "../models/translation-object.model";
import { NestjsRosettaInterceptorConfig } from "../interfaces/nestjs-rosetta-interceptor.config";
import { TransformedValue } from "../models/transformed-value.model";

export abstract class NestjsRosettaTransformer {
    public abstract canTransform(value: any): boolean;

    public abstract transformValue(value: any, config: NestjsRosettaInterceptorConfig): any;
}

@Injectable()
export class NestjsRosettaDefaultTransformer extends NestjsRosettaTransformer {
    public canTransform(value: any): boolean {
        return true;
    }

    public transformValue(value: any, config: NestjsRosettaInterceptorConfig): TransformedValue {
        for (const key in value) {
            if (!value.hasOwnProperty(key) || value[key] === null || value[key] === undefined) {
                continue;
            }

            if (value[key] instanceof TranslationObject) {
                value[key] = (value[key] as TranslationObject).getOrFirstIfNull(config.language);
            }
        }

        return {
            value
        };
    }
}
