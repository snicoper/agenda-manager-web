/**
 * Define cómo gestionar los conflictos temporales al crear o modificar citas:
 * permitir la creación aunque existan solapamientos con otras citas, o rechazarla.
 */
export enum AppointmentOverlappingStrategy {
  Allow = 1,
  Reject = 2,
}
