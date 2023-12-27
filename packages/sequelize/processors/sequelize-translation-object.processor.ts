import { TranslationObjectProcessor } from "@lightx/nestjs-rosetta-core";

export class SequelizeTranslationObjectProcessor
  implements TranslationObjectProcessor
{
  public canProcess(value: any): boolean {
    return value?.dataValues !== null && value?.dataValues !== undefined;
  }

  public getProcessableProperties(value: any): (string | symbol)[] {
    return ["dataValues"];
  }
}
