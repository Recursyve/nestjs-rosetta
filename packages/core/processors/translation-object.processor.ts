import { Injectable } from "@nestjs/common";
import { TranslationObject } from "../models/translation-object.model";
import { TransformedValue } from "../models/transformed-value.model";

export interface TranslationObjectProcessor {
    canProcess(value: any): boolean;

    getProcessableProperties(value: any): (string | symbol)[];
}
