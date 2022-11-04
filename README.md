# nestjs-rosetta

## Overview

`nestjs-rosetta` is a `nestjs` library that provides a way to automatically translate multilingual values stored in a database before returning them to the client.

For example, we can have a `JSON` typed column in a database table with values `{ en: "Hello", fr: "Bonjour" }`. When returning the model instance to the client, `nestjs-rosetta` will automatically replace the `JSON` value with the appropriate translation, based on the `Accept-Language` request header. So if client has the header `Accept-Language=fr`, the json value returned will be replaced by `"Bonjour"`.

## Setup

In the root application module, we need to import the module, using `NestjsRosettaModule.forRoot({ ... })`.

We can provide multiple options to the module:

| Property                  | Type                         | Description                                                                                                                                          |
|---------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| processors                | TranslationObjectProcessor[] | Defines `TranslationObjectProcessor` to be used by `nestjs-rosetta`. [See below](#translationobjectprocessor) for more info about object processors. |
| supportedLanguages        | string[]                     | Array of supported languages. ex: `["en", "fr"]`                                                                                                     |
| fallbackLanguage          | string[]                     | Language on which to fallback if no language can be retrieved from the `Accept-Language` or the language is not in the `supportedLanguages` array.   |
| skipTranslationStrategies | SkipTranslationStrategy[]    | Defines `SkipTranslationStrategy` to be used be `nestjs-rosetta`. [See below](#skiptranslationstrategy) for more info on `SkipTranslationStrategy`.  |

## Sequelize

In order to use `nestjs-rosetta` with `Sequelize`, we first need to install `@recursyve/nestjs-rosetta-sequelize`.

Once installed, we can add the `NestjsRosettaSequelizeModule` to our application's root module imports, and configure the `NestjsRosettaModule`:

```typescript
import { Module } from "@nestjs/common";
import { NestjsRosettaModule } from "@recursyve/nestjs-rosetta-core";
import { NestjsRosettaSequelizeModule, SequelizeTranslationObjectProcessor } from "@recursyve/nestjs-rosetta-sequelize";

@Module({
    imports: [
        NestjsRosettaModule.forRoot({
            processors: [new SequelizeTranslationObjectProcessor()],
            supportedLanguages: ["en", "fr"],
            fallbackLanguage: "en"
        }),
        NestjsRosettaSequelizeModule
    ]
})
export class ApplicationModule {}
```

We are now ready to define translation columns in our models:

```typescript
import { AllowNull, Column, DataType, Model, Table } from "sequelize-typescript";
import { TranslationColumn } from "./translation-column.decorator";
import { TranslationObject } from "./translation-object.model";

@Table
class MyModel extends Model {
    @AllowNull(false)
    @Column(DataType.JSON)
    @TranslationColumn()
    name: TranslationObject;
}
```

Now, whenever we retrieve model instances from the database and return them to the client, the property `name` will be automatically converted from `TranslationObject` to a `string`, based on the client's language.

## `TranslationObjectProcessor`

`TranslationObjectProcessor` are used to retrieve translatable properties on supported objects.

For example, the `SequelizeTranslationObjectProcessor` (from `@recursyve/nestjs-rosetta-sequelize`) returns the `dataValues` property of sequelize model instances, since we don't need to traverse the entire objects, because the user-defined values will always be in `dataValues`.

## `SkipTranslationStrategy`

`SkipTranslationStrategy` are used to improve performance, by skipping certain source values (the value directly returned by the controllers).

There are currently only one implementation, `TypeSkipTranslationStrategy`, which takes an array of type. Values having any of the type in the strategy will not be checked for translation.
If `skipTranslationStrategies` is not passed in the module's options, it will default to `[new TypeSkipTranslationStrategy(Buffer, StreamableFile, Readable)]`.

## Query params options

Certain options can be passed via query params by the client:

| Name                | Type    | Description                                                                                                                                                                                 |
|---------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| skipTranslation     | boolean | If the value is `true`, `TranslationObject`s won't be translated for the current request. This can be used if the client wants to have the entire `TranslationObject`. Defaults to `false`. |
| maxTranslationDepth | integer | Recursive depth at which to stop looking for `TranslationObject` to translate.                                                                                                              |
