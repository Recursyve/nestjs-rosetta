import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { NESTJS_ROSETTA_OPTIONS_TOKEN } from "../constants/constants";
import * as AcceptLanguageParser from "accept-language-parser";
import { Request } from "express";
import { map, Observable } from "rxjs";
import { NestjsRosettaDefaultTransformer } from "../transformers/nestjs-rosetta.transformer";
import { NestjsRosettaInterceptorConfig } from "../interfaces/nestjs-rosetta-interceptor.config";
import { NestjsRosettaOptions } from "../interfaces/nestjs-rosetta.options";

@Injectable()
export class NestjsRosettaInterceptor implements NestInterceptor {
    constructor(
        @Inject(NESTJS_ROSETTA_OPTIONS_TOKEN) private options: NestjsRosettaOptions,
        private defaultTransformer: NestjsRosettaDefaultTransformer
    ) {
    }

    public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const config = this.buildConfigFromRequest(context.switchToHttp().getRequest());
        if (config.skipTranslation) {
            return next.handle();
        }

        return next.handle().pipe(map((value) => this.transformValue(value, config)));
    }

    private transformValue(value: any, config: NestjsRosettaInterceptorConfig): any {
        if (value instanceof Array) {
            return value.map((v) => this.transformValue(v, config));
        } else {
            return this.transformObject(value, config);
        }
    }

    private transformObject(value: any, config: NestjsRosettaInterceptorConfig) {
        const transformer = this.options.transformers.find((transformer) => transformer.canTransform(value));
        return (transformer ?? this.defaultTransformer).transformValue(value, 0, config);
    }

    private buildConfigFromRequest(request: Request): NestjsRosettaInterceptorConfig {
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
