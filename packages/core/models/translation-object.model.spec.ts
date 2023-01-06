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
        expect(obj.getOrFirstIfNull("en")).toEqual(null);
    });
});
