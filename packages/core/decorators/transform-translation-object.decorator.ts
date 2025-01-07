import { isDefined } from "@recursyve/nice-ts-utils";
import { Transform } from "class-transformer";
import { isObject } from "class-validator";
import { TranslationObjectOptions } from "../interfaces/translation-object.options";
import { TranslationObject } from "../models/translation-object.model";

export const TransformTranslationObject = (
  options: TranslationObjectOptions = {}
): PropertyDecorator =>
  Transform(({ value }) => {
    if (!isDefined(value)) {
      return value;
    }

    if (!isObject(value)) {
      return undefined;
    }

    return new TranslationObject(value, options);
  });
