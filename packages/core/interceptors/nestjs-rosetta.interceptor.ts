import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { NESTJS_ROSETTA_OPTIONS_TOKEN, NESTJS_ROSETTA_SKIP_TRANSLATIONS_KEY } from "../constants/constants";
import { map, Observable } from "rxjs";
import { NestjsRosettaInterceptorConfig } from "../interfaces/nestjs-rosetta-interceptor.config";
import { NestjsRosettaOptions } from "../interfaces/nestjs-rosetta.options";
import { TranslationObject } from "../models/translation-object.model";
import { Reflector } from "@nestjs/core";

@Injectable()
export class NestjsRosettaInterceptor implements NestInterceptor {
    constructor(@Inject(NESTJS_ROSETTA_OPTIONS_TOKEN) private options: NestjsRosettaOptions, private reflector: Reflector) {}

    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        const skipTranslations = this.reflector.get<boolean>(NESTJS_ROSETTA_SKIP_TRANSLATIONS_KEY, context.getHandler());
        if (skipTranslations) {
            return next.handle();
        }

        const config = NestjsRosettaInterceptorConfig.fromRequest(request, this.options);
        if (config.skipTranslation) {
            return next.handle();
        }

        return next.handle().pipe(map((value) => this.transformValue(value, 0, config)));
    }

    private transformValue(value: any, depth: number, config: NestjsRosettaInterceptorConfig): any {
        if (value === null || value === undefined) return value;

        if (value instanceof Array) {
            return value.map((v) => this.transformValue(v, depth, config));
        }

        if (typeof value === "object") {
            return this.transformObject(value, depth + 1, config);
        }

        return value;
    }

    private transformObject(value: any, depth: number, config: NestjsRosettaInterceptorConfig) {
        if (this.maxObjectDepthReached(config.maxTranslationDepth, depth)) {
            return value;
        }

        const processor = this.options.processors.find((transformer) => transformer.canProcess(value));
        const processableProperties = processor?.getProcessableProperties(value) ?? Object.keys(value);

        for (const key of processableProperties) {
            if (!value.hasOwnProperty(key) || value[key] === null || value[key] === undefined) {
                continue;
            }

            if (value[key] instanceof TranslationObject) {
                value[key] = (value[key] as TranslationObject).getOrFirstIfNull(config.language);
            } else {
                value[key] = this.transformValue(value[key], depth, config);
            }
        }

        return value;
    }

    private maxObjectDepthReached(maxTranslationDepth: number | undefined, objectDepth: number): boolean {
        return maxTranslationDepth !== null && maxTranslationDepth !== undefined && objectDepth > maxTranslationDepth;
    }
}
