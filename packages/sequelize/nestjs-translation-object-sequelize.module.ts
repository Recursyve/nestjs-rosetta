import { Module, OnModuleInit } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { NestjsTranslationObjectSequelizeAfterFind } from "./hooks/after-find.hook";

@Module({})
export class NestjsTranslationObjectSequelizeModule implements OnModuleInit {
    constructor(private sequelize: Sequelize) {
    }

    public onModuleInit(): void {
        this.sequelize.addHook("afterFind", NestjsTranslationObjectSequelizeAfterFind);
    }
}
