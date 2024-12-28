import { BaseEnumInfo } from './enum-utils.interface';

/**
 * Generic utility class for handling enums with additional display information.
 * Provides a type-safe way to work with enums and their associated metadata like codes and descriptions.
 *
 * @template TEnum - The enum type (must be number or string)
 * @template TEnumInfo - The type of additional information associated with each enum value (must extend BaseEnumInfo)
 *
 * @example
 * enum ResourceCategory {
 *   Staff = 1,
 *   Place = 2
 * }
 *
 * // Define the display info
 * const resourceCategoryInfo: Record<ResourceCategory, BaseEnumInfo> = {
 *   [ResourceCategory.Staff]: {
 *     code: 'STAFF',
 *     description: 'Company Employee'
 *   },
 *   [ResourceCategory.Place]: {
 *     code: 'PLACE',
 *     description: 'Physical Location'
 *   }
 * };
 *
 * // Create and use the utils
 * const utils = new EnumUtils<ResourceCategory, BaseEnumInfo>(resourceCategoryInfo);
 * const options = utils.getOptions();
 * const code = utils.getCodeByValue(ResourceCategory.Staff);
 */
export class EnumUtils<TEnum extends number | string, TEnumInfo extends BaseEnumInfo> {
  constructor(private readonly enumInfo: Record<TEnum, TEnumInfo>) {}

  getOptions(): ({ value: TEnum } & TEnumInfo)[] {
    return Object.entries(this.enumInfo).map(([key, info]) => {
      // Forzamos la conversión a número si el enum es numérico.
      const enumValue = !isNaN(Number(key)) ? Number(key) : key;

      return {
        value: enumValue as unknown as TEnum,
        ...(info as TEnumInfo),
      };
    });
  }

  getInfoByValue(value: TEnum): TEnumInfo | null {
    if (this.isValidValue(value)) {
      return this.enumInfo[value];
    }

    return null;
  }

  getCodeByValue(value: TEnum): string {
    return !this.isValidValue(value) ? '' : this.enumInfo[value].code;
  }

  getDescriptionByValue(value: TEnum): string {
    return !this.isValidValue(value) ? '' : this.enumInfo[value].description;
  }

  isValidValue(value: TEnum): boolean {
    return value in this.enumInfo;
  }
}
