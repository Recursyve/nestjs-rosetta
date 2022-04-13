import { DynamicModule, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { NESTJS_ROSETTA_OPTIONS_TOKEN } from "./constants/constants";
import { NestjsRosettaInterceptor } from "./interceptors/nestjs-rosetta.interceptor";
import { NestjsRosettaOptions } from "./interfaces/nestjs-rosetta.options";

@Module({})
export class NestjsRosettaModule {
    public static forRoot(options: NestjsRosettaOptions): DynamicModule {
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
