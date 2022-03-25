import { DynamicModule, Module } from "@nestjs/common";
import { NestjsTranslationObjectOptions } from "./interfaces/nestjs-translation-object.options";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { NestjsTranslationObjectInterceptor } from "./nestjs-translation-object.interceptor";
import { NESTJS_TRANSLATION_OBJECT_TRANSFORMER_TOKEN } from "./constants";

@Module({})
export class NestjsTranslationObjectModule {
    public static forRoot(options: NestjsTranslationObjectOptions): DynamicModule {
        return {
            module: NestjsTranslationObjectModule,
            providers: [
                {
                    provide: APP_INTERCEPTOR,
                    useClass: NestjsTranslationObjectInterceptor
                },
                ...options.transformers.map(transformer => ({
                    provide: NESTJS_TRANSLATION_OBJECT_TRANSFORMER_TOKEN,
                    useClass: transformer
                }))
            ]
        };
    }
}
