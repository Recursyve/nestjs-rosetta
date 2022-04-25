import { TranslationObject } from "@recursyve/nestjs-rosetta-core";
import { Column, DataType, Model, Sequelize, Table } from "sequelize-typescript";
import { TranslationColumn } from "../decorators/translation-column.decorator";
import { NestjsRosettaSequelizeAfterFind } from "./after-find.hook";
import { TranslateWhen } from "../decorators/translate-when.decorator";

@Table
class MyCustomModel extends Model {
    @Column(DataType.JSON)
    @TranslationColumn()
    testJson: TranslationObject;
}

@Table
class NestedTranslationModel extends Model {
    @Column(DataType.JSON)
    @TranslationColumn("name", "link")
    links: [
        {
            name: TranslationObject,
            link: TranslationObject
        }
    ];
}

@Table
class ConditionalNestedTranslationModel extends Model {
    @Column(DataType.JSON)
    @TranslateWhen((value: ConditionalNestedTranslationModel) => value.config.type === "select")
    @TranslationColumn("values.value")
    config: {
        type: "select" | "integer",
        values?: {
            key: string,
            value: TranslationObject
        }[]
    };
}

@Table
class MultiLevelNestedTranslationModel extends Model {
    @Column(DataType.JSON)
    @TranslationColumn("name", "someField.names", "someField.moreNestedField.name")
    data: {
        name: TranslationObject,
        someField: {
            names: [TranslationObject],
            moreNestedField: {
                name: TranslationObject
            }
        },
        aDateBecauseWhyNot: Date
    };
}

describe("NestjsRosettaSequelizeAfterFind", () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            database: 'test_db',
            dialect: 'sqlite',
            username: 'root',
            password: '',
            storage: ':memory:',
            models: [MyCustomModel, NestedTranslationModel, MultiLevelNestedTranslationModel, ConditionalNestedTranslationModel],
            hooks: {
                afterFind: NestjsRosettaSequelizeAfterFind
            }
        })
        await sequelize.sync();
    });

    it("Creating a new sequelize instance should return a valid instance", () => {
        const instance = new MyCustomModel({
            testJson: {
                en: "Hello World!",
                fr: "Bonjour Monde!"
            }
        });
        expect(instance).toBeDefined();
    });

    it("Creating a model instance and then querying it should have its translation column as instances of TranslationObject", async () => {
        const instance = await MyCustomModel.create({
            testJson: {
                en: "Hello World!",
                fr: "Bonjour Monde!"
            }
        });

        const queriedInstance = await MyCustomModel.findByPk(instance.id);

        expect(queriedInstance.testJson).toBeInstanceOf(TranslationObject);
    });

    it("Creating a model instance with nested translation object should have its translation column as instances of TranslationObject", async () => {
        const instance = await NestedTranslationModel.create({
            links: [
                {
                    name: {
                        fr: "Nom FR",
                        en: "Name EN"
                    },
                    link: {
                        fr: "https://google.fr",
                        en: "https://google.com"
                    }
                }
            ]
        });

        const queriedInstance = await NestedTranslationModel.findByPk(instance.id);

        expect(queriedInstance.links).not.toBeInstanceOf(TranslationObject);
        expect(queriedInstance.links[0].name).toBeInstanceOf(TranslationObject);
        expect(queriedInstance.links[0].link).toBeInstanceOf(TranslationObject);
    });

    it("Creating a model instance with multiple level of nested translation object should have its translation column as instances of TranslationObject", async () => {
        const instance = await MultiLevelNestedTranslationModel.create({
            data: {
                name: {
                    fr: "Nom FR",
                    en: "Name EN"
                },
                someField: {
                    names: [
                        {
                            fr: "Nom FR",
                            en: null
                        },
                        {
                            fr: undefined,
                            en: "Name EN"
                        },
                        {
                            fr: "Nom FR",
                            en: "Name EN"
                        }
                    ],
                    moreNestedField: {
                        name: {
                            fr: "More nested field name FR",
                            en: "More nested field name EN",
                        }
                    }
                },
                aDateBecauseWhyNot: new Date()
            }
        });

        const queriedInstance = await MultiLevelNestedTranslationModel.findByPk(instance.id);

        expect(queriedInstance.data).not.toBeInstanceOf(TranslationObject);
        expect(queriedInstance.data.name).toBeInstanceOf(TranslationObject);
        expect(queriedInstance.data.someField).not.toBeInstanceOf(TranslationObject);
        expect(queriedInstance.data.someField.names).toBeInstanceOf(Array);
        queriedInstance.data.someField.names.forEach(name => expect(name).toBeInstanceOf(TranslationObject));
        expect(queriedInstance.data.someField.moreNestedField).not.toBeInstanceOf(TranslationObject);
        expect(queriedInstance.data.someField.moreNestedField.name).toBeInstanceOf(TranslationObject);
        expect(typeof queriedInstance.data.aDateBecauseWhyNot).toBe("string");
    });

    it("Columns should only be translated when TranslateWhen returns true", async () => {
        const selectInstance = await ConditionalNestedTranslationModel.create({
            config: {
                type: "select",
                values: [
                    { key: "one", value: { fr: "Un", en: "One" } },
                    { key: "two", value: { fr: "Deux", en: "Two" } },
                ]
            }
        });

        const integerInstance = await ConditionalNestedTranslationModel.create({
            config: {
                type: "integer"
            }
        });

        const integerInstanceWithValues = await ConditionalNestedTranslationModel.create({
            config: {
                type: "integer",
                values: [
                    { key: "a", value: { fr: "A FR", en: "A EN" } },
                    { key: "b", value: { fr: "B FR", en: "C EN" } },
                ]
            }
        });

        const queriedSelectInstance = await ConditionalNestedTranslationModel.findByPk(selectInstance.id);
        const queriedIntegerInstance = await ConditionalNestedTranslationModel.findByPk(integerInstance.id);
        const queriedIntegerInstanceWithValues = await ConditionalNestedTranslationModel.findByPk(integerInstanceWithValues.id);

        expect(queriedSelectInstance.config).not.toBeInstanceOf(TranslationObject);
        expect(queriedSelectInstance.config.type).toBe("select");
        expect(queriedSelectInstance.config.values).toBeInstanceOf(Array);
        queriedSelectInstance.config.values.forEach(value => {
            expect(value).not.toBeInstanceOf(TranslationObject);
            expect(typeof value.key).toBe("string");
            expect(value.value).toBeInstanceOf(TranslationObject);
        });

        expect(queriedIntegerInstance.config).not.toBeInstanceOf(TranslationObject);
        expect(queriedIntegerInstance.config.type).toBe("integer");
        expect(queriedIntegerInstance.config.values).toBeUndefined();

        expect(queriedIntegerInstanceWithValues.config).not.toBeInstanceOf(TranslationObject);
        expect(queriedIntegerInstanceWithValues.config.type).toBe("integer");
        expect(queriedIntegerInstanceWithValues.config.values).toBeInstanceOf(Array);
        queriedIntegerInstanceWithValues.config.values.forEach(value => {
            expect(value).not.toBeInstanceOf(TranslationObject);
            expect(typeof value.key).toBe("string");
            expect(value.value).not.toBeInstanceOf(TranslationObject);
        });
    });
});
