import { TranslationObject } from "./translation-object.model";

describe("TranslationObject", () => {
    it("Passing a string in the constructor should return a valid translation object", () => {
        const obj = new TranslationObject("{\"en\":\"Hello World!\"}");
        expect(obj).toBeDefined();
        expect(obj.get("en")).toEqual("Hello World!");
    });
});
