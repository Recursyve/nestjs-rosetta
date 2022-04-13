export interface TranslationObjectProcessor {
    canProcess(value: any): boolean;

    getProcessableProperties(value: any): (string | symbol)[];
}
