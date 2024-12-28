/**
 * Define si se validan los horarios de disponibilidad de los recursos requeridos al crear una cita.
 * Los requisitos del servicio siempre se comprueban, pero la validación de los horarios puede ser opcional.
 */
export enum ResourceScheduleValidationStrategy {
  Validate = 1,
  Ignore = 2,
}
