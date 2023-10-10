import { NestjsRosettaInterceptorConfig } from "../interfaces/nestjs-rosetta-interceptor.config";

export type RosettaRequestExtension = {
    rosetta?: NestjsRosettaInterceptorConfig;
}
