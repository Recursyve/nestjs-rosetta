import { Request } from "express";
import * as AcceptLanguageParser from "accept-language-parser";
import { NestjsRosettaOptions } from "../interfaces/nestjs-rosetta.options";

export class NestjsRosettaInterceptorConfig {
    language: string;
    skipTranslation?: boolean;
    maxTranslationDepth?: number;

    constructor(value: Partial<NestjsRosettaInterceptorConfig>) {
        Object.assign(this, value);
    }

    static fromRequest(request: Request, opts: NestjsRosettaOptions): NestjsRosettaInterceptorConfig {
        const language =
            AcceptLanguageParser.pick(opts.supportedLanguages, request.header("accept-language"), { loose: true }) ??
            opts.fallbackLanguage;

        const skipTranslation = <string>request.query.skipTranslation === "true";
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
