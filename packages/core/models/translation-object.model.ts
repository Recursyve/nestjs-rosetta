import { TranslationObjectOptions } from "../interfaces/translation-object.options";

export class TranslationObject {
    [key: string]: string | unknown;

    private readonly _languages: string[];

    constructor(translations: string | Object, public readonly options?: TranslationObjectOptions) {
        try {
            if (typeof translations === "string") {
                translations = JSON.parse(translations);
            }

            Object.assign(this, translations);
            this._languages = Object.keys(translations).filter(x => x !== "_languages");
        } catch (e) {
            this._languages = [];
        }
    }

    public get(language: string): string | null {
        return this[language] as string ?? null;
    }

    public getOrFirstIfNull(language: string): string | null {
        if (this[language]) return this[language] as string;

        if (this.options?.disableFallback) {
            return null;
        }

        for (const language of this._languages) {
            if (this[language]) return this[language] as string;
        }

        return null;
    }

    public getAll(): {} {
        const { _languages, options, ...values } = this;
        return { ...values };
    }

    public toJSON(): {} {
        return this.getAll();
    }
}
