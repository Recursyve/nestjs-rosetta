import { TranslationObjectProcessor } from "@lightx/nestjs-rosetta-core";

export class MongooseTranslationObjectProcessor
  implements TranslationObjectProcessor
{
  public canProcess(value: any): boolean {
    return value?._doc !== null && value?._doc !== undefined;
  }

  public getProcessableProperties(value: any): (string | symbol)[] {
    return ["_doc"];
  }
}
