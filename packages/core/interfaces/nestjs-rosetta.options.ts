import { TranslationObjectProcessor } from "../processors/translation-object.processor";

export interface NestjsRosettaOptions {
    processors: TranslationObjectProcessor[];
    supportedLanguages: string[];
    fallbackLanguage: string;
}
