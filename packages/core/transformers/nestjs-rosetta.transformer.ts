import { Injectable } from "@nestjs/common";
import { TranslationObject } from "../models/translation-object.model";
import { NestjsRosettaInterceptorConfig } from "../interfaces/nestjs-rosetta-interceptor.config";

export abstract class NestjsRosettaTransformer {
    public abstract canTransform(value: any): boolean;

    public abstract transformValue(value: any, objectDepth: number, config: NestjsRosettaInterceptorConfig): any;

    public abstract transformArray(values: any[], objectDepth: number, config: NestjsRosettaInterceptorConfig): any[];

    public abstract transformObject(value: any, objectDepth: number, config: NestjsRosettaInterceptorConfig): any;
}

@Injectable()
export class NestjsRosettaDefaultTransformer extends NestjsRosettaTransformer {
    public canTransform(value: any): boolean {
        return true;
    }

    public transformValue(value: any, objectDepth: number, config: NestjsRosettaInterceptorConfig): any {
        if (value instanceof Array) {
            return this.transformArray(value, objectDepth, config);
        }
        if (typeof value === "object") {
            return this.transformObject(value, objectDepth + 1, config);
        }

        return value;
    }

    public transformArray(values: any[], objectDepth: number, config: NestjsRosettaInterceptorConfig): any[] {
        return values.map((value) => this.transformValue(value, objectDepth, config));
    }

    public transformObject(value: any, objectDepth: number, config: NestjsRosettaInterceptorConfig): any {
        if (this.maxObjectDepthReached(config.maxTranslationDepth, objectDepth)) {
            return value;
        }

        for (const key in value) {
            if (!value.hasOwnProperty(key) || value[key] === null || value[key] === undefined) {
                continue;
            }

            if (value[key] instanceof TranslationObject) {
                value[key] = (value[key] as TranslationObject).getOrFirstIfNull(config.language);
            } else {
                value[key] = this.transformValue(value[key], objectDepth, config);
            }
        }
        return value;
    }

    protected maxObjectDepthReached(maxTranslationDepth: number | undefined, objectDepth: number): boolean {
        return maxTranslationDepth !== null && maxTranslationDepth !== undefined && objectDepth > maxTranslationDepth;
    }
}
