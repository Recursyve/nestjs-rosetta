import { NestjsTranslationObjectTransformer } from "../nestjs-translation-object.transformer";
import { Type } from "@nestjs/common";

export interface NestjsTranslationObjectOptions {
    transformers: Type<NestjsTranslationObjectTransformer>[];
}
