import { BaseEnumInfo } from '../interfaces/enum-utils.interface';

export class EnumUtils<TEnum extends number | string, TEnumInfo extends BaseEnumInfo> {
  constructor(private readonly enumInfo: Record<TEnum, TEnumInfo>) {}

  getOptions(): ({ value: TEnum } & TEnumInfo)[] {
    return Object.entries(this.enumInfo).map(([key, info]) => {
      // Forzamos la conversión a número si el enum es numérico
      const enumValue = !isNaN(Number(key)) ? Number(key) : key;

      return {
        value: enumValue as unknown as TEnum,
        ...(info as TEnumInfo),
      };
    });
  }

  getInfoByValue(value: TEnum): TEnumInfo | null {
    return this.enumInfo[value] ?? null;
  }

  getCodeByValue(value: TEnum): string {
    return this.enumInfo[value]?.code ?? '';
  }

  getDescriptionByValue(value: TEnum): string {
    return this.enumInfo[value]?.description ?? '';
  }

  isValidValue(value: TEnum): boolean {
    return value in this.enumInfo;
  }
}
