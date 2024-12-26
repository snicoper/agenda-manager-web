/**
 * Define cómo gestionar los conflictos cuando un día festivo se solapa con citas existentes:
 * permitir que coexistan, rechazar la operación, o cancelar automáticamente las citas afectadas.
 */
export enum HolidayConflictStrategy {
  Allow = 1,
  Reject = 2,
  Cancel = 3,
}
