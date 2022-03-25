import { DynamicModule, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { NestjsTranslationObjectInterceptor } from "./interceptors/nestjs-translation-object.interceptor";
import { NESTJS_TRANSLATION_OBJECT_OPTIONS_TOKEN } from "./constants/constants";
import { NestjsTranslationObjectOptions } from "./interfaces/nestjs-translation-object.options";
import { NestjsTranslationObjectDefaultTransformer } from "./transformers/nestjs-translation-object.transformer";

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
                {
                    provide: NESTJS_TRANSLATION_OBJECT_OPTIONS_TOKEN,
                    useValue: options
                },
                NestjsTranslationObjectDefaultTransformer
            ]
        };
    }
}
