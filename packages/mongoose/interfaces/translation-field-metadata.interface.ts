import { TranslationObjectOptions } from "@recursyve/nestjs-rosetta-core";

export interface TranslationFieldMetadataInterface extends TranslationObjectOptions {
    paths: string[];
}
