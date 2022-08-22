import { TranslationObjectProcessor } from "../processors/translation-object.processor";
import { SkipTranslationStrategy } from "../skip-translation-strategies/skip-translation-strategy";

export interface NestjsRosettaOptions {
    processors: TranslationObjectProcessor[];
    supportedLanguages: string[];
    fallbackLanguage: string;
    skipTranslationStrategies?: SkipTranslationStrategy[];
}
