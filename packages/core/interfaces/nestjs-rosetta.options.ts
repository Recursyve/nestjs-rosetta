import { NestjsRosettaTransformer } from "../transformers/nestjs-rosetta.transformer";

export interface NestjsRosettaOptions {
    transformers: NestjsRosettaTransformer[];
    supportedLanguages: string[];
    fallbackLanguage: string;
}
