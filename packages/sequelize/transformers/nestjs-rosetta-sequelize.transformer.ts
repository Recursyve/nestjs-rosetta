import {
    NestjsRosettaDefaultTransformer,
    NestjsRosettaInterceptorConfig,
    TransformedValue
} from "@recursyve/nestjs-rosetta-core";

export class NestjsRosettaSequelizeTransformer extends NestjsRosettaDefaultTransformer {
    public override canTransform(value: any): boolean {
        return value?.dataValues !== null && value?.dataValues !== undefined;
    }

    public override transformValue(value: any, config: NestjsRosettaInterceptorConfig): TransformedValue {
        return {
            value,
            transformValueKeys: ["dataValues"]
        };
    }
}
