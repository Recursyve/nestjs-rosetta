import { TranslationObjectOptions } from "@lightx/nestjs-rosetta-core";

export interface TranslationFieldMetadataInterface
  extends TranslationObjectOptions {
  paths: string[];
}
