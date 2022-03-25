export interface NestjsTranslationObjectTransformer {
    matches(value: any): boolean;

    transform(value: any): any;
}
