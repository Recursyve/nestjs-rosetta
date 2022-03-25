import { Module, OnModuleInit } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";

@Module({})
export class NestjsTranslationObjectSequelizeModule implements OnModuleInit {
    constructor(private sequelize: Sequelize) {}

    public onModuleInit(): void {
        // this.sequelize.addHook("afterFind", );
    }
}
