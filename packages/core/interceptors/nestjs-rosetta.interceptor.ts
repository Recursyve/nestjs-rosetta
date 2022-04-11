import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { NESTJS_ROSETTA_OPTIONS_TOKEN } from "../constants/constants";
import { map, Observable } from "rxjs";
import { NestjsRosettaDefaultTransformer } from "../transformers/nestjs-rosetta.transformer";
import { NestjsRosettaInterceptorConfig } from "../interfaces/nestjs-rosetta-interceptor.config";
import { NestjsRosettaOptions } from "../interfaces/nestjs-rosetta.options";
import { TranslationObject } from "../models/translation-object.model";

@Injectable()
export class NestjsRosettaInterceptor implements NestInterceptor {
    constructor(
        @Inject(NESTJS_ROSETTA_OPTIONS_TOKEN) private options: NestjsRosettaOptions,
        private defaultTransformer: NestjsRosettaDefaultTransformer
    ) {
    }

    public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const config = NestjsRosettaInterceptorConfig.fromRequest(context.switchToHttp().getRequest(), this.options);
        if (config.skipTranslation) {
            return next.handle();
        }

        return next.handle().pipe(map((value) => this.transformValue(value, 0, config)));
    }

    private transformValue(value: any, depth: number, config: NestjsRosettaInterceptorConfig): any {
        if (value instanceof Array) {
            return value.map((v) => this.transformValue(v, depth, config));
        }

        if (typeof value === "object") {
            return this.transformObject(value, depth + 1, config);
        }

        return value;
    }

    private transformArray(value: Array<any>, depth: number, config: NestjsRosettaInterceptorConfig): Array<any> {
        return value.map(v => this.transformValue(v, depth, config));
    }

    private transformObject(value: any, depth: number, config: NestjsRosettaInterceptorConfig) {
        if (this.maxObjectDepthReached(config.maxTranslationDepth, depth)) {
            return value;
        }

        const transformer = this.options.transformers.find((transformer) => transformer.canTransform(value));
        const transformedValue = (transformer ?? this.defaultTransformer).transformValue(value, config);

        if (transformedValue.value === null || transformedValue === undefined) {
            return transformedValue.value;
        }

        if (typeof transformedValue.value === "object") {
            for (const key of transformedValue.transformValueKeys ?? Object.keys(transformedValue.value)) {
                if (!transformedValue.value.hasOwnProperty(key) || transformedValue.value[key] === null || transformedValue.value[key] === undefined) {
                    continue;
                }

                if (transformedValue.value[key] instanceof TranslationObject) {
                    transformedValue.value[key] = (transformedValue.value[key] as TranslationObject).getOrFirstIfNull(config.language);
                } else {
                    transformedValue.value[key] = this.transformValue(transformedValue.value[key], depth, config);
                }
            }

            return transformedValue.value;
        }

        return this.transformValue(transformedValue.value, depth, config);
    }

    private maxObjectDepthReached(maxTranslationDepth: number | undefined, objectDepth: number): boolean {
        return maxTranslationDepth !== null && maxTranslationDepth !== undefined && objectDepth > maxTranslationDepth;
    }
}
