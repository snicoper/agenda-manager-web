/** System roles that cannot be modified. */
export const SystemRoles = Object.freeze({
  /** System administrator. Has full access to the system. */
  Administrator: 'Administrator' as const,

  /** Internal company employee. Has access to basic system functionalities. */
  Employee: 'Employee' as const,

  /** User who receives the services. */
  Customer: 'Customer' as const,
});

export type SystemRole = (typeof SystemRoles)[keyof typeof SystemRoles];
