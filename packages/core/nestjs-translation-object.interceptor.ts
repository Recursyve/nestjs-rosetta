import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { NESTJS_TRANSLATION_OBJECT_TRANSFORMER_TOKEN } from "./constants";
import { NestjsTranslationObjectTransformer } from "./nestjs-translation-object.transformer";

@Injectable()
export class NestjsTranslationObjectInterceptor implements NestInterceptor {
    constructor(@Inject(NESTJS_TRANSLATION_OBJECT_TRANSFORMER_TOKEN) private transformers: NestjsTranslationObjectTransformer[]) {
    }

    public intercept(context: ExecutionContext, next: CallHandler): any {

        return next.handle();
    }
}
