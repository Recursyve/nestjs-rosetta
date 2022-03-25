export class TranslationObject {
    [key: string]: string | unknown;

    private readonly _languages: string[];

    constructor(translations: string | Object) {
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

    public get(language: string): string {
        return this[language] as string;
    }

    public getOrFirstIfNull(language: string): string {
        if (this[language]) return this[language] as string;

        for (const language of this._languages) {
            if (this[language]) return this[language] as string;
        }
    }

    public getAll(): {} {
        const { _languages, ...values } = this;
        return { ...values };
    }

    public toJSON(): any {
        return this.getAll();
    }
}
