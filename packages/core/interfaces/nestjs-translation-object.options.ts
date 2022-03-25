import { NestjsTranslationObjectTransformer } from "../transformers/nestjs-translation-object.transformer";
import { Type } from "@nestjs/common";

export interface NestjsTranslationObjectOptions {
    transformers: NestjsTranslationObjectTransformer[];
    supportedLanguages: string[];
    fallbackLanguage: string;
}
