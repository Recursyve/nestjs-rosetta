import { SkipTranslationStrategy } from "./skip-translation-strategy";
import { Type } from "@nestjs/common";

export class TypeSkipTranslationStrategy extends SkipTranslationStrategy {
    constructor(private type: Type) {
        super();
    }

    public override shouldSkip(value: any): boolean {
        return value instanceof this.type;
    }
}
