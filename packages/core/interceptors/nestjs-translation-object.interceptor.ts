import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { NESTJS_TRANSLATION_OBJECT_OPTIONS_TOKEN } from "../constants/constants";
import { NestjsTranslationObjectInterceptorConfig } from "../interfaces/nestjs-translation-object-interceptor.config";
import * as AcceptLanguageParser from "accept-language-parser";
import { Request } from "express";
import { NestjsTranslationObjectOptions } from "../interfaces/nestjs-translation-object.options";
import { NestjsTranslationObjectDefaultTransformer } from "../transformers/nestjs-translation-object.transformer";
import { map, Observable } from "rxjs";

@Injectable()
export class NestjsTranslationObjectInterceptor implements NestInterceptor {
    constructor(
        @Inject(NESTJS_TRANSLATION_OBJECT_OPTIONS_TOKEN) private options: NestjsTranslationObjectOptions,
        private defaultTransformer: NestjsTranslationObjectDefaultTransformer
    ) {
    }

    public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const config = this.buildConfigFromRequest(context.switchToHttp().getRequest());
        if (config.skipTranslation) {
            return next.handle();
        }

        return next.handle().pipe(map((value) => this.transformValue(value, config)));
    }

    private transformValue(value: any, config: NestjsTranslationObjectInterceptorConfig): any {
        if (value instanceof Array) {
            return value.map((v) => this.transformValue(v, config));
        } else {
            return this.transformObject(value, config);
        }
    }

    private transformObject(value: any, config: NestjsTranslationObjectInterceptorConfig) {
        const transformer = this.options.transformers.find((transformer) => transformer.canTransform(value));
        return (transformer ?? this.defaultTransformer).transformValue(value, 0, config);
    }

    private buildConfigFromRequest(request: Request): NestjsTranslationObjectInterceptorConfig {
        const language =
            AcceptLanguageParser.pick(this.options.supportedLanguages, request.header("accept-language"), { loose: true }) ??
            this.options.fallbackLanguage;

        const skipTranslation = request.query.skipTranslation === "true";
        const maxTranslationDepth = Number.isInteger(+request.query.maxTranslationDepth)
            ? Number.parseInt(<string>request.query.maxTranslationDepth)
            : undefined;

        return {
            language,
            skipTranslation,
            maxTranslationDepth
        };
    }
}
