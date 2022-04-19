import { TranslationObject } from "@recursyve/nestjs-rosetta-core";
import { Column, DataType, Model, Sequelize, Table } from "sequelize-typescript";

@Table
class MyCustomModel extends Model {
    @Column(DataType.JSON)
    testJson: TranslationObject;
}

describe("NestjsRosettaSequelizeAfterFind", () => {
    let sequelize: Sequelize;

    beforeAll(() => {
        sequelize = new Sequelize({
            database: 'test_db',
            dialect: 'sqlite',
            username: 'root',
            password: '',
            storage: ':memory:',
            models: [MyCustomModel]
        })
    });

    it("Creating a new sequelize instance should return a valid instance", () => {
        const instance = new MyCustomModel({
            testJson: {
                en: "Hello World!"
            }
        });
        expect(instance).toBeDefined();
    });
});
