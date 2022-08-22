import { DynamicModule, Module, StreamableFile } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { NESTJS_ROSETTA_OPTIONS_TOKEN } from "./constants/constants";
import { NestjsRosettaInterceptor } from "./interceptors/nestjs-rosetta.interceptor";
import { NestjsRosettaOptions } from "./interfaces/nestjs-rosetta.options";
import { TypeSkipTranslationStrategy } from "./skip-translation-strategies/type.skip-translation-strategy";
import { Buffer } from "buffer";
import { Readable } from "stream";

@Module({})
export class NestjsRosettaModule {
    static readonly DEFAULT_SKIP_TRANSLATION_STRATEGIES = [
        new TypeSkipTranslationStrategy(Buffer),
        new TypeSkipTranslationStrategy(StreamableFile),
        new TypeSkipTranslationStrategy(Readable),
    ];

    public static forRoot(options: NestjsRosettaOptions): DynamicModule {
        options.skipTranslationStrategies ??= NestjsRosettaModule.DEFAULT_SKIP_TRANSLATION_STRATEGIES;

        return {
            module: NestjsRosettaModule,
            providers: [
                {
                    provide: APP_INTERCEPTOR,
                    useClass: NestjsRosettaInterceptor
                },
                {
                    provide: NESTJS_ROSETTA_OPTIONS_TOKEN,
                    useValue: options
                }
            ]
        };
    }
}
