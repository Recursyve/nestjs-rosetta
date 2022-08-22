import { SetMetadata } from "@nestjs/common";
import { NESTJS_ROSETTA_SKIP_TRANSLATIONS_KEY } from "../constants/constants";

export const SkipTranslations = () => SetMetadata(NESTJS_ROSETTA_SKIP_TRANSLATIONS_KEY, true);
