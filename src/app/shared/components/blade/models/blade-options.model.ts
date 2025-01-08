export interface BladeOptions<TData = unknown> {
  width?: string;
  data?: TData;
  closeOnOutsideClick?: boolean;
  closeOnEscapeKey?: boolean;
}
