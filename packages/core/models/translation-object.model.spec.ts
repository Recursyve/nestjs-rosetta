import { TranslationObject } from "./translation-object.model";

describe("TranslationObject", () => {
    it("Passing a string in the constructor should return a valid translation object", () => {
        const obj = new TranslationObject("{\"en\":\"Hello World!\"}");
        expect(obj).toBeDefined();
        expect(obj.get("en")).toEqual("Hello World!");
    });

    it("Setting disableFallback at true should return not fallback the to the first available translation", () => {
        const obj = new TranslationObject({ fr: "Test!" }, { disableFallback: true });
        expect(obj).toBeDefined();
        expect(obj.getOrFirstIfNull("fr")).toEqual("Test!");
        expect(obj.getOrFirstIfNull("en")).toEqual(null);
    });

    describe("isTranslatedId", () => {
        it("should return true if the translation object is translated in all the languages passed in", () => {
            const translationObject = new TranslationObject({ fr: "oui", en: "yes" });

            expect(translationObject.isTranslatedIn(["fr", "en"])).toEqual(true);
        })

        it("should return true if the translation object is translated in all the languages passed in and much more", () => {
            const translationObject = new TranslationObject({ fr: "oui", en: "yes", es: "si" });

            expect(translationObject.isTranslatedIn(["fr", "en"])).toEqual(true);
        })

        it("should return false if the translation object is translated in some of the languages passed", () => {
            const translationObject = new TranslationObject({ fr: "oui", en: "yes" });

            expect(translationObject.isTranslatedIn(["fr", "es"])).toEqual(false);
        })

        it("should return false if the translation object is not translated in any of the languages passed", () => {
            const translationObject = new TranslationObject({ es: "si" });

            expect(translationObject.isTranslatedIn(["fr", "en"])).toEqual(false);
        })
    });
});
