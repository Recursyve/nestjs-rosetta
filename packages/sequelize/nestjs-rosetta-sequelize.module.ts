import { Module, OnModuleInit } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { NestjsRosettaSequelizeAfterFind } from "./hooks/after-find.hook";

@Module({})
export class NestjsRosettaSequelizeModule implements OnModuleInit {
    constructor(private sequelize: Sequelize) {
    }

    public onModuleInit(): void {
        this.sequelize.addHook("afterFind", NestjsRosettaSequelizeAfterFind);
    }
}
