import { SkipTranslationStrategy } from "./skip-translation-strategy";
import { Type } from "@nestjs/common";

export class TypeSkipTranslationStrategy extends SkipTranslationStrategy {
    private types: Type[];

    constructor(...types: Type[]) {
        super();
        this.types = types;
    }

    public override shouldSkip(value: any): boolean {
        return this.types.some(type => value instanceof type);
    }
}
